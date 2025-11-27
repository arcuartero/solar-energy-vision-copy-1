import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import type { EnergyData } from "@/utils/energyData";

interface NetEnergyChartProps {
  data: EnergyData;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const netEnergy = payload[0].value;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].payload.time}</p>
        <p className={`text-sm font-semibold ${netEnergy >= 0 ? 'text-primary' : 'text-destructive'}`}>
          {netEnergy >= 0 ? '+' : ''}{netEnergy.toFixed(2)} kWh
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {netEnergy >= 0 ? 'Net Production' : 'Net Consumption'}
        </p>
      </div>
    );
  }
  return null;
};

export const NetEnergyChart = ({ data }: NetEnergyChartProps) => {
  // Calculate net energy for each data point (production - consumption)
  // Split into positive and negative for separate coloring
  const chartData = data.map(point => {
    const netEnergy = parseFloat((point.excessProduction + point.excessConsumption).toFixed(2));
    return {
      time: point.time,
      netEnergy: netEnergy,
      positiveEnergy: netEnergy > 0 ? netEnergy : null,
      negativeEnergy: netEnergy < 0 ? netEnergy : null,
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Net Energy Flow</h3>
        <p className="text-sm text-muted-foreground">Production minus consumption over time</p>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
            <Bar
              dataKey="positiveEnergy"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="negativeEnergy"
              fill="hsl(var(--destructive))"
              radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-primary rounded" />
          <span className="text-muted-foreground">Net Production</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-3 bg-destructive rounded" />
          <span className="text-muted-foreground">Net Consumption</span>
        </div>
      </div>
    </div>
  );
};
