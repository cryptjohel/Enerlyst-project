// types/appliance.ts
export interface Appliance {
  id: string;
  name: string;
  wattage: number;      // W
  quantity: number;
  hoursPerDay: number;  // h/day
  location?: string;
  consumption: number;  // Wh
  kwhPerDay?: number;   // kWh/day
}
