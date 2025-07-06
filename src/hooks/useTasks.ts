import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Task, TaskFilters } from '../types';
import { enhanceTask } from '../lib/openai';

export const useTasks = (userId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({
    category: 'all',
    priority: 'all',
    status: 'all',
    search: ''
  });

  // Fetch tasks from database
  const fetchTasks = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = filters.category === 'all' || task.category === filters.category;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         task.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesPriority && matchesStatus && matchesSearch;
  });

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === id ? data : task));
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTask(id, { status: newStatus });
    }
  };

  const enhanceTaskWithAI = async (title: string, description: string = '') => {
    try {
      const enhancement = await enhanceTask(title, description, tasks);
      return enhancement;
    } catch (error) {
      console.error('Error enhancing task:', error);
      throw error;
    }
  };

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    enhanceTaskWithAI,
    refreshTasks: fetchTasks
  };
};