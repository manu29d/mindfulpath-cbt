import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ThoughtRecord } from '../types';

interface MoodChartProps {
  data: ThoughtRecord[];
}

const MoodChart: React.FC<MoodChartProps> = ({ data }) => {
  // Process data for chart: sort by date, take last 7 entries
  const chartData = [...data]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(record => ({
      date: new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      mood: record.mood,
      intensity: record.moodIntensity,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 rounded-xl border border-slate-200 text-slate-400">
        No mood data yet. Start a check-in!
      </div>
    );
  }

  return (
    <div className="h-64 w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500 mb-4">Mood Trend (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#94a3b8' }} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]} 
            tickFormatter={(val) => ['Terrible', 'Bad', 'Okay', 'Good', 'Great'][val - 1]}
            width={50}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{ stroke: '#cbd5e1', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="#0ea5e9" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;