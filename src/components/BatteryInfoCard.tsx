import { Battery } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { EnergyData } from "@/utils/energyData";

interface BatteryInfoCardProps {
  data: EnergyData;
}

export const BatteryInfoCard = ({ data }: BatteryInfoCardProps) => {
  // Get the latest battery level (last entry)
  const latestData = data[data.length - 1];
  const batteryLevel = latestData?.batteryLevel || 0;
  
  // Calculate total stored energy (assuming 10 kWh capacity)
  const batteryCapacity = 10;
  const storedEnergy = (batteryLevel / 100) * batteryCapacity;

  return (
    <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50 h-fit sticky top-8">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-medium text-muted-foreground">Virtual Battery</h3>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Battery className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="text-4xl font-bold text-foreground">
          {storedEnergy.toFixed(2)} kWh
        </div>
        <p className="text-sm text-muted-foreground">Energy not self-consumed</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Stored</span>
          <span className="font-semibold text-foreground">{batteryLevel.toFixed(0)}%</span>
        </div>
        <Progress value={batteryLevel} className="h-3" />
      </div>
    </div>
  );
};
