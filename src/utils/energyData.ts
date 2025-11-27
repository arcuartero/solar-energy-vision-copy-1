export type ViewType = "daily" | "weekly" | "monthly";

// Generate connected energy data where battery level is calculated from excess production/consumption
export const generateEnergyData = (viewType: ViewType = "daily") => {
  const batteryCapacity = 10; // 10 kWh capacity for scaling
  let batteryLevel = 50; // Start at 50%

  if (viewType === "daily") {
    // Original hourly data for a day (24 hours)
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    const data = hours.map((hour) => {
      const isDayTime = hour >= 8 && hour <= 18;
      const excessProduction = isDayTime 
        ? Math.random() * 5 + 2 
        : Math.random() > 0.7 ? Math.random() * 2 : 0;
      
      const isHighConsumption = (hour >= 18 && hour <= 23) || (hour >= 6 && hour <= 8);
      const excessConsumption = isHighConsumption 
        ? -(Math.random() * 4 + 1)
        : Math.random() > 0.6 ? -(Math.random() * 2) : 0;
      
      const netExcess = excessProduction + excessConsumption;
      const percentageChange = (netExcess / batteryCapacity) * 100;
      batteryLevel = Math.max(0, Math.min(100, batteryLevel + percentageChange));
      
      return {
        time: `${hour.toString().padStart(2, "0")}:00`,
        excessProduction,
        excessConsumption,
        batteryLevel: parseFloat(batteryLevel.toFixed(1)),
      };
    });
    
    return data;
  } else if (viewType === "weekly") {
    // Weekly data (7 days)
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    const data = days.map((day, index) => {
      // Weekend has different pattern
      const isWeekend = index >= 5;
      const excessProduction = isWeekend 
        ? Math.random() * 30 + 20 
        : Math.random() * 40 + 30;
      
      const excessConsumption = isWeekend 
        ? -(Math.random() * 25 + 15)
        : -(Math.random() * 35 + 20);
      
      const netExcess = excessProduction + excessConsumption;
      const percentageChange = (netExcess / batteryCapacity) * 100 / 24; // Average per hour
      batteryLevel = Math.max(0, Math.min(100, batteryLevel + percentageChange));
      
      return {
        time: day,
        excessProduction,
        excessConsumption,
        batteryLevel: parseFloat(batteryLevel.toFixed(1)),
      };
    });
    
    return data;
  } else {
    // Monthly data (30 days)
    const data = Array.from({ length: 30 }, (_, i) => {
      const day = i + 1;
      // More variation throughout the month
      const seasonalFactor = Math.sin((i / 30) * Math.PI) * 0.3 + 0.7;
      const excessProduction = (Math.random() * 40 + 30) * seasonalFactor;
      const excessConsumption = -(Math.random() * 35 + 20) * seasonalFactor;
      
      const netExcess = excessProduction + excessConsumption;
      const percentageChange = (netExcess / batteryCapacity) * 100 / 24; // Average per hour
      batteryLevel = Math.max(0, Math.min(100, batteryLevel + percentageChange));
      
      return {
        time: day.toString(),
        excessProduction,
        excessConsumption,
        batteryLevel: parseFloat(batteryLevel.toFixed(1)),
      };
    });
    
    return data;
  }
};

export type EnergyData = ReturnType<typeof generateEnergyData>;
