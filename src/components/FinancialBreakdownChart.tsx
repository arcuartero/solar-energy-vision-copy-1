import { useMemo, useState, useEffect } from "react";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import * as XLSX from 'xlsx';

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
  const [monthsToShow, setMonthsToShow] = useState<3 | 6 | 12>(12);
  const [xlsxData, setXlsxData] = useState<any[]>([]);
  
  const monthlyFee = 10; // Fixed monthly fee per month

  // Load XLSX data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/src/data/monthly_summary_all_years.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        setXlsxData(jsonData);
      } catch (error) {
        console.error('Error loading XLSX data:', error);
      }
    };
    loadData();
  }, []);

  const financialData = useMemo(() => {
    if (xlsxData.length === 0) return [];
    
    // Get the last N months from the data
    const sortedData = [...xlsxData].sort((a: any, b: any) => 
      a.month_year.localeCompare(b.month_year)
    );
    
    const lastMonths = sortedData.slice(-monthsToShow);
    
    return lastMonths.map((row: any) => {
      // Parse month_year (format: "YYYY-MM")
      const [year, month] = row.month_year.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const formattedMonth = `${monthName} ${year}`;
      
      // Calculate values according to specifications
      const loss = row.loss_not_injecting_euros || 0;
      const gain = (row.stored_value_variation_euros || 0) + (row.gain_not_drawing_euros || 0);
      const fee = -monthlyFee;
      const totalGain = row.total_gain_euros || 0;

      return {
        time: formattedMonth,
        loss: loss,
        gain: gain,
        monthlyFee: fee,
        totalGain: totalGain,
      };
    });
  }, [xlsxData, monthsToShow]);

  return (
    <div className="w-full bg-card rounded-lg shadow-sm p-6 border border-border/50">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Monthly Financial Breakdown - Last {monthsToShow} Months
            </h2>
            <p className="text-muted-foreground text-sm">
              Financial impact of your energy usage and production throughout the year
            </p>
          </div>
          <ToggleGroup type="single" value={monthsToShow.toString()} onValueChange={(value) => value && setMonthsToShow(Number(value) as 3 | 6 | 12)}>
            <ToggleGroupItem value="3" aria-label="Last 3 months">
              3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="6" aria-label="Last 6 months">
              6 months
            </ToggleGroupItem>
            <ToggleGroupItem value="12" aria-label="Last 12 months">
              12 months
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
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
