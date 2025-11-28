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
      <div className="container mx-auto px-6 py-6 max-w-[1600px]">
        {/* Header Section - Outside Card */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-3">Enovos Energy Cloud</h1>
          <p className="text-muted-foreground text-base">Monitor your solar energy production and virtual battery status</p>
        </div>

        {/* Main Card Container */}
        <div className="bg-card rounded-lg shadow-sm p-8 border border-border/30">
          {/* Date Picker */}
          <div className="flex justify-end mb-6">
            <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value as any)}>
              <ToggleGroupItem value="daily" aria-label="Daily view" className="px-6">
                Daily
              </ToggleGroupItem>
              <ToggleGroupItem value="weekly" aria-label="Weekly view" className="px-6">
                Weekly
              </ToggleGroupItem>
              <ToggleGroupItem value="monthly" aria-label="Monthly view" className="px-6">
                Monthly
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-8 space-y-6">
              <EnergyExcessChart 
                data={energyData} 
              />
              
              <VirtualBatteryChart 
                data={energyData} 
              />
            </div>

            {/* Right Column - Battery Info */}
            <div className="lg:col-span-4 space-y-4">
              <RealTimeValueCard data={energyData} />
              <BatteryInfoCard data={energyData} viewType={viewType} />
              <SavingsCard data={energyData} />
            </div>
          </div>

        </div>

        {/* Financial Breakdown Section */}
        <div className="mt-6 bg-card rounded-lg shadow-sm p-8 border border-border/30">
          <FinancialBreakdownChart data={energyData} />
        </div>
        </div>
      </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
