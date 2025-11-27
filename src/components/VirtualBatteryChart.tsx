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
  // Split data into positive (battery) and negative (grid consumption)
  const positiveData = data.map(point => ({
    ...point,
    storedEnergy: point.storedEnergy >= 0 ? point.storedEnergy : null
  }));
  
  const negativeData = data.map(point => ({
    ...point,
    storedEnergy: point.storedEnergy < 0 ? point.storedEnergy : null
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
            <Line
              type="monotone"
              data={positiveData}
              dataKey="storedEnergy"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              data={negativeData}
              dataKey="storedEnergy"
              stroke="hsl(var(--chart-bordeaux))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--chart-bordeaux))" }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-primary" />
          <span className="text-muted-foreground">Battery Stored Energy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-chart-bordeaux" />
          <span className="text-muted-foreground">Grid Consumption (Battery Empty)</span>
        </div>
      </div>
    </div>
  );
};
