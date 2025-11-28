import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { EnergyData } from "@/utils/energyData";

interface FinancialBreakdownChartProps {
  data: EnergyData;
  viewType: "daily" | "weekly" | "monthly";
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border/50 p-3 rounded-lg shadow-lg">
        <p className="text-foreground font-semibold mb-2">{payload[0].payload.time}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: €{Math.abs(entry.value).toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const FinancialBreakdownChart = ({ data, viewType }: FinancialBreakdownChartProps) => {
  // Price per kWh in euros
  const pricePerKWh = 0.30;
  const monthlyFee = 10; // Fixed monthly fee

  const financialData = useMemo(() => {
    return data.map((point) => {
      // Loss: excess consumption (energy we need to draw from grid)
      const loss = point.excessConsumption > 0 ? -point.excessConsumption * pricePerKWh : 0;
      
      // Gain: excess production (energy we don't draw + stored value)
      const gain = point.excessProduction > 0 ? point.excessProduction * pricePerKWh : 0;
      
      // Monthly fee (distributed across time periods)
      const fee = viewType === "monthly" ? -monthlyFee : -monthlyFee / (viewType === "weekly" ? 4 : 30);
      
      // Total gain/loss
      const totalGain = gain + loss + fee;

      return {
        time: point.time,
        loss: loss,
        gain: gain,
        monthlyFee: fee,
        totalGain: totalGain,
      };
    });
  }, [data, viewType]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">
          {viewType === "monthly" ? "Monthly" : viewType === "weekly" ? "Weekly" : "Daily"} Financial Breakdown
        </h2>
        <p className="text-muted-foreground text-sm">
          Financial impact of your energy usage and production
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            label={{ value: "Euros (€)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="rect"
            wrapperStyle={{ paddingBottom: "20px" }}
          />
          <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
          
          {/* Loss (not injecting) - Bordeaux bars below zero */}
          <Bar
            dataKey="loss"
            fill="hsl(0, 63%, 31%)"
            name="Loss (not injecting)"
            stackId="stack"
            radius={[8, 8, 0, 0]}
          />
          
          {/* Gain (not drawing + stored value) - Blue bars above zero */}
          <Bar
            dataKey="gain"
            fill="hsl(217, 91%, 60%)"
            name="Gain (not drawing + stored value)"
            stackId="stack"
            radius={[8, 8, 0, 0]}
          />
          
          {/* Monthly fee - Orange bars below zero */}
          <Bar
            dataKey="monthlyFee"
            fill="hsl(25, 95%, 53%)"
            name="Monthly fee"
            stackId="stack"
            radius={[8, 8, 0, 0]}
          />
          
          {/* Total gain - Green bars */}
          <Bar
            dataKey="totalGain"
            fill="hsl(142, 76%, 36%)"
            name="Total gain"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
