import React from 'react';
import { Task } from '../../types';
import { TaskMetrics } from './TaskMetrics';
import { CategoryBreakdown } from './CategoryBreakdown';
import { PriorityDistribution } from './PriorityDistribution';
import { ProductivityTrends } from './ProductivityTrends';
import { TaskInsights } from './TaskInsights';

interface AnalyticsProps {
  tasks: Task[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ tasks }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600">Insights into your productivity and task management patterns</p>
      </div>
      
      <TaskMetrics tasks={tasks} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CategoryBreakdown tasks={tasks} />
        <PriorityDistribution tasks={tasks} />
      </div>
      
      <ProductivityTrends tasks={tasks} />
      
      <TaskInsights tasks={tasks} />
    </div>
  );
};