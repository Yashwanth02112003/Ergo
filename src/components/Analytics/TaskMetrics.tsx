import React from 'react';
import { CheckCircle, Clock, AlertCircle, TrendingUp, Calendar, Target } from 'lucide-react';
import { Task } from '../../types';

interface TaskMetricsProps {
  tasks: Task[];
}

export const TaskMetrics: React.FC<TaskMetricsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  
  const today = new Date();
  const overdueTasks = tasks.filter(t => 
    t.deadline && new Date(t.deadline) < today && t.status !== 'completed'
  ).length;
  
  const dueTodayTasks = tasks.filter(t => 
    t.deadline && new Date(t.deadline).toDateString() === today.toDateString()
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const metrics = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: Target,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: AlertCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      label: 'Due Today',
      value: dueTodayTasks,
      icon: Calendar,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
              <p className={`text-3xl font-bold ${metric.textColor}`}>{metric.value}</p>
            </div>
            <div className={`p-3 rounded-full ${metric.color}`}>
              <metric.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};