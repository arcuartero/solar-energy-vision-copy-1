import { Euro } from "lucide-react";
import type { EnergyData } from "@/utils/energyData";

interface SavingsCardProps {
  data: EnergyData;
}

// Calculate total savings over the period
const calculateSavings = (data: EnergyData) => {
  // Base electricity price (€/kWh)
  const basePrice = 0.25;
  
  let totalSavings = 0;
  
  data.forEach(entry => {
    const storedEnergy = entry.storedEnergy || 0;
    const hour = new Date(entry.time).getHours();
    const dayOfWeek = new Date(entry.time).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Calculate what they would have paid at normal rate
    const normalCost = storedEnergy * basePrice;
    
    // Calculate actual cost based on time of day
    let actualCost = normalCost;
    
    // Peak hours (17:00-24:00): +6% more expensive
    if (hour >= 17) {
      actualCost = normalCost * 1.06;
    }
    // Off-peak hours (-25% cheaper)
    else if (isWeekend && (hour < 6 || (hour >= 12 && hour < 17))) {
      actualCost = normalCost * 0.75;
    } else if (!isWeekend && hour < 6) {
      actualCost = normalCost * 0.75;
    }
    
    // Savings is when we store during off-peak and use during peak
    // For simplicity, assume stored energy was charged during off-peak
    const offPeakCost = normalCost * 0.75;
    totalSavings += (normalCost - offPeakCost);
  });
  
  return totalSavings;
};

export const SavingsCard = ({ data }: SavingsCardProps) => {
  const totalSavings = calculateSavings(data);

  return (
    <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50 h-fit">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-medium text-muted-foreground">30-Day Savings</h3>
        <div className="w-12 h-12 rounded-full bg-chart-production/10 flex items-center justify-center">
          <Euro className="w-6 h-6 text-chart-production" />
        </div>
      </div>

      <div className="space-y-6 mb-6">
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Smart energy storage</strong> during off-peak hours when electricity is 25% cheaper.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            <strong className="text-foreground">Optimized usage</strong> by avoiding peak hours that cost 6% more than standard rates.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            <strong className="text-foreground">Virtual battery benefits</strong> maximizing your solar production value throughout the day.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-border/50">
        <p className="text-sm text-muted-foreground mb-2">Total saved in last 30 days</p>
        <div className="text-4xl font-bold text-chart-production">
          €{totalSavings.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
