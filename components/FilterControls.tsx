import React from 'react';

interface FilterControlsProps {
  machines: string[];
  months: string[];
  locations: string[];
  years: number[];
  selectedMachine: string;
  selectedMonth: string;
  selectedLocation: string;
  selectedYear: string;
  onMachineChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  machines,
  months,
  locations,
  years,
  selectedMachine,
  selectedMonth,
  selectedLocation,
  selectedYear,
  onMachineChange,
  onMonthChange,
  onLocationChange,
  onYearChange,
}) => {
  const selectClasses = "w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div>
        <label htmlFor="machine-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Máquina</label>
        <select id="machine-filter" value={selectedMachine} onChange={(e) => onMachineChange(e.target.value)} className={selectClasses}>
          <option value="All">Todas as Máquinas</option>
          {machines.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
       <div>
        <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Local</label>
        <select id="location-filter" value={selectedLocation} onChange={(e) => onLocationChange(e.target.value)} className={selectClasses}>
          <option value="All">Todos os Locais</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ano</label>
        <select id="year-filter" value={selectedYear} onChange={(e) => onYearChange(e.target.value)} className={selectClasses}>
          <option value="All">Todos os Anos</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mês</label>
        <select id="month-filter" value={selectedMonth} onChange={(e) => onMonthChange(e.target.value)} className={selectClasses}>
          <option value="All">Todos os Meses</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;