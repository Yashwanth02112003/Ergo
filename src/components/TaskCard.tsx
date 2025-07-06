import React from 'react';
import { Calendar, Clock, CheckCircle, Circle, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  high: 'border-red-500 bg-red-50',
  medium: 'border-orange-500 bg-orange-50',
  low: 'border-green-500 bg-green-50'
};

const priorityIcons = {
  high: <AlertCircle className="w-4 h-4 text-red-500" />,
  medium: <Clock className="w-4 h-4 text-orange-500" />,
  low: <Circle className="w-4 h-4 text-green-500" />
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'completed';
  const deadlineText = new Date(task.deadline).toLocaleDateString();

  return (
    <div className={`bg-white rounded-lg border-l-4 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
      task.status === 'completed' ? 'opacity-60' : ''
    } ${priorityColors[task.priority]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggle(task.id)}
            className="mt-1 hover:scale-110 transition-transform"
          >
            {task.status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
          
          <div className="flex-1">
            <h3 className={`font-semibold text-gray-900 ${
              task.status === 'completed' ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                {priorityIcons[task.priority]}
                <span className="text-xs font-medium capitalize">{task.priority}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className={`text-xs ${
                  isOverdue ? 'text-red-500 font-semibold' : 'text-gray-500'
                }`}>
                  {deadlineText}
                </span>
              </div>
              
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {task.category}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};