import { Euro } from "lucide-react";
import type { EnergyData } from "@/utils/energyData";
interface SavingsCardProps {
  data: EnergyData;
}

// Calculate savings breakdown over the period
const calculateSavings = (data: EnergyData) => {
  // Base electricity price (€/kWh)
  const basePrice = 0.25;
  let offPeakSavings = 0;
  let peakAvoidanceSavings = 0;
  let virtualBatterySavings = 0;
  data.forEach(entry => {
    const storedEnergy = entry.storedEnergy || 0;
    const hour = new Date(entry.time).getHours();
    const dayOfWeek = new Date(entry.time).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const normalCost = storedEnergy * basePrice;

    // Off-peak storage savings (-25%)
    if (isWeekend && (hour < 6 || hour >= 12 && hour < 17) || !isWeekend && hour < 6) {
      offPeakSavings += normalCost * 0.25;
    }

    // Peak avoidance savings (+6% avoided)
    if (hour >= 17) {
      peakAvoidanceSavings += normalCost * 0.06;
    }

    // Virtual battery optimization (additional 3% efficiency)
    virtualBatterySavings += normalCost * 0.03;
  });
  return {
    offPeakSavings,
    peakAvoidanceSavings,
    virtualBatterySavings,
    total: offPeakSavings + peakAvoidanceSavings + virtualBatterySavings
  };
};
export const SavingsCard = ({
  data
}: SavingsCardProps) => {
  const savings = calculateSavings(data);
  return <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50 h-fit">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-medium text-muted-foreground">30-Day Savings</h3>
        <div className="w-12 h-12 rounded-full bg-chart-production/10 flex items-center justify-center">
          <Euro className="w-6 h-6 text-chart-production" />
        </div>
      </div>

      <div className="space-y-4 mb-6">
        
        
        
      </div>

      <div className="pt-4 border-t border-border/50">
        <p className="text-sm text-muted-foreground mb-2">Total saved in last 30 days</p>
        <div className="text-4xl font-bold text-chart-production">
          €{savings.total.toFixed(2)}
        </div>
      </div>
    </div>;
};