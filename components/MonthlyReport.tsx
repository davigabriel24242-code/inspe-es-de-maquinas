import React from 'react';
import { MonthlyStat } from '../types';
import KpiCard from './KpiCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface MonthlyReportProps {
    stats: MonthlyStat[];
    totalDaysOperated: number;
    averageAvailability: number;
}

const ALERT_THRESHOLD = 80;

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataKey = payload[0].dataKey;
    const value = payload[0].value;
    const unit = dataKey === 'Disponibilidade' ? '%' : '';
    return (
      <div className="bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded shadow-lg">
        <p className="font-bold">{label}</p>
        <p className="text-blue-500 dark:text-blue-400">{`${dataKey}: ${value.toFixed(1)}${unit}`}</p>
      </div>
    );
  }
  return null;
};

const MonthlyReport: React.FC<MonthlyReportProps> = ({ stats, totalDaysOperated, averageAvailability }) => {
    
    const chartDataPercent = stats
        .filter(s => s.totalDays > 0)
        .map(s => ({
            name: s.machine.split(' - ')[0],
            Disponibilidade: s.availabilityPercent,
        }))
        .sort((a, b) => a.Disponibilidade - b.Disponibilidade);

    const chartDataSum = stats
        .filter(s => s.totalDays > 0)
        .map(s => ({
            name: s.machine.split(' - ')[0],
            'Dias Operando': s.daysOperating,
        }))
        .sort((a, b) => a['Dias Operando'] - b['Dias Operando']);

    return (
        <div className="space-y-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total de Dias Operados (Mês)" value={totalDaysOperated.toString()} />
                <KpiCard title="Disponibilidade Média (Mês)" value={`${averageAvailability.toFixed(1)}%`} isAlert={averageAvailability < ALERT_THRESHOLD} />
            </section>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Disponibilidade por Máquina (%)</h3>
                     <div style={{ width: '100%', height: `${Math.max(400, chartDataPercent.length * 35)}px` }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={chartDataPercent}
                                layout="vertical"
                                margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fill: '#6b7280' }} />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#6b7280', fontSize: 12 }} interval={0} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(200,200,200,0.1)'}} />
                                <Bar dataKey="Disponibilidade" name="Disponibilidade">
                                    {chartDataPercent.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.Disponibilidade < ALERT_THRESHOLD ? '#ef4444' : '#3b82f6'} />
                                    ))}
                                    <LabelList dataKey="Disponibilidade" position="right" formatter={(value: number) => `${value.toFixed(0)}%`} className="fill-gray-800 dark:fill-gray-200 font-semibold text-xs" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Soma de Dias Operados por Máquina</h3>
                     <div style={{ width: '100%', height: `${Math.max(400, chartDataSum.length * 35)}px` }}>
                        <ResponsiveContainer>
                            <BarChart
                                data={chartDataSum}
                                layout="vertical"
                                margin={{ top: 5, right: 40, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                <XAxis type="number" allowDecimals={false} tick={{ fill: '#6b7280' }} />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#6b7280', fontSize: 12 }} interval={0} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(200,200,200,0.1)'}} />
                                <Bar dataKey="Dias Operando" name="Dias Operando" fill="#16a34a">
                                    <LabelList dataKey="Dias Operando" position="right" className="fill-gray-800 dark:fill-gray-200 font-semibold text-xs" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Tabela de Resumo Mensal</h3>
                 <div className="overflow-y-auto max-h-[500px]">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                         <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Máquina</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dias Operando (Soma)</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dias Inspecionados</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Disponibilidade (%)</th>
                            </tr>
                         </thead>
                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {stats.sort((a,b) => a.machine.localeCompare(b.machine)).map(stat => (
                                <tr key={stat.machine}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{stat.machine}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                                        {stat.totalDays > 0 ? stat.daysOperating : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                                        {stat.totalDays > 0 ? stat.totalDays : 'N/A'}
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm text-center font-bold ${stat.totalDays > 0 && stat.availabilityPercent < ALERT_THRESHOLD ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                        {stat.totalDays > 0 ? `${stat.availabilityPercent.toFixed(0)}%` : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

export default MonthlyReport;
