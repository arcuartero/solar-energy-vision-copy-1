import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Sample data - in real app, this would come from API
const generateData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map((hour) => ({
    time: `${hour.toString().padStart(2, "0")}:00`,
    excessProduction: Math.random() > 0.5 ? Math.random() * 5 + 2 : 0,
    excessConsumption: Math.random() > 0.5 ? -(Math.random() * 4 + 1) : 0,
  }));
};

export const EnergyExcessChart = () => {
  const [date, setDate] = useState<Date>(new Date());
  const data = generateData();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Excess Production & Consumption</h3>
          <p className="text-sm text-muted-foreground">Hourly energy balance</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal rounded-lg shadow-sm",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-xl shadow-lg" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--chart-grid))" vertical={false} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              label={{ value: "kWh", angle: -90, position: "insideLeft" }}
            />
            <Bar dataKey="excessProduction" radius={[4, 4, 0, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-production-${index}`} fill="hsl(var(--primary))" />
              ))}
            </Bar>
            <Bar dataKey="excessConsumption" radius={[0, 0, 4, 4]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-consumption-${index}`} fill="hsl(var(--chart-separator))" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-muted-foreground">Excess Production</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-chart-separator" />
          <span className="text-muted-foreground">Excess Consumption</span>
        </div>
      </div>
    </div>
  );
};
