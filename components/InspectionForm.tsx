import React, { useState, useEffect, useMemo } from 'react';
import { AvailabilityRecord } from '../types';
import { fleetData, months } from '../data/mockData';

interface InspectionFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (record: AvailabilityRecord) => void;
    initialData?: AvailabilityRecord | null;
}

const InspectionForm: React.FC<InspectionFormProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [machine, setMachine] = useState('');
    const [location, setLocation] = useState('');
    const [month, setMonth] = useState(months[0]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [day, setDay] = useState(1);
    const [availability, setAvailability] = useState<number | null>(1);

    const daysInMonth = useMemo(() => {
        const monthIndex = months.indexOf(month);
        if (monthIndex < 0) return 31;
        return new Date(year, monthIndex + 1, 0).getDate();
    }, [month, year]);
    
    useEffect(() => {
        if (initialData) {
            setMachine(initialData.machine);
            setLocation(initialData.location);
            setMonth(initialData.month);
            setYear(initialData.year);
            setDay(initialData.day);
            setAvailability(initialData.availability);
        } else {
            // Reset form
            const today = new Date();
            setMachine('');
            setLocation('');
            setMonth(months[today.getMonth()]);
            setYear(today.getFullYear());
            setDay(today.getDate());
            setAvailability(1);
        }
    }, [initialData, isOpen]);

    useEffect(() => {
        if (day > daysInMonth) {
            setDay(daysInMonth);
        }
    }, [daysInMonth, day]);

    useEffect(() => {
        const selectedMachineData = fleetData.find(f => `${f.frota} - ${f.equipamento}` === machine);
        if (selectedMachineData) {
            setLocation(selectedMachineData.local);
        }
    }, [machine]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!machine) {
            alert('Por favor, selecione uma máquina.');
            return;
        }

        const record: AvailabilityRecord = {
            id: initialData ? initialData.id : Date.now(),
            machine,
            location,
            month,
            year,
            day,
            availability,
        };
        onSave(record);
        onClose();
    };

    if (!isOpen) return null;

    const availableMachines = fleetData.map(f => `${f.frota} - ${f.equipamento}`).sort();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{initialData ? 'Editar Inspeção' : 'Adicionar Nova Inspeção'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="machine" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Máquina</label>
                            <select id="machine" value={machine} onChange={e => setMachine(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-2">
                                <option value="" disabled>Selecione uma máquina</option>
                                {availableMachines.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Local</label>
                            <input type="text" id="location" value={location} disabled className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 p-2" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ano</label>
                                <input type="number" id="year" value={year} onChange={e => setYear(parseInt(e.target.value, 10))} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-2" />
                            </div>
                            <div>
                                <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mês</label>
                                <select id="month" value={month} onChange={e => setMonth(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-2">
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="day" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dia</label>
                                <select id="day" value={day} onChange={e => setDay(parseInt(e.target.value, 10))} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-2">
                                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select id="availability" value={availability === null ? 'na' : availability} onChange={e => setAvailability(e.target.value === 'na' ? null : parseInt(e.target.value, 10))} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-2">
                                <option value="na">N/A</option>
                                <option value={1}>Operando</option>
                                <option value={0}>Não Operando</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InspectionForm;
