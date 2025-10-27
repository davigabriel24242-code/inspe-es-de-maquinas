
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  change?: 'increase' | 'decrease' | 'neutral';
  isAlert?: boolean;
}

const TrendIcon: React.FC<{change: 'increase' | 'decrease' | 'neutral'}> = ({ change }) => {
    if (change === 'increase') {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>;
    }
    if (change === 'decrease') {
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" /></svg>;
    }
    return null;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, isAlert = false }) => {
  const valueColor = isAlert ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white';
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between transition-transform transform hover:scale-105">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
        <div className="flex items-baseline space-x-2 mt-1">
           <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
           {change && <TrendIcon change={change} />}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
