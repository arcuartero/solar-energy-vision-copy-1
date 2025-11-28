import { useMemo, useState } from "react";
import { EnergyExcessChart } from "@/components/EnergyExcessChart";
import { VirtualBatteryChart } from "@/components/VirtualBatteryChart";
import { FinancialBreakdownChart } from "@/components/FinancialBreakdownChart";
import { BatteryInfoCard } from "@/components/BatteryInfoCard";
import { RealTimeValueCard } from "@/components/RealTimeValueCard";
import { SavingsCard } from "@/components/SavingsCard";
import { generateEnergyData } from "@/utils/energyData";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";

const Index = () => {
  const [viewType, setViewType] = useState<"daily" | "weekly" | "monthly">("daily");
  
  // Generate connected data based on view type
  const energyData = useMemo(() => generateEnergyData(viewType), [viewType]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Enovos Energy Wallet</h1>
              <p className="text-muted-foreground">Monitor your solar energy production and virtual battery status</p>
            </div>
            <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value as any)}>
              <ToggleGroupItem value="daily" aria-label="Daily view">
                Daily
              </ToggleGroupItem>
              <ToggleGroupItem value="weekly" aria-label="Weekly view">
                Weekly
              </ToggleGroupItem>
              <ToggleGroupItem value="monthly" aria-label="Monthly view">
                Monthly
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2">
            {/* Combined Charts Card */}
            <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50 space-y-8">
              <EnergyExcessChart 
                data={energyData} 
              />
              
              <VirtualBatteryChart 
                data={energyData} 
              />
            </div>
          </div>

          {/* Right Column - Battery Info */}
          <div className="lg:col-span-1 space-y-6">
            <BatteryInfoCard data={energyData} viewType={viewType} />
            <RealTimeValueCard data={energyData} />
            <SavingsCard data={energyData} />
          </div>
        </div>

        {/* Financial Breakdown Section */}
        <div className="mt-6">
          <div className="bg-card rounded-xl shadow-[var(--shadow-card)] p-6 border border-border/50">
            <FinancialBreakdownChart data={energyData} />
          </div>
        </div>
        </div>
      </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
