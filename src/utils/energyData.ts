export type ViewType = "daily" | "weekly" | "monthly";

// Generate connected energy data where stored energy is calculated from excess production/consumption
export const generateEnergyData = (viewType: ViewType = "daily") => {
  let storedEnergy = 5; // Start at 5 kWh

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
      storedEnergy = Math.max(0, storedEnergy + netExcess);
      
      return {
        time: `${hour.toString().padStart(2, "0")}:00`,
        excessProduction,
        excessConsumption,
        storedEnergy: parseFloat(storedEnergy.toFixed(2)),
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
      storedEnergy = Math.max(0, storedEnergy + netExcess);
      
      return {
        time: day,
        excessProduction,
        excessConsumption,
        storedEnergy: parseFloat(storedEnergy.toFixed(2)),
      };
    });
    
    return data;
  } else {
    // Monthly data (12 months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const data = months.map((month, i) => {
      // More variation throughout the year (seasonal patterns)
      const seasonalFactor = Math.sin((i / 12) * Math.PI * 2) * 0.3 + 0.7;
      const excessProduction = (Math.random() * 200 + 150) * seasonalFactor;
      const excessConsumption = -(Math.random() * 150 + 100) * seasonalFactor;
      
      const netExcess = excessProduction + excessConsumption;
      storedEnergy = Math.max(0, storedEnergy + netExcess);
      
      return {
        time: month,
        excessProduction,
        excessConsumption,
        storedEnergy: parseFloat(storedEnergy.toFixed(2)),
      };
    });
    
    return data;
  }
};

export type EnergyData = ReturnType<typeof generateEnergyData>;
