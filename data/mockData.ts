import { AvailabilityRecord } from '../types';

// Base data for populating forms and generating initial records
export const fleetData = [
  { frota: '0003-AMT', equipamento: 'Manipulador JCB', local: 'FÁBRICA' },
  { frota: '0010-AMC', equipamento: 'Mini Carregadeira', local: 'FÁBRICA' },
  { frota: '0011-AMC', equipamento: 'Mini Carregadeira', local: 'FÁBRICA' },
  { frota: '0026-AEE', equipamento: 'Escavadeira', local: 'PIER' },
  { frota: '0027-AEE', equipamento: 'Escavadeira', local: 'PIER' },
  { frota: '0028-AEE', equipamento: 'Escavadeira', local: 'PIER' },
  { frota: '0040-APC', equipamento: 'Pá Carregadeira', local: 'PIER' },
  { frota: '0041-APC', equipamento: 'Pá Carregadeira', local: 'PIER' },
  { frota: '0044-AMC', equipamento: 'Mini Carregadeira', local: 'FÁBRICA' },
  { frota: '0044-APC', equipamento: 'Pá Carregadeira (Picete)', local: 'FÁBRICA' },
  { frota: '0048-MF', equipamento: 'Mini Retro escavadeira', local: 'FÁBRICA' },
  { frota: '0052-APC', equipamento: 'Pá Carregadeira', local: 'FÁBRICA' },
  { frota: '0060-AMC', equipamento: 'Mini Carregadeira XCMG-SR8', local: 'FÁBRICA' },
  { frota: '0062-AMC', equipamento: 'Mini carregadeira XC7-SR7', local: 'FÁBRICA' },
  { frota: '0064-AEE', equipamento: 'Escavadeira', local: 'PIER' },
  { frota: '0067-AMC', equipamento: 'Escavadeira XCMG', local: 'FÁBRICA' },
  { frota: '0087-APC', equipamento: 'Pá Carregadeira High Tip (RESERVA)', local: 'TERMINAL' },
  { frota: '0088-APC', equipamento: 'Pá Carregadeira', local: 'TERMINAL' },
  { frota: '0089-APC', equipamento: 'Pá Carregadeira (RESERVA)', local: 'TERMINAL' },
  { frota: '0090-APC', equipamento: 'Pá Carregadeira (RESERVA)', local: 'PIER' },
  { frota: '0091-APC', equipamento: 'Pá Carregadeira', local: 'FÁBRICA' },
  { frota: '0092-APC', equipamento: 'Pá Carregadeira', local: 'FÁBRICA' },
  { frota: '0112-APC', equipamento: 'Pá Carregadeira (VAGÃO)', local: 'TERMINAL' },
  { frota: '0119-APC', equipamento: 'Pá Carregadeira', local: 'TERMINAL' },
  { frota: '0124-APC', equipamento: 'Pá Carregadeira High Tip', local: 'TERMINAL' },
  { frota: '0126-APC', equipamento: 'Pá Carregadeira High Tip', local: 'FÁBRICA' },
  { frota: '0127-APC', equipamento: 'Pá Carregadeira High Tip', local: 'TERMINAL' },
  { frota: '0129-APC', equipamento: 'Pá Carregadeira (concha e vassoura)', local: 'TERMINAL' },
];

export const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
