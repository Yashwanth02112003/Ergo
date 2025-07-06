import React from 'react';
import { Calendar, MessageSquare, Mail, FileText, Users, CheckCircle } from 'lucide-react';
import { Context } from '../types';

interface ContextHistoryProps {
  contexts: Context[];
}

const sourceIcons = {
  email: Mail,
  message: MessageSquare,
  note: FileText,
  meeting: Users
};

export const ContextHistory: React.FC<ContextHistoryProps> = ({ contexts }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-4">Context History</h3>
      
      {contexts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No context history yet</p>
      ) : (
        <div className="space-y-4">
          {contexts.map((context) => {
            const Icon = sourceIcons[context.source_type];
            return (
              <div key={context.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium capitalize">
                      {context.source_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(context.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {context.processed_at && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Processed</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                  {context.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{context.extracted_tasks} tasks extracted</span>
                  {context.processed_at && (
                    <span>
                      Processed {new Date(context.processed_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};