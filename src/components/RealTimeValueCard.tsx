import { Zap } from "lucide-react";
import type { EnergyData } from "@/utils/energyData";

interface RealTimeValueCardProps {
  data: EnergyData;
}

// Conversion rates based on time of day and day of week
const getConversionRate = (hour: number) => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Peak hours (17:00-24:00 every day): +6% more expensive
  if (hour >= 17) {
    return { rate: 1.06, label: "Peak Hours", color: "text-chart-charging" };
  }
  
  // Off-peak hours (-25% cheaper):
  // Weekdays: 00:00-06:00
  // Weekends: 00:00-06:00 AND 12:00-17:00
  if (isWeekend) {
    if (hour < 6 || (hour >= 12 && hour < 17)) {
      return { rate: 0.75, label: "Off-Peak Hours", color: "text-chart-production" };
    }
  } else {
    if (hour < 6) {
      return { rate: 0.75, label: "Off-Peak Hours", color: "text-chart-production" };
    }
  }
  
  // Normal hours (standard price 0%):
  // Weekdays: 06:00-17:00
  // Weekends: 06:00-12:00
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
            <strong>Peak (+6%):</strong> 5pm-midnight daily<br/>
            <strong>Off-peak (-25%):</strong> Midnight-6am daily + Noon-5pm weekends<br/>
            <strong>Normal (0%):</strong> 6am-5pm weekdays, 6am-noon weekends
          </p>
        </div>
      </div>
    </div>
  );
};
