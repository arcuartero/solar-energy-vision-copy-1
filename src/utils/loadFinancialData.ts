import * as XLSX from 'xlsx';

export interface FinancialDataRow {
  month_year: string;
  injection_price_cents_kwh: number;
  energy_charged_kwh: number;
  energy_discharged_kwh: number;
  battery_end_state_kwh: number;
  stored_value_euros: number;
  stored_value_variation_euros: number;
  loss_not_injecting_euros: number;
  gain_not_drawing_euros: number;
  total_gain_euros: number;
}

export const loadFinancialData = async (): Promise<FinancialDataRow[]> => {
  try {
    const response = await fetch('/src/data/financial-data.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<FinancialDataRow>(worksheet);
    
    return jsonData;
  } catch (error) {
    console.error('Error loading financial data:', error);
    return [];
  }
};
