// Generate connected energy data where battery level is calculated from excess production/consumption
export const generateEnergyData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  let batteryLevel = 50; // Start at 50%
  const batteryCapacity = 10; // 10 kWh capacity for scaling
  
  const data = hours.map((hour) => {
    // Generate excess production (positive) - higher during day hours
    const isDayTime = hour >= 8 && hour <= 18;
    const excessProduction = isDayTime 
      ? Math.random() * 5 + 2 
      : Math.random() > 0.7 ? Math.random() * 2 : 0;
    
    // Generate excess consumption (negative) - higher during evening/morning
    const isHighConsumption = (hour >= 18 && hour <= 23) || (hour >= 6 && hour <= 8);
    const excessConsumption = isHighConsumption 
      ? -(Math.random() * 4 + 1)
      : Math.random() > 0.6 ? -(Math.random() * 2) : 0;
    
    // Calculate net excess (positive = charging, negative = discharging)
    const netExcess = excessProduction + excessConsumption;
    
    // Update battery level based on net excess
    // Convert kWh to percentage (assuming 10 kWh capacity)
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
};

export type EnergyData = ReturnType<typeof generateEnergyData>;
