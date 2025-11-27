import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";
import type { EnergyData } from "@/utils/energyData";

interface VirtualBatteryChartProps {
  data: EnergyData;
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

export const VirtualBatteryChart = ({ data }: VirtualBatteryChartProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Virtual Battery Energy Stored</h3>
        <p className="text-sm text-muted-foreground">Energy stored based on excess production/consumption</p>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={(entry: any) => entry.storedEnergy >= 0 ? entry.storedEnergy : 0}
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey={(entry: any) => entry.storedEnergy < 0 ? entry.storedEnergy : 0}
              stroke="hsl(var(--chart-bordeaux))"
              strokeWidth={3}
              fill="hsl(var(--chart-bordeaux))"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <div className="w-8 h-0.5 bg-primary" />
        <span className="text-muted-foreground">Stored Energy (kWh)</span>
      </div>
    </div>
  );
};
