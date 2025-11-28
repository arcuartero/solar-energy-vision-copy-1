import { Euro } from "lucide-react";
import { useState, useEffect } from "react";
import { loadFinancialData, FinancialDataRow } from "@/utils/loadFinancialData";
import { isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";

interface SavingsCardProps {
  viewType: "daily" | "weekly" | "monthly" | "custom";
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

// Calculate total savings from financial data
const calculateTotalSavings = (
  financialData: FinancialDataRow[],
  dateRange: { from: Date | undefined; to: Date | undefined }
): number => {
  if (!dateRange.from || !dateRange.to || financialData.length === 0) {
    return 0;
  }

  // Filter data based on date range
  const filteredData = financialData.filter((row) => {
    // Parse month_year (format: "2024-01")
    const [year, month] = row.month_year.split('-');
    const rowDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    
    return isWithinInterval(rowDate, {
      start: dateRange.from!,
      end: dateRange.to!
    });
  });

  // Sum total_gain_euros
  const totalSavings = filteredData.reduce((sum, row) => sum + row.total_gain_euros, 0);
  
  return totalSavings;
};
export const SavingsCard = ({
  viewType,
  dateRange
}: SavingsCardProps) => {
  const [financialData, setFinancialData] = useState<FinancialDataRow[]>([]);
  const [totalSavings, setTotalSavings] = useState<number>(0);

  useEffect(() => {
    loadFinancialData().then(setFinancialData);
  }, []);

  useEffect(() => {
    if (financialData.length > 0) {
      const savings = calculateTotalSavings(financialData, dateRange);
      setTotalSavings(savings);
    }
  }, [financialData, dateRange]);

  const displayLabel = viewType === "custom" 
    ? "Custom Range Savings" 
    : viewType === "monthly" 
    ? "Monthly Savings" 
    : viewType === "weekly"
    ? "Weekly Savings"
    : "Daily Savings";

  return <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50 h-fit">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-muted-foreground">{displayLabel}</h3>
        <div className="w-12 h-12 rounded-full bg-chart-production/10 flex items-center justify-center">
          <Euro className="w-6 h-6 text-chart-production" />
        </div>
      </div>

      <div className="space-y-4 mb-6">
        
        
        
      </div>

      <div className="pt-4 py-0">
        <div className={cn(
          "text-4xl font-bold",
          totalSavings >= 0 ? "text-chart-production" : "text-chart-loss"
        )}>
          €{totalSavings.toFixed(2)}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Total {totalSavings >= 0 ? "saved" : "loss"} in selected period
        </p>
      </div>
    </div>;
};