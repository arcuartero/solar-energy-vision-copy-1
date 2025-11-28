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

export const FinancialBreakdownChart = ({ data }: FinancialBreakdownChartProps) => {
  // Price per kWh in euros
  const pricePerKWh = 0.30;
  const monthlyFee = 10; // Fixed monthly fee per month

  const financialData = useMemo(() => {
    // Generate last 12 months from current date
    const now = new Date();
    const months = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      months.push(`${monthName} ${year}`);
    }
    
    return months.map((month, i) => {
      // Generate monthly data with seasonal patterns
      const seasonalFactor = Math.sin((i / 12) * Math.PI * 2) * 0.3 + 0.7;
      const excessProduction = (Math.random() * 200 + 150) * seasonalFactor;
      const excessConsumption = (Math.random() * 150 + 100) * seasonalFactor;
      
      // Loss: excess consumption (energy we need to draw from grid)
      const loss = -excessConsumption * pricePerKWh;
      
      // Gain: excess production (energy we don't draw + stored value)
      const gain = excessProduction * pricePerKWh;
      
      // Monthly fee
      const fee = -monthlyFee;
      
      // Total gain/loss
      const totalGain = gain + loss + fee;

      return {
        time: month,
        loss: loss,
        gain: gain,
        monthlyFee: fee,
        totalGain: totalGain,
      };
    });
  }, []);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Monthly Financial Breakdown - Last 12 Months
        </h2>
        <p className="text-muted-foreground text-sm">
          Financial impact of your energy usage and production throughout the year
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
          
          {/* Loss (not injecting) - Bordeaux bars */}
          <Bar
            dataKey="loss"
            fill="hsl(0, 63%, 31%)"
            name="Loss (not injecting)"
            radius={[8, 8, 0, 0]}
          />
          
          {/* Gain (not drawing + stored value) - Blue bars */}
          <Bar
            dataKey="gain"
            fill="hsl(217, 91%, 60%)"
            name="Gain (not drawing + stored value)"
            radius={[8, 8, 0, 0]}
          />
          
          {/* Monthly fee - Orange bars */}
          <Bar
            dataKey="monthlyFee"
            fill="hsl(25, 95%, 53%)"
            name="Monthly fee"
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
