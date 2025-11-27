import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { EnergyData } from "@/utils/energyData";

interface EnergyExcessChartProps {
  data: EnergyData;
}

export const EnergyExcessChart = ({ data }: EnergyExcessChartProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Excess Production & Consumption</h3>
          <p className="text-sm text-muted-foreground">Energy balance over time</p>
        </div>
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
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <p className="font-semibold text-foreground mb-2">{data.time}</p>
                    {data.excessProduction > 0 && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary">Excess Production:</span>{" "}
                        {data.excessProduction.toFixed(2)} kWh
                      </p>
                    )}
                    {data.excessConsumption < 0 && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium" style={{ color: "hsl(var(--chart-separator))" }}>Excess Consumption:</span>{" "}
                        {Math.abs(data.excessConsumption).toFixed(2)} kWh
                      </p>
                    )}
                  </div>
                );
              }}
              cursor={{ fill: "hsl(var(--muted) / 0.1)" }}
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
          <span className="text-muted-foreground">Excess Production (charges battery)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-chart-separator" />
          <span className="text-muted-foreground">Excess Consumption (drains battery)</span>
        </div>
      </div>
    </div>
  );
};
