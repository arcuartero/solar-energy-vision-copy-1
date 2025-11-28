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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";

const Index = () => {
  const [viewType, setViewType] = useState<"daily" | "weekly" | "monthly" | "custom">("daily");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: subDays(new Date(), 365),
    to: new Date(),
  });
  
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
          <div className="flex justify-end mb-6 gap-3">
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

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "px-6 justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Custom range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange({ from: range?.from, to: range?.to });
                    if (range?.from && range?.to) {
                      setViewType("custom");
                    }
                  }}
                  numberOfMonths={2}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-8">
              <div className="bg-card rounded-lg shadow-sm p-6 border border-border/50 space-y-6">
                <EnergyExcessChart 
                  data={energyData} 
                />
                
                <VirtualBatteryChart 
                  data={energyData} 
                />
              </div>
            </div>

            {/* Right Column - Battery Info */}
            <div className="lg:col-span-4 space-y-4">
              <RealTimeValueCard data={energyData} />
              <BatteryInfoCard data={energyData} viewType={viewType} />
              <SavingsCard data={energyData} />
            </div>
          </div>

          {/* Financial Breakdown Section */}
          <div className="mt-6">
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
