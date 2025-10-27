import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AvailabilityRecord, MonthlyStat } from '../types';
import FilterControls from './FilterControls';
import AvailabilityChart from './AvailabilityChart';
import AlertsPanel from './AlertsPanel';
import KpiCard from './KpiCard';
import InspectionForm from './InspectionForm';
import HistoryTable from './HistoryTable';
import ExportButton from './ExportButton';
import DailyChecklistForm from './DailyChecklistForm';
import { fleetData } from '../data/mockData';
import MonthlyReport from './MonthlyReport';


const ALERT_THRESHOLD = 80;
const LOCAL_STORAGE_KEY = 'operationalAvailabilityData';
const MONTH_ORDER = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const Dashboard: React.FC = () => {
  const [data, setData] = useState<AvailabilityRecord[]>(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [data]);

  const [selectedMachine, setSelectedMachine] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [activeView, setActiveView] = useState<'operational' | 'monthly'>('operational');
  
  // State for modals
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isSingleEditModalOpen, setIsSingleEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AvailabilityRecord | null>(null);

  const { uniqueMachines, uniqueMonths, uniqueLocations, uniqueYears } = useMemo(() => {
    const machines = new Set<string>();
    const months = new Set<string>();
    const locations = new Set<string>();
    const years = new Set<number>();
    data.forEach(item => {
      machines.add(item.machine);
      months.add(item.month);
      locations.add(item.location);
      years.add(item.year);
    });
    return {
      uniqueMachines: Array.from(machines).sort(),
      uniqueMonths: MONTH_ORDER.filter(m => months.has(m) || data.length === 0), // Show all months if no data
      uniqueLocations: Array.from(locations).sort(),
      uniqueYears: Array.from(years).sort((a,b) => b-a),
    };
  }, [data]);
  
  const filteredData = useMemo(() => {
    return data.filter(item => 
      (selectedMachine === 'All' || item.machine === selectedMachine) &&
      (selectedMonth === 'All' || item.month === selectedMonth) &&
      (selectedLocation === 'All' || item.location === selectedLocation) &&
      (selectedYear === 'All' || item.year === parseInt(selectedYear, 10))
    );
  }, [data, selectedMachine, selectedMonth, selectedLocation, selectedYear]);

  const sortedAndFilteredData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year; // Sort by year descending
      }
      const monthIndexA = MONTH_ORDER.indexOf(a.month);
      const monthIndexB = MONTH_ORDER.indexOf(b.month);
      if (monthIndexA !== monthIndexB) {
        return monthIndexB - monthIndexA; // Sort by month descending
      }
      return b.day - a.day; // Sort by day descending
    });
  }, [filteredData]);

  const monthlyStats = useMemo(() => {
    if (selectedYear === 'All' || selectedMonth === 'All') {
        return {
            stats: [],
            totalDaysOperated: 0,
            averageAvailability: 0,
        };
    }

    const year = parseInt(selectedYear, 10);
    const month = selectedMonth;

    const dataForMonth = data.filter(d => d.year === year && d.month === month);

    const stats: MonthlyStat[] = fleetData.map(f => {
        const machineName = `${f.frota} - ${f.equipamento}`;
        const recordsForMachine = dataForMonth.filter(d => d.machine === machineName);
        
        const totalDays = recordsForMachine.length;
        const daysOperating = recordsForMachine.filter(r => r.availability === 1).length;
        const availabilityPercent = totalDays > 0 ? (daysOperating / totalDays) * 100 : 0;

        return {
            machine: machineName,
            daysOperating,
            totalDays,
            availabilityPercent
        };
    });

    const totalDaysOperated = stats.reduce((acc, curr) => acc + curr.daysOperating, 0);
    const machinesWithData = stats.filter(s => s.totalDays > 0);
    const totalAvailabilityPercent = machinesWithData.reduce((acc, curr) => acc + curr.availabilityPercent, 0);
    const averageAvailability = machinesWithData.length > 0 ? totalAvailabilityPercent / machinesWithData.length : 0;

    return { stats, totalDaysOperated, averageAvailability };

  }, [data, selectedYear, selectedMonth]);


  // CRUD Handlers
  const handleSaveSingleInspection = useCallback((record: AvailabilityRecord) => {
    if (record.availability === null) {
      // If user sets status to N/A, delete the record
      setData(prevData => prevData.filter(item => item.id !== record.id));
      return;
    }
    setData(prevData => {
      const existingIndex = prevData.findIndex(item => item.id === record.id);
      if (existingIndex > -1) {
        // Update
        const updatedData = [...prevData];
        updatedData[existingIndex] = record;
        return updatedData;
      }
      return prevData; // Should only be called for edits
    });
  }, []);

  const handleSaveChecklist = useCallback((records: AvailabilityRecord[]) => {
    if (records.length === 0 && !isChecklistModalOpen) return;
    
    // This logic needs a date reference, which we get from the form state.
    // For simplicity, we assume if records are passed, they share the same date.
    // A more robust solution would pass the date from the form.
    // Let's assume the user can submit an empty list to clear a day.
    const dateRef = records[0] ?? null;
    if(!dateRef) return; // Cannot determine date if no records passed
    const { year, month, day } = dateRef;


    setData(prevData => {
        // Filter out all existing records for the specific date
        const otherData = prevData.filter(r => 
            !(r.year === year && r.month === month && r.day === day)
        );
        // Add the new/updated records for that date
        return [...otherData, ...records];
    });
  }, [isChecklistModalOpen]);

  const handleDeleteInspection = useCallback((id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setData(prevData => prevData.filter(item => item.id !== id));
    }
  }, []);

  const handleEditInspection = useCallback((record: AvailabilityRecord) => {
    setEditingRecord(record);
    setIsSingleEditModalOpen(true);
  }, []);
  
  // Data processing for KPIs, Alerts, and Charts
  const alerts = useMemo(() => {
    // Get the latest record for each machine in the filtered data
    const latestEntries = new Map<string, AvailabilityRecord>();
    sortedAndFilteredData.forEach(record => {
      if (!latestEntries.has(record.machine)) {
        latestEntries.set(record.machine, record);
      }
    });

    // Return machines that are not operating (availability === 0)
    return Array.from(latestEntries.values())
      .filter(record => record.availability === 0)
      .sort((a,b) => a.machine.localeCompare(b.machine));
  }, [sortedAndFilteredData]);

  const overallAvailability = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const operating = filteredData.filter(item => item.availability === 1).length;
    return (operating / filteredData.length) * 100;
  }, [filteredData]);

  const chartData = useMemo(() => {
    if (selectedMachine !== 'All') {
      // Data for a specific machine over time (days in month)
      const dataForChart = filteredData
        .filter(d => d.machine === selectedMachine)
        .sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            const monthA = MONTH_ORDER.indexOf(a.month);
            const monthB = MONTH_ORDER.indexOf(b.month);
            if (monthA !== monthB) return monthA - monthB;
            return a.day - b.day;
        })
      return dataForChart.map(item => ({
          name: `${item.day}/${MONTH_ORDER.indexOf(item.month) + 1}`,
          Disponibilidade: item.availability === 1 ? 100 : 0
      }));
    } 
    
    // Average availability per machine if 'All' machines selected
    const machineData = new Map<string, { total: number, count: number }>();
    filteredData.forEach(item => {
      if (item.availability === null) return;
      if (!machineData.has(item.machine)) {
        machineData.set(item.machine, { total: 0, count: 0 });
      }
      const entry = machineData.get(item.machine)!;
      entry.total += item.availability;
      entry.count++;
    });

    return Array.from(machineData.entries()).map(([machine, { total, count }]) => ({
      name: machine.split(' - ')[0], // Shorten name for chart label
      Disponibilidade: (total / count) * 100,
    })).sort((a,b) => a.name.localeCompare(b.name));
    
  }, [filteredData, selectedMachine]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard de Disponibilidade</h1>
          <div className="flex items-center gap-4">
            <ExportButton data={sortedAndFilteredData} fileName="relatorio_disponibilidade" />
            <button
              onClick={() => setIsChecklistModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all"
            >
              Adicionar Inspeção Diária
            </button>
          </div>
        </header>

        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => setActiveView('operational')}
                    className={`${
                        activeView === 'operational'
                        ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                >
                    Dashboard Operacional
                </button>
                <button
                    onClick={() => setActiveView('monthly')}
                    className={`${
                        activeView === 'monthly'
                        ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                >
                    Relatório Mensal
                </button>
            </nav>
        </div>
        
        <section className="mb-6">
            <FilterControls
                machines={uniqueMachines}
                months={uniqueMonths.length > 0 ? uniqueMonths : MONTH_ORDER}
                locations={uniqueLocations}
                years={uniqueYears}
                selectedMachine={selectedMachine}
                selectedMonth={selectedMonth}
                selectedLocation={selectedLocation}
                selectedYear={selectedYear}
                onMachineChange={setSelectedMachine}
                onMonthChange={setSelectedMonth}
                onLocationChange={setSelectedLocation}
                onYearChange={setSelectedYear}
            />
        </section>

        {activeView === 'operational' && (
            <>
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <KpiCard title="Disponibilidade Geral (Filtro)" value={`${overallAvailability.toFixed(1)}%`} isAlert={overallAvailability < ALERT_THRESHOLD} />
                  <KpiCard title="Máquinas Monitoradas" value={uniqueMachines.length.toString()} />
                  <KpiCard title="Alertas Ativos (Filtro)" value={alerts.length.toString()} isAlert={alerts.length > 0} />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <AvailabilityChart data={chartData} title={selectedMachine !== 'All' ? `Disponibilidade de ${selectedMachine}` : 'Disponibilidade Média por Máquina'} />
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <AlertsPanel alerts={alerts} />
                  </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Histórico de Inspeções</h2>
                    <HistoryTable data={sortedAndFilteredData} onEdit={handleEditInspection} onDelete={handleDeleteInspection} />
                </section>
            </>
        )}

        {activeView === 'monthly' && (
            (selectedYear === 'All' || selectedMonth === 'All') 
            ? <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Selecione um Ano e Mês</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Por favor, utilize os filtros acima para selecionar um ano e um mês específicos para visualizar o relatório mensal.</p>
              </div>
            : <MonthlyReport 
                stats={monthlyStats.stats} 
                totalDaysOperated={monthlyStats.totalDaysOperated} 
                averageAvailability={monthlyStats.averageAvailability} 
              />
        )}


        <InspectionForm
            isOpen={isSingleEditModalOpen}
            onClose={() => setIsSingleEditModalOpen(false)}
            onSave={handleSaveSingleInspection}
            initialData={editingRecord}
        />

        <DailyChecklistForm
            isOpen={isChecklistModalOpen}
            onClose={() => setIsChecklistModalOpen(false)}
            onSave={handleSaveChecklist}
            allRecords={data}
        />

      </main>
    </div>
  );
};

export default Dashboard;
