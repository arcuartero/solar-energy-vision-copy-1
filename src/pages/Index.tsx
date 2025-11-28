import { useMemo, useState, useEffect } from "react";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
const Index = () => {
  const [viewType, setViewType] = useState<"daily" | "weekly" | "monthly" | "custom">("daily");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subDays(new Date(), 365),
    to: new Date()
  });
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const [batteryCharge, setBatteryCharge] = useState(0);
  const [isCharged, setIsCharged] = useState(false);

  // Generate connected data based on view type
  const energyData = useMemo(() => generateEnergyData(viewType), [viewType]);

  // Battery charging animation
  useEffect(() => {
    if (isSubscribeDialogOpen && batteryCharge < 100) {
      const timer = setTimeout(() => {
        setBatteryCharge(prev => Math.min(prev + 2, 100));
      }, 30);
      return () => clearTimeout(timer);
    }
    if (batteryCharge === 100 && !isCharged) {
      setTimeout(() => setIsCharged(true), 300);
    }
  }, [isSubscribeDialogOpen, batteryCharge, isCharged]);

  const handleSubscribeClick = () => {
    setBatteryCharge(0);
    setIsCharged(false);
    setIsSubscribeDialogOpen(true);
  };
  return <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          <Header />
      <div className="container mx-auto px-6 py-6 max-w-[1600px]">
        {/* Header Section - Outside Card */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Enovos Energy Cloud</h1>
            <p className="text-muted-foreground text-base">Monitor your solar energy production and virtual battery status</p>
          </div>
          <Button 
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium"
            onClick={handleSubscribeClick}
          >
            Subscribe now
          </Button>
        </div>

        {/* Main Card Container */}
        <div className="bg-card rounded-lg shadow-sm p-8 border border-border/30">
          {/* Date Picker */}
          <div className="flex justify-end mb-6 gap-3">
            <ToggleGroup type="single" value={viewType} onValueChange={value => value && setViewType(value as any)}>
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
                <Button variant="outline" className={cn("px-6 justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? dateRange.to ? <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </> : format(dateRange.from, "LLL dd, y") : <span>Custom range</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="range" selected={dateRange} onSelect={range => {
                    setDateRange({
                      from: range?.from,
                      to: range?.to
                    });
                    if (range?.from && range?.to) {
                      setViewType("custom");
                    }
                  }} numberOfMonths={2} initialFocus className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-8">
            <div className="bg-card rounded-lg shadow-sm p-6 space-y-6">
              <EnergyExcessChart data={energyData} />
              
              <VirtualBatteryChart data={energyData} />
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

      {/* Subscribe Dialog */}
      <Dialog open={isSubscribeDialogOpen} onOpenChange={setIsSubscribeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            {!isCharged ? (
              <>
                <div className="relative w-32 h-48">
                  {/* Battery outline */}
                  <div className="absolute inset-0 border-4 border-foreground rounded-lg">
                    {/* Battery tip */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-foreground rounded-t"></div>
                    {/* Battery fill */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-600 to-orange-400 rounded-b transition-all duration-300 ease-out"
                      style={{ height: `${batteryCharge}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-2xl font-semibold text-foreground animate-pulse">
                  Charging... {batteryCharge}%
                </p>
              </>
            ) : (
              <div className="text-center space-y-4 animate-scale-in">
                <div className="text-6xl">⚡</div>
                <p className="text-2xl font-bold text-foreground">
                  Your energy cloud is ready.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>;
};
export default Index;