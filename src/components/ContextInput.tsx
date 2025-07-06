import React, { useState } from 'react';
import { MessageSquare, Mail, FileText, Users, Send, Loader2 } from 'lucide-react';
import { Context } from '../types';

interface ContextInputProps {
  onAddContext: (content: string, sourceType: Context['source_type']) => Promise<Context>;
  loading: boolean;
}

const sourceTypes = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'message', label: 'Message', icon: MessageSquare },
  { value: 'note', label: 'Note', icon: FileText },
  { value: 'meeting', label: 'Meeting', icon: Users }
] as const;

export const ContextInput: React.FC<ContextInputProps> = ({ onAddContext, loading }) => {
  const [content, setContent] = useState('');
  const [sourceType, setSourceType] = useState<Context['source_type']>('email');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    await onAddContext(content, sourceType);
    setContent('');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Add Context</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Type
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {sourceTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSourceType(value)}
                  className={`p-3 rounded-md border transition-all ${
                    sourceType === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your email, message, or notes here..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Process Context
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};