import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Task } from '../../types';

interface ProductivityTrendsProps {
  tasks: Task[];
}

export const ProductivityTrends: React.FC<ProductivityTrendsProps> = ({ tasks }) => {
  // Get last 7 days of data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const trendData = last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const completedOnDay = tasks.filter(task => 
      task.status === 'completed' && 
      task.updated_at && 
      task.updated_at.split('T')[0] === dateStr
    ).length;
    
    const createdOnDay = tasks.filter(task => 
      task.created_at && 
      task.created_at.split('T')[0] === dateStr
    ).length;

    return {
      day: dayName,
      date: dateStr,
      completed: completedOnDay,
      created: createdOnDay
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-green-600">Completed: {payload[0].value}</p>
          <p className="text-sm text-blue-600">Created: {payload[1].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Productivity Trend</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              name="Completed"
            />
            <Line 
              type="monotone" 
              dataKey="created" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              name="Created"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};