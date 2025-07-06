import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, Tag, AlertCircle, Loader2 } from 'lucide-react';
import { Task } from '../types';
import { TaskEnhancement } from '../lib/openai';

interface TaskFormProps {
  task?: Task | null;
  onSave: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => void;
  onCancel: () => void;
  onEnhanceTask: (title: string, description: string) => Promise<TaskEnhancement>;
}

const categories = ['Work', 'Personal', 'Health', 'Finance', 'Shopping', 'Travel'];
const priorities = ['high', 'medium', 'low'] as const;

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, onEnhanceTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'medium' as const,
    deadline: '',
    status: 'pending' as const
  });

  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<TaskEnhancement | null>(null);
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        deadline: task.deadline || '',
        status: task.status
      });
    }
  }, [task]);

  const handleAIEnhance = async () => {
    if (!formData.title.trim()) return;
    
    setEnhancing(true);
    setShowAISuggestions(true);
    
    try {
      const enhancement = await onEnhanceTask(formData.title, formData.description);
      setAiSuggestion(enhancement);
    } catch (error) {
      console.error('Error enhancing task:', error);
      setShowAISuggestions(false);
    } finally {
      setEnhancing(false);
    }
  };

  const applySuggestion = (suggestion: TaskEnhancement) => {
    setFormData({
      ...formData,
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      priority: suggestion.priority,
      deadline: suggestion.suggestedDeadline
    });
    setShowAISuggestions(false);
    setAiSuggestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    onSave({
      ...formData,
      context_id: task?.context_id || null
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task title..."
                required
              />
              <button
                type="button"
                onClick={handleAIEnhance}
                disabled={enhancing || !formData.title.trim()}
                className="absolute right-2 top-2 p-1 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                title="AI Enhance"
              >
                {enhancing ? (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-blue-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe your task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        {showAISuggestions && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              AI Enhancement
            </h3>
            
            {enhancing ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-blue-600">Analyzing task...</span>
              </div>
            ) : aiSuggestion ? (
              <div className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{aiSuggestion.title}</span>
                  <span className="text-xs text-blue-600">
                    {Math.round(aiSuggestion.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{aiSuggestion.description}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                  <span>{aiSuggestion.category}</span>
                  <span>•</span>
                  <span>{aiSuggestion.priority} priority</span>
                  <span>•</span>
                  <span>{new Date(aiSuggestion.suggestedDeadline).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => applySuggestion(aiSuggestion)}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Apply Enhancement
                  </button>
                  <button
                    onClick={() => setShowAISuggestions(false)}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};