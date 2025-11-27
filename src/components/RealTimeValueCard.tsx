import { Zap } from "lucide-react";
import type { EnergyData } from "@/utils/energyData";

interface RealTimeValueCardProps {
  data: EnergyData;
}

// Conversion rates based on time of day
const getConversionRate = (hour: number) => {
  // Peak hours (18:00-22:00): +6% more expensive
  if (hour >= 18 && hour < 22) {
    return { rate: 1.06, label: "Peak Hours", color: "text-chart-charging" };
  }
  // Off-peak hours (23:00-07:00): -25% cheaper
  if (hour >= 23 || hour < 7) {
    return { rate: 0.75, label: "Off-Peak Hours", color: "text-chart-production" };
  }
  // Normal hours: standard price (0%)
  return { rate: 1.0, label: "Normal Hours", color: "text-chart-consumption" };
};

export const RealTimeValueCard = ({ data }: RealTimeValueCardProps) => {
  const latestData = data[data.length - 1];
  const storedEnergy = latestData?.storedEnergy || 0;
  
  // Get current hour from the latest data time
  const currentHour = new Date().getHours();
  const { rate, label, color } = getConversionRate(currentHour);
  
  const actualValue = storedEnergy * rate;

  return (
    <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50 h-fit">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-medium text-muted-foreground">Real-Time Value</h3>
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Zap className="w-6 h-6 text-accent" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="text-4xl font-bold text-foreground">
          {actualValue.toFixed(2)} kWh
        </div>
        <p className="text-sm text-muted-foreground">Actual consumption value</p>
      </div>

      <div className="space-y-4">
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-muted-foreground">Current Period</span>
            <span className={`font-semibold ${color}`}>{label}</span>
          </div>
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-muted-foreground">Conversion Rate</span>
            <span className="font-semibold text-foreground">{rate}x</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stored Energy</span>
            <span className="font-semibold text-foreground">{storedEnergy.toFixed(2)} kWh</span>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Peak hours (6pm-10pm): +6% value<br/>
            Off-peak (11pm-7am): -25% value<br/>
            Normal hours: Standard value
          </p>
        </div>
      </div>
    </div>
  );
};
