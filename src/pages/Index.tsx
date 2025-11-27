import { useMemo } from "react";
import { EnergyExcessChart } from "@/components/EnergyExcessChart";
import { VirtualBatteryChart } from "@/components/VirtualBatteryChart";
import { BatteryInfoCard } from "@/components/BatteryInfoCard";
import { generateEnergyData } from "@/utils/energyData";

const Index = () => {
  // Generate connected data once per render
  const energyData = useMemo(() => generateEnergyData(), []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Daily Energy Overview</h1>
          <p className="text-muted-foreground">Monitor your solar energy production and virtual battery status</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Excess Production/Consumption Card */}
            <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50">
              <EnergyExcessChart data={energyData} />
            </div>

            {/* Virtual Battery Card */}
            <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50">
              <VirtualBatteryChart data={energyData} />
            </div>
          </div>

          {/* Right Column - Battery Info */}
          <div className="lg:col-span-1">
            <BatteryInfoCard data={energyData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
