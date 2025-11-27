import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import type { EnergyData } from "@/utils/energyData";

interface VirtualBatteryChartProps {
  data: EnergyData;
  showPublicCharging: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].payload.time}</p>
        <p className="text-sm text-primary font-semibold">
          {payload[0].value.toFixed(2)} kWh stored
        </p>
      </div>
    );
  }
  return null;
};

export const VirtualBatteryChart = ({ data, showPublicCharging }: VirtualBatteryChartProps) => {
  // Recalculate stored energy excluding public charging if needed
  const chartData = useMemo(() => {
    if (showPublicCharging) {
      return data;
    }
    
    // Recalculate storedEnergy without publicCharging
    let storedEnergy = data[0]?.storedEnergy || 0;
    return data.map((entry, index) => {
      if (index === 0) {
        return entry;
      }
      
      const prevStored = index > 0 ? data[index - 1].storedEnergy : entry.storedEnergy;
      const netExcess = entry.excessProduction + entry.excessConsumption; // Exclude publicCharging
      storedEnergy = Math.max(0, prevStored + netExcess);
      
      return {
        ...entry,
        storedEnergy: parseFloat(storedEnergy.toFixed(2))
      };
    });
  }, [data, showPublicCharging]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Virtual Battery Energy Stored</h3>
        <p className="text-sm text-muted-foreground">Energy stored based on excess production/consumption</p>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
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
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="storedEnergy"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <div className="w-8 h-0.5 bg-primary" />
        <span className="text-muted-foreground">Stored Energy (kWh)</span>
      </div>
    </div>
  );
};
