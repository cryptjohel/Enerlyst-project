"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Zap, BarChart3, Lightbulb, Star } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { saveCalculation } from "@/lib/firestore";

interface Appliance {
  id: string;
  name: string;
  quantity: number;
  hoursPerDay: number;
  wattage: number;
  location: string;
}

interface LoadProfile {
  totalDailyLoad: number;
  totalWeeklyLoad: number;
  totalMonthlyLoad: number;
  solarRecommendation: {
    systemSize: number;
    batterySize: number;
    inverterSize: number;
  };
  sustainabilityRating: number;
  suggestions: string[];
}

const commonAppliances = [
  { name: "LED Bulb", wattage: 10 },
  { name: "Ceiling Fan", wattage: 75 },
  { name: "Refrigerator", wattage: 150 },
  { name: "Air Conditioner (1HP)", wattage: 746 },
  { name: "Television (LED)", wattage: 100 },
  { name: "Laptop", wattage: 65 },
  { name: "Washing Machine", wattage: 500 },
  { name: "Microwave", wattage: 1000 },
  { name: "Water Heater", wattage: 1500 },
  { name: "Iron", wattage: 1200 },
];

export function ApplianceProfiler() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [newAppliance, setNewAppliance] = useState({
    name: "",
    quantity: 1,
    hoursPerDay: 1,
    wattage: 0,
    location: "",
  });
  const [loadProfile, setLoadProfile] = useState<LoadProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const addAppliance = () => {
    if (!newAppliance.name || !newAppliance.wattage) return;

    const appliance: Appliance = {
      id: Date.now().toString(),
      ...newAppliance,
    };

    setAppliances([...appliances, appliance]);
    setNewAppliance({
      name: "",
      quantity: 1,
      hoursPerDay: 1,
      wattage: 0,
      location: "",
    });
  };

  const removeAppliance = (id: string) => {
    setAppliances(appliances.filter((a) => a.id !== id));
  };

  const calculateLoadProfile = async () => {
    if (appliances.length === 0) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const totalDailyLoad = appliances.reduce((total, appliance) => {
      return total + (appliance.wattage * appliance.quantity * appliance.hoursPerDay) / 1000;
    }, 0);

    const totalWeeklyLoad = totalDailyLoad * 7;
    const totalMonthlyLoad = totalDailyLoad * 30;

    const systemSize = totalDailyLoad * 1.3;
    const batterySize = totalDailyLoad * 2;
    const inverterSize = (Math.max(...appliances.map((a) => a.wattage * a.quantity)) * 1.2) / 1000;

    const avgWattagePerHour = totalDailyLoad / appliances.reduce((sum, a) => sum + a.hoursPerDay, 0);
    const sustainabilityRating = Math.max(0, 100 - avgWattagePerHour * 0.1);

    const suggestions = [
      "Replace incandescent bulbs with LED bulbs to save up to 80% energy",
      "Use energy-efficient appliances with 5-star ratings",
      "Set air conditioner to 24°C instead of 18°C to save 30% energy",
      "Unplug devices when not in use to eliminate phantom loads",
      "Use natural lighting during daytime to reduce bulb usage",
    ];

    const profileData: LoadProfile = {
      totalDailyLoad,
      totalWeeklyLoad,
      totalMonthlyLoad,
      solarRecommendation: {
        systemSize,
        batterySize,
        inverterSize,
      },
      sustainabilityRating,
      suggestions,
    };

    setLoadProfile(profileData);

    if (user) {
      await saveCalculation(user.uid, "load", {
        appliances,
        profileData,
      });
    }

    setLoading(false);
  };

  const handleApplianceSelect = (applianceName: string) => {
    const selected = commonAppliances.find((a) => a.name === applianceName);
    if (selected) {
      setNewAppliance({
        ...newAppliance,
        name: selected.name,
        wattage: selected.wattage,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E2A38] flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-[#22C55E]" />
          Appliance Load Profiler
        </h1>
        <p className="text-gray-600">Analyze your appliance energy usage and get optimization tips</p>
      </div>

      {/* Input and Display Logic */}
      {/* Keep the rest of your existing UI unchanged as you already have it perfectly styled */}
      {/* I excluded repeated JSX to save space. You can retain your layout and paste this logic in your existing file */}

      {/* Results displayed using `loadProfile` state */}
    </div>
  );
}
