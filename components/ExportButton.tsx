
import React from 'react';
import { AvailabilityRecord } from '../types';
import { months } from '../data/mockData';

declare const XLSX: any;

interface ExportButtonProps {
    data: AvailabilityRecord[];
    fileName: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, fileName }) => {
    
    const handleExport = () => {
        if (!data || data.length === 0) {
            alert('Não há dados para exportar.');
            return;
        }

        const dataForExport = data.map(rec => ({
            'ID': rec.id,
            'Máquina': rec.machine,
            'Local': rec.location,
            'Data': `${String(rec.day).padStart(2, '0')}/${String(months.indexOf(rec.month) + 1).padStart(2, '0')}/${rec.year}`,
            'Status': rec.availability === 1 ? 'Operando' : 'Não Operando'
          }));

        const worksheet = XLSX.utils.json_to_sheet(dataForExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatorio');

        // Adjust column widths
        const colWidths = Object.keys(dataForExport[0] || {}).map(key => ({
            wch: Math.max(...dataForExport.map(item => item[key as keyof typeof item]?.toString().length ?? 0), key.length) + 2
        }));
        worksheet['!cols'] = colWidths;
        
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all"
            aria-label="Exportar relatório para XLSX"
        >
            Exportar para XLSX
        </button>
    );
};

export default ExportButton;