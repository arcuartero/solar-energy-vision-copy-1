import { EnergyExcessChart } from "@/components/EnergyExcessChart";
import { VirtualBatteryChart } from "@/components/VirtualBatteryChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Daily Energy Overview</h1>
          <p className="text-muted-foreground">Monitor your solar energy production and virtual battery status</p>
        </div>

        {/* Charts Grid */}
        <div className="space-y-6">
          {/* Excess Production/Consumption Card */}
          <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50">
            <EnergyExcessChart />
          </div>

          {/* Virtual Battery Card */}
          <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50">
            <VirtualBatteryChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
