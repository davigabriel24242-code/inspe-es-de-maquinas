
import React from 'react';
import { AvailabilityRecord } from '../types';

interface AlertsPanelProps {
  alerts: AvailabilityRecord[];
}

const AlertIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
        <AlertIcon />
        Alertas de Máquina Não Operando
      </h3>
      <div className="flex-grow overflow-y-auto pr-2" style={{maxHeight: '280px'}}>
        {alerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Nenhum alerta ativo.
          </div>
        ) : (
          <ul className="space-y-3">
            {alerts.map(alert => (
              <li key={alert.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-sm text-red-800 dark:text-red-300">{alert.machine}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{`${alert.location} - ${alert.day} de ${alert.month} de ${alert.year}`}</p>
                  </div>
                  <span className="font-bold text-sm text-red-600 dark:text-red-400">Não Operando</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;