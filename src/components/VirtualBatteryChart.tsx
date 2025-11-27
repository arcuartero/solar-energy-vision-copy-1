import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
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
  // Calculate net energy difference for each data point
  const chartData = data.map(point => ({
    ...point,
    netEnergy: point.excessProduction - point.excessConsumption
  }));

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
            <Line
              type="monotone"
              dataKey="netEnergy"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--destructive))" }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-primary" />
          <span className="text-muted-foreground">Stored Energy (kWh)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-destructive" style={{ backgroundImage: 'repeating-linear-gradient(90deg, hsl(var(--destructive)) 0, hsl(var(--destructive)) 5px, transparent 5px, transparent 10px)' }} />
          <span className="text-muted-foreground">Net Energy (Production - Consumption)</span>
        </div>
      </div>
    </div>
  );
};
