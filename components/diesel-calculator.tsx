"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Fuel, Zap, TrendingDown, Leaf } from "lucide-react"

interface DieselResults {
  dailyConsumption: number
  weeklyConsumption: number
  monthlyConsumption: number
  dailyCost: number
  weeklyCost: number
  monthlyCost: number
  annualCost: number
  solarRecommendation: {
    systemSize: number
    batteryCap: number
    estimatedSavings: number
    paybackPeriod: number
  }
}

export function DieselCalculator() {
  const [generatorSize, setGeneratorSize] = useState("")
  const [hoursPerDay, setHoursPerDay] = useState("")
  const [daysPerWeek, setDaysPerWeek] = useState("")
  const [dieselPrice, setDieselPrice] = useState("800") // Default price in Naira
  const [results, setResults] = useState<DieselResults | null>(null)
  const [loading, setLoading] = useState(false)

  const calculateDiesel = async () => {
    if (!generatorSize || !hoursPerDay || !daysPerWeek) return

    setLoading(true)

    // Simulate calculation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const genSize = Number.parseFloat(generatorSize)
    const hours = Number.parseFloat(hoursPerDay)
    const days = Number.parseFloat(daysPerWeek)
    const price = Number.parseFloat(dieselPrice)

    // Diesel consumption calculation (approximate)
    const consumptionPerHour = genSize * 0.25 // Liters per hour per kVA
    const dailyConsumption = consumptionPerHour * hours
    const weeklyConsumption = dailyConsumption * days
    const monthlyConsumption = weeklyConsumption * 4.33

    const dailyCost = dailyConsumption * price
    const weeklyCost = weeklyConsumption * price
    const monthlyCost = monthlyConsumption * price
    const annualCost = monthlyCost * 12

    // Solar recommendation
    const solarSystemSize = genSize * 1.2 // 20% oversizing
    const batteryCap = genSize * hours * 0.8 // Battery capacity in kWh
    const estimatedSavings = annualCost * 0.75 // 75% savings
    const paybackPeriod = (solarSystemSize * 1000000) / estimatedSavings // Assuming ₦1M per kW

    setResults({
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
    })

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E2A38] flex items-center gap-2">
          <Calculator className="h-8 w-8 text-[#22C55E]" />
          Diesel Calculator
        </h1>
        <p className="text-gray-600">Calculate your diesel consumption and discover solar savings</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Generator Details</CardTitle>
            <CardDescription>Enter your generator specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="generator-size">Generator Size (kVA)</Label>
              <Input
                id="generator-size"
                type="number"
                placeholder="e.g., 10"
                value={generatorSize}
                onChange={(e) => setGeneratorSize(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="hours-per-day">Hours of Use per Day</Label>
              <Input
                id="hours-per-day"
                type="number"
                placeholder="e.g., 8"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="days-per-week">Days per Week</Label>
              <Select value={daysPerWeek} onValueChange={setDaysPerWeek}>
                <SelectTrigger>
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="2">2 days</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="4">4 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="6">6 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="diesel-price">Diesel Price per Liter (₦)</Label>
              <Input
                id="diesel-price"
                type="number"
                placeholder="e.g., 800"
                value={dieselPrice}
                onChange={(e) => setDieselPrice(e.target.value)}
              />
            </div>

            <Button onClick={calculateDiesel} className="w-full bg-[#22C55E] hover:bg-[#16A34A]" disabled={loading}>
              {loading ? "Calculating..." : "Calculate Now"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="h-5 w-5 text-orange-500" />
                  Diesel Consumption & Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Daily</p>
                    <p className="text-lg font-bold">{results.dailyConsumption.toFixed(1)}L</p>
                    <p className="text-sm font-medium text-orange-600">₦{results.dailyCost.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Weekly</p>
                    <p className="text-lg font-bold">{results.weeklyConsumption.toFixed(1)}L</p>
                    <p className="text-sm font-medium text-orange-600">₦{results.weeklyCost.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Monthly</p>
                    <p className="text-lg font-bold">{results.monthlyConsumption.toFixed(1)}L</p>
                    <p className="text-sm font-medium text-red-600">₦{results.monthlyCost.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600">Annual</p>
                    <p className="text-lg font-bold">{(results.monthlyConsumption * 12).toFixed(0)}L</p>
                    <p className="text-sm font-medium text-red-600">₦{results.annualCost.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="energy-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#22C55E]" />
                  AI Solar Recommendation
                </CardTitle>
                <CardDescription>Switch to solar and save money</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Recommended Solar System</Label>
                    <p className="text-2xl font-bold text-[#22C55E]">
                      {results.solarRecommendation.systemSize.toFixed(1)} kW
                    </p>
                  </div>
                  <div>
                    <Label>Battery Capacity</Label>
                    <p className="text-2xl font-bold text-[#22C55E]">
                      {results.solarRecommendation.batteryCap.toFixed(1)} kWh
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Annual Savings</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    ₦{results.solarRecommendation.estimatedSavings.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-700">
                    Payback period: {results.solarRecommendation.paybackPeriod.toFixed(1)} years
                  </p>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Leaf className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Environmental Impact</p>
                    <p className="text-sm text-blue-700">
                      Reduce CO₂ emissions by ~{(results.monthlyConsumption * 12 * 2.68).toFixed(0)} kg/year
                    </p>
                  </div>
                </div>

                <Button className="w-full bg-[#1E2A38] hover:bg-[#1E2A38]/90">Book a Clean Energy Consultation</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
