// DieselCalculator.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, Fuel, Zap, TrendingDown, Leaf } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { saveCalculation } from "@/lib/firestore";

interface DieselResults {
  dailyConsumption: number;
  weeklyConsumption: number;
  monthlyConsumption: number;
  dailyCost: number;
  weeklyCost: number;
  monthlyCost: number;
  annualCost: number;
  solarRecommendation: {
    systemSize: number;
    batteryCap: number;
    estimatedSavings: number;
    paybackPeriod: number;
  };
}

export function DieselCalculator() {
  const [generatorSize, setGeneratorSize] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("");
  const [dieselPrice, setDieselPrice] = useState("800");
  const [results, setResults] = useState<DieselResults | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const calculateDiesel = async () => {
    if (!generatorSize || !hoursPerDay || !daysPerWeek) return;
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const genSize = Number(generatorSize);
    const hours = Number(hoursPerDay);
    const days = Number(daysPerWeek);
    const price = Number(dieselPrice);

    const consumptionPerHour = genSize * 0.25;
    const dailyConsumption = consumptionPerHour * hours;
    const weeklyConsumption = dailyConsumption * days;
    const monthlyConsumption = weeklyConsumption * 4.33;

    const dailyCost = dailyConsumption * price;
    const weeklyCost = weeklyConsumption * price;
    const monthlyCost = monthlyConsumption * price;
    const annualCost = monthlyCost * 12;

    const solarSystemSize = genSize * 1.2;
    const batteryCap = genSize * hours * 0.8;
    const estimatedSavings = annualCost * 0.75;
    const paybackPeriod = (solarSystemSize * 1_000_000) / estimatedSavings;

    const result = {
      dailyConsumption,
      weeklyConsumption,
      monthlyConsumption,
      dailyCost,
      weeklyCost,
      monthlyCost,
      annualCost,
      solarRecommendation: {
        systemSize: solarSystemSize,
        batteryCap,
        estimatedSavings,
        paybackPeriod,
      },
    };

    setResults(result);

    if (user) {
      await saveCalculation(user.uid, "diesel", {
        generatorSize: genSize,
        hoursPerDay: hours,
        daysPerWeek: days,
        dieselPrice: price,
        result,
      });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E2A38] flex items-center gap-2">
          <Calculator className="h-8 w-8 text-[#22C55E]" />
          Diesel Calculator
        </h1>
        <p className="text-gray-600">
          Calculate your diesel consumption and discover solar savings
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generator Details</CardTitle>
            <CardDescription>
              Enter your generator specifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label htmlFor="generator-size">Generator Size (kVA)</Label>
            <Input
              id="generator-size"
              type="number"
              value={generatorSize}
              onChange={(e) => setGeneratorSize(e.target.value)}
            />
            <Label htmlFor="hours-per-day">Hours of Use per Day</Label>
            <Input
              id="hours-per-day"
              type="number"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
            />
            <Label htmlFor="days-per-week">Days per Week</Label>
            <Select value={daysPerWeek} onValueChange={setDaysPerWeek}>
              <SelectTrigger>
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(7)].map((_, i) => (
                  <SelectItem key={i} value={(i + 1).toString()}>
                    {i + 1} day{i > 0 && "s"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="diesel-price">Diesel Price per Liter (₦)</Label>
            <Input
              id="diesel-price"
              type="number"
              value={dieselPrice}
              onChange={(e) => setDieselPrice(e.target.value)}
            />
            <Button
              onClick={calculateDiesel}
              disabled={loading}
              className="w-full bg-[#22C55E] hover:bg-[#16A34A]"
            >
              {loading ? "Calculating..." : "Calculate Now"}
            </Button>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-orange-500" />
                Diesel Consumption & Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded">
                  <p>
                    Daily: {results.dailyConsumption.toFixed(1)}L / ₦
                    {results.dailyCost.toLocaleString()}
                  </p>
                  <p>
                    Weekly: {results.weeklyConsumption.toFixed(1)}L / ₦
                    {results.weeklyCost.toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded">
                  <p>
                    Monthly: {results.monthlyConsumption.toFixed(1)}L / ₦
                    {results.monthlyCost.toLocaleString()}
                  </p>
                  <p>
                    Annual: {(results.monthlyConsumption * 12).toFixed(0)}L / ₦
                    {results.annualCost.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
