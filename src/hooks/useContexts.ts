import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Context } from '../types';
import { extractTasksFromContext } from '../lib/openai';

export const useContexts = (userId: string | undefined) => {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch contexts from database
  const fetchContexts = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('contexts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContexts(data || []);
    } catch (error) {
      console.error('Error fetching contexts:', error);
    }
  };

  useEffect(() => {
    fetchContexts();
  }, [userId]);

  const addContext = async (content: string, sourceType: Context['source_type']) => {
    if (!userId) return;

    setLoading(true);
    try {
      // Extract tasks from context using AI
      const extractedTasks = await extractTasksFromContext(content, sourceType);
      
      // Save context to database
      const { data: contextData, error: contextError } = await supabase
        .from('contexts')
        .insert([{
          content,
          source_type: sourceType,
          user_id: userId,
          extracted_tasks: extractedTasks.length,
          processed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (contextError) throw contextError;

      // Save extracted tasks to database
      if (extractedTasks.length > 0) {
        const tasksToInsert = extractedTasks.map(task => ({
          ...task,
          user_id: userId,
          context_id: contextData.id
        }));

        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(tasksToInsert);

        if (tasksError) throw tasksError;
      }

      setContexts(prev => [contextData, ...prev]);
      return contextData;
    } catch (error) {
      console.error('Error adding context:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    contexts,
    loading,
    addContext,
    refreshContexts: fetchContexts
  };
};