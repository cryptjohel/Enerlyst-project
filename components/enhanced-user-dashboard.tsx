"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { VoiceApplianceInput } from "./voice-appliance-input"
import { TrendingUp, TrendingDown, Zap, Calendar, BarChart3, Mic } from "lucide-react"

interface EnergyTrend {
  date: string
  consumption: number
  cost: number
  efficiency: number
}

interface UsagePattern {
  appliance: string
  peakHours: string[]
  avgDailyUsage: number
  trend: "increasing" | "decreasing" | "stable"
}

export function EnhancedUserDashboard() {
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [energyTrends, setEnergyTrends] = useState<EnergyTrend[]>([])
  const [usagePatterns, setUsagePatterns] = useState<UsagePattern[]>([])
  const [currentMonth, setCurrentMonth] = useState({
    consumption: 1456,
    cost: 45234,
    efficiency: 85,
    savings: 12340,
  })

  useEffect(() => {
    // Generate mock trend data
    const trends: EnergyTrend[] = []
    for (let i = 30; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      trends.push({
        date: date.toISOString().split("T")[0],
        consumption: 40 + Math.random() * 20 + Math.sin(i / 7) * 10,
        cost: 1200 + Math.random() * 600 + Math.sin(i / 7) * 300,
        efficiency: 75 + Math.random() * 20,
      })
    }
    setEnergyTrends(trends)

    // Mock usage patterns
    setUsagePatterns([
      {
        appliance: "Air Conditioner",
        peakHours: ["14:00-18:00", "20:00-23:00"],
        avgDailyUsage: 3.2,
        trend: "increasing",
      },
      {
        appliance: "Refrigerator",
        peakHours: ["Always On"],
        avgDailyUsage: 3.6,
        trend: "stable",
      },
      {
        appliance: "LED Lighting",
        peakHours: ["18:00-22:00"],
        avgDailyUsage: 0.3,
        trend: "decreasing",
      },
    ])
  }, [])

  const handleVoiceAnalysis = (analysis: any) => {
    // Update dashboard with voice analysis results
    const newConsumption = analysis.totalLoad * 30 // Monthly estimate
    setCurrentMonth((prev) => ({
      ...prev,
      consumption: newConsumption,
      cost: newConsumption * 31, // Rough cost estimate
    }))

    // Add to trends
    const newTrend: EnergyTrend = {
      date: new Date().toISOString().split("T")[0],
      consumption: analysis.totalLoad,
      cost: analysis.totalLoad * 31,
      efficiency: 85 + Math.random() * 10,
    }
    setEnergyTrends((prev) => [...prev.slice(-29), newTrend])
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <BarChart3 className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enhanced Energy Dashboard</h1>
          <p className="text-muted-foreground">AI-powered insights and voice-enabled tracking</p>
        </div>
        <Button onClick={() => setShowVoiceInput(!showVoiceInput)} className="bg-[#22C55E] hover:bg-[#16A34A]">
          <Mic className="h-4 w-4 mr-2" />
          Voice Input
        </Button>
      </div>

      {showVoiceInput && <VoiceApplianceInput onAnalysisComplete={handleVoiceAnalysis} />}

      {/* Current Month Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
            <Zap className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">{currentMonth.consumption.toFixed(0)} kWh</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Calendar className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">₦{currentMonth.cost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">{currentMonth.efficiency}/100</div>
            <Progress value={currentMonth.efficiency} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{currentMonth.savings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Through AI recommendations</p>
          </CardContent>
        </Card>
      </div>

      {/* Energy Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>30-Day Energy Trends</CardTitle>
          <CardDescription>Daily consumption and cost patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-1">
            {energyTrends.slice(-14).map((trend, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-[#22C55E] rounded-t w-full min-h-[20px] transition-all hover:bg-[#16A34A]"
                  style={{ height: `${(trend.consumption / 60) * 200}px` }}
                  title={`${trend.date}: ${trend.consumption.toFixed(1)} kWh`}
                />
                <span className="text-xs text-muted-foreground mt-1 rotate-45 origin-left">
                  {new Date(trend.date).getDate()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Usage Patterns</CardTitle>
          <CardDescription>AI-detected appliance usage patterns and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usagePatterns.map((pattern, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{pattern.appliance}</h4>
                    {getTrendIcon(pattern.trend)}
                    <Badge variant="secondary" className="text-xs">
                      {pattern.trend}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Peak: {pattern.peakHours.join(", ")} • Avg: {pattern.avgDailyUsage} kWh/day
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{(pattern.avgDailyUsage * 31 * 30).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">₦/month</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-gradient-to-r from-[#22C55E]/10 to-blue-500/10">
        <CardHeader>
          <CardTitle className="text-[#22C55E]">AI-Powered Recommendations</CardTitle>
          <CardDescription>Personalized suggestions based on your usage patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
              <Badge className="bg-[#22C55E] mt-1">1</Badge>
              <div>
                <p className="font-medium">Optimize AC Usage</p>
                <p className="text-sm text-muted-foreground">
                  Set your AC to 24°C instead of 18°C to save ₦8,500/month
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
              <Badge className="bg-blue-500 mt-1">2</Badge>
              <div>
                <p className="font-medium">Solar System Recommendation</p>
                <p className="text-sm text-muted-foreground">
                  A 3.5kW solar system would cover 80% of your energy needs
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
              <Badge className="bg-purple-500 mt-1">3</Badge>
              <div>
                <p className="font-medium">Load Scheduling</p>
                <p className="text-sm text-muted-foreground">
                  Run washing machine during 10AM-2PM for 15% cost savings
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
