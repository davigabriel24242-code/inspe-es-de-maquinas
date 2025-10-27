import React, { useState, useEffect, useMemo } from 'react';
import { AvailabilityRecord } from '../types';
import { fleetData, months } from '../data/mockData';

// Interface for the state that holds the status of each machine
interface MachineStatus {
    status: number | null; // 1 for operating, 0 for not, null for N/A
    location: string;
}

interface DailyChecklistFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (records: AvailabilityRecord[]) => void;
    allRecords: AvailabilityRecord[]; 
}

const DailyChecklistForm: React.FC<DailyChecklistFormProps> = ({ isOpen, onClose, onSave, allRecords }) => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(months[today.getMonth()]);
    const [day, setDay] = useState(today.getDate());

    const [machineStatuses, setMachineStatuses] = useState<Map<string, MachineStatus>>(new Map());

    const daysInMonth = useMemo(() => new Date(year, months.indexOf(month) + 1, 0).getDate(), [month, year]);

    useEffect(() => {
        if (isOpen) {
            const initialStatuses = new Map<string, MachineStatus>();
            fleetData.forEach(f => {
                const machineName = `${f.frota} - ${f.equipamento}`;
                // Default to N/A
                initialStatuses.set(machineName, { status: null, location: f.local });
            });

            const existingRecordsForDate = allRecords.filter(r => 
                r.year === year && r.month === month && r.day === day
            );
            
            existingRecordsForDate.forEach(rec => {
                if (initialStatuses.has(rec.machine)) {
                    initialStatuses.set(rec.machine, { status: rec.availability, location: rec.location });
                }
            });
            
            setMachineStatuses(initialStatuses);
        }
    }, [isOpen, year, month, day, allRecords]);

    useEffect(() => {
        if (day > daysInMonth) {
            setDay(daysInMonth);
        }
    }, [daysInMonth, day]);

    const handleStatusChange = (machine: string, newStatusStr: string) => {
        const newStatus = newStatusStr === 'na' ? null : parseInt(newStatusStr, 10);
        setMachineStatuses(prev => {
            const newStatuses = new Map<string, MachineStatus>(prev);
            const current = newStatuses.get(machine);
            if (current) {
                newStatuses.set(machine, { ...current, status: newStatus });
            }
            return newStatuses;
        });
    };

    const handleMarkAllAsOperating = () => {
        setMachineStatuses(prev => {
            const newStatuses = new Map<string, MachineStatus>(prev);
            newStatuses.forEach((value, key) => {
                newStatuses.set(key, { ...value, status: 1 });
            });
            return newStatuses;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const recordsToSave: AvailabilityRecord[] = [];
        let index = 0;
        machineStatuses.forEach(({ status, location }, machineName) => {
            // Only save records that are not N/A
            if (status !== null) {
                recordsToSave.push({
                    id: Date.now() + index++,
                    machine: machineName,
                    location: location,
                    year,
                    month,
                    day,
                    availability: status,
                });
            }
        });
        onSave(recordsToSave);
        onClose();
    };

    if (!isOpen) return null;

    const getSelectBgColor = (status: number | null) => {
        if (status === 1) return 'bg-green-50 dark:bg-green-900/20';
        if (status === 0) return 'bg-red-50 dark:bg-red-900/20';
        return 'bg-gray-50 dark:bg-gray-700'; // N/A color
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Inspeção Diária</h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label htmlFor="year-checklist" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ano</label>
                            <input type="number" id="year-checklist" value={year} onChange={e => setYear(parseInt(e.target.value, 10))} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-2" />
                        </div>
                        <div>
                            <label htmlFor="month-checklist" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mês</label>
                            <select id="month-checklist" value={month} onChange={e => setMonth(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-2">
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="day-checklist" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dia</label>
                            <select id="day-checklist" value={day} onChange={e => setDay(parseInt(e.target.value, 10))} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-2">
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <button type="button" onClick={handleMarkAllAsOperating} className="w-full px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 font-semibold rounded-lg hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors">
                            Marcar Todos como Operando
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto border-t border-b border-gray-200 dark:border-gray-700 -mx-6 px-6 py-2">
                        <div className="space-y-3">
                            {Array.from(machineStatuses.entries()).map(([machine, { status }]) => (
                                <div key={machine} className="grid grid-cols-3 gap-4 items-center">
                                    <label htmlFor={`status-${machine}`} className="col-span-2 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{machine}</label>
                                    <select
                                        id={`status-${machine}`}
                                        value={status === null ? 'na' : status}
                                        onChange={e => handleStatusChange(machine, e.target.value)}
                                        className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm ${getSelectBgColor(status)}`}
                                    >
                                        <option value="na">N/A</option>
                                        <option value={1}>Operando</option>
                                        <option value={0}>Não Operando</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar Dia</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DailyChecklistForm;
