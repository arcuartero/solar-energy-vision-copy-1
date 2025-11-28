import { Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { loadFinancialData, FinancialDataRow } from "@/utils/loadFinancialData";
import { isWithinInterval } from "date-fns";
interface RealTimeValueCardProps {
  viewType: "daily" | "weekly" | "monthly" | "custom";
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

// Calculate total energy charged from financial data
const calculateTotalEnergyCharged = (financialData: FinancialDataRow[], dateRange: {
  from: Date | undefined;
  to: Date | undefined;
}): number => {
  if (!dateRange.from || !dateRange.to || financialData.length === 0) {
    return 0;
  }

  // Filter data based on date range
  const filteredData = financialData.filter(row => {
    // Parse month_year (format: "2024-01")
    const [year, month] = row.month_year.split('-');
    const rowDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    return isWithinInterval(rowDate, {
      start: dateRange.from!,
      end: dateRange.to!
    });
  });

  // Sum energy_charged_kwh
  const totalEnergyCharged = filteredData.reduce((sum, row) => sum + row.energy_charged_kwh, 0);
  return totalEnergyCharged;
};
export const RealTimeValueCard = ({
  viewType,
  dateRange
}: RealTimeValueCardProps) => {
  const [financialData, setFinancialData] = useState<FinancialDataRow[]>([]);
  const [totalEnergyCharged, setTotalEnergyCharged] = useState<number>(0);
  useEffect(() => {
    loadFinancialData().then(setFinancialData);
  }, []);
  useEffect(() => {
    if (financialData.length > 0) {
      const energyCharged = calculateTotalEnergyCharged(financialData, dateRange);
      setTotalEnergyCharged(energyCharged);
    }
  }, [financialData, dateRange]);
  const displayLabel = viewType === "custom" ? "Custom Range" : viewType === "monthly" ? "Monthly" : viewType === "weekly" ? "Weekly" : "Daily";
  return <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-muted-foreground">Additional virtual self consumption</h3>
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Zap className="w-6 h-6 text-accent" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="text-4xl font-bold text-foreground">
          {totalEnergyCharged.toFixed(2)} kWh
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Total energy charged in selected period
        </p>
      </div>

      <div className="space-y-4">
        
        
        
      </div>
    </div>;
};