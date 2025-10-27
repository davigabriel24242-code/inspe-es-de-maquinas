export interface AvailabilityRecord {
  id: number;
  machine: string;
  location: string;
  month: string;
  year: number;
  day: number;
  availability: number | null;
}

export interface MonthlyStat {
  machine: string;
  daysOperating: number;
  totalDays: number;
  availabilityPercent: number;
}
