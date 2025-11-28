import { useMemo, useState, useEffect } from "react";
import { EnergyExcessChart } from "@/components/EnergyExcessChart";
import { VirtualBatteryChart } from "@/components/VirtualBatteryChart";
import { FinancialBreakdownChart } from "@/components/FinancialBreakdownChart";
import { BatteryInfoCard } from "@/components/BatteryInfoCard";
import { RealTimeValueCard } from "@/components/RealTimeValueCard";
import { SavingsCard } from "@/components/SavingsCard";
import { generateEnergyData } from "@/utils/energyData";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
const Index = () => {
  const [viewType] = useState<"daily" | "weekly" | "monthly" | "custom">("custom");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31)
  });
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false);
  const [batteryCharge, setBatteryCharge] = useState(0);
  const [isCharged, setIsCharged] = useState(false);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);

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
    if (!isSubscriptionActive) {
      setBatteryCharge(0);
      setIsCharged(false);
      setIsSubscribeDialogOpen(true);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsSubscribeDialogOpen(open);
    if (!open && isCharged) {
      setIsSubscriptionActive(true);
    }
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
            className={cn(
              "font-medium",
              isSubscriptionActive 
                ? "bg-green-600 hover:bg-green-600 text-white cursor-default" 
                : "bg-orange-600 hover:bg-orange-700 text-white"
            )}
            onClick={handleSubscribeClick}
          >
            {isSubscriptionActive ? "Energy Cloud subscription active" : "Subscribe now"}
          </Button>
        </div>

        {/* Main Card Container */}
        <div className="bg-card rounded-lg shadow-sm p-8 border border-border/30">
          {/* Year Selector */}
          <div className="flex justify-end mb-6">
            <Select 
              value={selectedYear} 
              onValueChange={(year) => {
                setSelectedYear(year);
                setDateRange({
                  from: new Date(parseInt(year), 0, 1),
                  to: new Date(parseInt(year), 11, 31)
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
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
              <RealTimeValueCard viewType={viewType} dateRange={dateRange} />
              <BatteryInfoCard data={energyData} viewType={viewType} />
              <SavingsCard viewType={viewType} dateRange={dateRange} />
            </div>
          </div>

          {/* Financial Breakdown Section */}
          <div className="mt-6">
            <FinancialBreakdownChart data={energyData} selectedYear={selectedYear} />
          </div>

        </div>
        </div>
      </div>
      </div>

      {/* Subscribe Dialog */}
      <Dialog open={isSubscribeDialogOpen} onOpenChange={handleDialogClose}>
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