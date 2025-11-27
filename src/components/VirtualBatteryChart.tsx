import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import type { EnergyData } from "@/utils/energyData";

interface VirtualBatteryChartProps {
  data: EnergyData;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const storedEnergy = payload.find((p: any) => p.dataKey === 'storedEnergy')?.value || 0;
    const gridConsumption = payload.find((p: any) => p.dataKey === 'gridConsumption')?.value || 0;
    
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].payload.time}</p>
        {storedEnergy > 0 && (
          <p className="text-sm text-primary font-semibold">
            {storedEnergy.toFixed(2)} kWh stored
          </p>
        )}
        {gridConsumption < 0 && (
          <p className="text-sm text-destructive font-semibold">
            {Math.abs(gridConsumption).toFixed(2)} kWh from grid
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const VirtualBatteryChart = ({ data }: VirtualBatteryChartProps) => {
  // Calculate grid consumption: when battery is at 0 and there's net consumption
  const chartData = data.map(point => {
    const netEnergy = point.excessProduction + point.excessConsumption;
    const gridConsumption = point.storedEnergy === 0 && netEnergy < 0 ? netEnergy : 0;
    
    return {
      time: point.time,
      storedEnergy: point.storedEnergy,
      gridConsumption: gridConsumption,
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Virtual Battery & Grid Usage</h3>
        <p className="text-sm text-muted-foreground">Energy stored in battery and consumption from grid when battery is empty</p>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
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
            <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={2} />
            <Area
              type="monotone"
              dataKey="storedEnergy"
              fill="hsl(142 76% 36% / 0.3)"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="gridConsumption"
              stroke="hsl(var(--destructive))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--destructive))" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 rounded" style={{ backgroundColor: 'hsl(142 76% 36% / 0.8)' }} />
          <span className="text-muted-foreground">Stored Energy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-destructive" />
          <span className="text-muted-foreground">Grid Consumption</span>
        </div>
      </div>
    </div>
  );
};
