import React from 'react';
// FIX: Replaced global `window.Recharts` access with a direct import from the `recharts` library. This resolves the TypeScript error by allowing type inference and follows modern JavaScript module practices.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  name: string;
  Disponibilidade: number;
}

interface AvailabilityChartProps {
  data: ChartData[];
  title: string;
}

const ALERT_THRESHOLD = 80;

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded shadow-lg">
        <p className="font-bold">{label}</p>
        <p className="text-blue-500 dark:text-blue-400">{`Disponibilidade: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const AvailabilityChart: React.FC<AvailabilityChartProps> = ({ data, title }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} className="text-xs" />
            <YAxis unit="%" domain={[60, 100]} tick={{ fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(200,200,200,0.1)'}} />
            <Legend />
            <Bar dataKey="Disponibilidade" name="Disponibilidade">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.Disponibilidade < ALERT_THRESHOLD ? '#ef4444' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AvailabilityChart;