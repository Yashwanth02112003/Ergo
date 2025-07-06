import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Task } from '../../types';

interface PriorityDistributionProps {
  tasks: Task[];
}

export const PriorityDistribution: React.FC<PriorityDistributionProps> = ({ tasks }) => {
  const priorityData = tasks.reduce((acc, task) => {
    const priority = task.priority;
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = [
    { priority: 'High', count: priorityData.high || 0, color: '#EF4444' },
    { priority: 'Medium', count: priorityData.medium || 0, color: '#F59E0B' },
    { priority: 'Low', count: priorityData.low || 0, color: '#10B981' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label} Priority</p>
          <p className="text-sm text-gray-600">{payload[0].value} tasks</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="priority" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};