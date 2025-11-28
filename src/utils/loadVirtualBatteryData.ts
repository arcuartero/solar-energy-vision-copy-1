import * as XLSX from 'xlsx';

export interface VirtualBatteryDataRow {
  timestamp: string;
  year: number;
  excesscons: number;
  excessprod: number;
  battery: number;
  battery_charged: number;
  battery_discharged: number;
  grid_consumption: number;
}

export const loadVirtualBatteryData = async (): Promise<VirtualBatteryDataRow[]> => {
  try {
    const response = await fetch('/src/data/virtual-battery.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<VirtualBatteryDataRow>(worksheet);
    
    return jsonData;
  } catch (error) {
    console.error('Error loading virtual battery data:', error);
    return [];
  }
};
