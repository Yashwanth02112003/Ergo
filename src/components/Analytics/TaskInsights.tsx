import React from 'react';
import { Calendar, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { Task } from '../../types';

interface TaskInsightsProps {
  tasks: Task[];
}

export const TaskInsights: React.FC<TaskInsightsProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const overdueTasks = tasks.filter(t => 
    t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed'
  );
  
  // Calculate average completion time (for tasks with deadlines)
  const tasksWithDeadlines = completedTasks.filter(t => t.deadline);
  const avgCompletionTime = tasksWithDeadlines.length > 0 
    ? Math.round(tasksWithDeadlines.reduce((acc, task) => {
        const created = new Date(task.created_at);
        const deadline = new Date(task.deadline!);
        const daysDiff = Math.abs((deadline.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return acc + daysDiff;
      }, 0) / tasksWithDeadlines.length)
    : 0;

  // Most productive category
  const categoryStats = tasks.reduce((acc, task) => {
    if (task.status === 'completed') {
      acc[task.category] = (acc[task.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const mostProductiveCategory = Object.entries(categoryStats).reduce(
    (max, [category, count]) => count > max.count ? { category, count } : max,
    { category: 'None', count: 0 }
  );

  // Upcoming deadlines (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingDeadlines = tasks.filter(t => 
    t.deadline && 
    new Date(t.deadline) <= nextWeek && 
    new Date(t.deadline) >= new Date() &&
    t.status !== 'completed'
  ).length;

  const insights = [
    {
      title: 'Average Task Duration',
      value: avgCompletionTime > 0 ? `${avgCompletionTime} days` : 'No data',
      description: 'Average time from creation to deadline',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Most Productive Category',
      value: mostProductiveCategory.category,
      description: `${mostProductiveCategory.count} tasks completed`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Upcoming Deadlines',
      value: upcomingDeadlines.toString(),
      description: 'Tasks due in next 7 days',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Overdue Tasks',
      value: overdueTasks.length.toString(),
      description: 'Tasks past their deadline',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-lg ${insight.bgColor}`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-white`}>
                <insight.icon className={`w-5 h-5 ${insight.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{insight.title}</p>
                <p className={`text-xl font-bold ${insight.color}`}>{insight.value}</p>
                <p className="text-xs text-gray-500">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};