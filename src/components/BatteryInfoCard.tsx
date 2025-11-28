import { Battery } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { EnergyData, ViewType } from "@/utils/energyData";
interface BatteryInfoCardProps {
  data: EnergyData;
  viewType: ViewType;
}
export const BatteryInfoCard = ({
  data,
  viewType
}: BatteryInfoCardProps) => {
  // Get the latest stored energy (last entry)
  const latestData = data[data.length - 1];
  const storedEnergy = latestData?.storedEnergy || 0;

  // Calculate average stored energy for the period
  const avgStoredEnergy = data.reduce((sum, d) => sum + d.storedEnergy, 0) / data.length;

  // Calculate max stored energy in the period
  const maxStoredEnergy = Math.max(...data.map(d => d.storedEnergy));
  const periodLabel = viewType === "daily" ? "today" : viewType === "weekly" ? "this week" : "this month";
  return <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-muted-foreground">Virtual Battery</h3>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Battery className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="text-4xl font-bold text-foreground">
          {storedEnergy.toFixed(2)} kWh
        </div>
        <p className="text-sm text-muted-foreground">Total energy stored</p>
      </div>

      <div className="space-y-4">
        
      </div>
    </div>;
};