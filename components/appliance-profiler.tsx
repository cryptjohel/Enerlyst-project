"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Zap, BarChart3, Lightbulb, Star } from "lucide-react"

interface Appliance {
  id: string
  name: string
  quantity: number
  hoursPerDay: number
  wattage: number
  location: string
}

interface LoadProfile {
  totalDailyLoad: number
  totalWeeklyLoad: number
  totalMonthlyLoad: number
  solarRecommendation: {
    systemSize: number
    batterySize: number
    inverterSize: number
  }
  sustainabilityRating: number
  suggestions: string[]
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
]

export function ApplianceProfiler() {
  const [appliances, setAppliances] = useState<Appliance[]>([])
  const [newAppliance, setNewAppliance] = useState({
    name: "",
    quantity: 1,
    hoursPerDay: 1,
    wattage: 0,
    location: "",
  })
  const [loadProfile, setLoadProfile] = useState<LoadProfile | null>(null)
  const [loading, setLoading] = useState(false)

  const addAppliance = () => {
    if (!newAppliance.name || !newAppliance.wattage) return

    const appliance: Appliance = {
      id: Date.now().toString(),
      ...newAppliance,
    }

    setAppliances([...appliances, appliance])
    setNewAppliance({
      name: "",
      quantity: 1,
      hoursPerDay: 1,
      wattage: 0,
      location: "",
    })
  }

  const removeAppliance = (id: string) => {
    setAppliances(appliances.filter((a) => a.id !== id))
  }

  const calculateLoadProfile = async () => {
    if (appliances.length === 0) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const totalDailyLoad = appliances.reduce((total, appliance) => {
      return total + (appliance.wattage * appliance.quantity * appliance.hoursPerDay) / 1000
    }, 0)

    const totalWeeklyLoad = totalDailyLoad * 7
    const totalMonthlyLoad = totalDailyLoad * 30

    // Solar system recommendations
    const systemSize = totalDailyLoad * 1.3 // 30% oversizing
    const batterySize = totalDailyLoad * 2 // 2 days backup
    const inverterSize = (Math.max(...appliances.map((a) => a.wattage * a.quantity)) * 1.2) / 1000

    // Sustainability rating (0-100)
    const avgWattagePerHour = totalDailyLoad / appliances.reduce((sum, a) => sum + a.hoursPerDay, 0)
    const sustainabilityRating = Math.max(0, 100 - avgWattagePerHour * 0.1)

    // AI suggestions
    const suggestions = [
      "Replace incandescent bulbs with LED bulbs to save up to 80% energy",
      "Use energy-efficient appliances with 5-star ratings",
      "Set air conditioner to 24°C instead of 18°C to save 30% energy",
      "Unplug devices when not in use to eliminate phantom loads",
      "Use natural lighting during daytime to reduce bulb usage",
    ]

    setLoadProfile({
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
    })

    setLoading(false)
  }

  const handleApplianceSelect = (applianceName: string) => {
    const selected = commonAppliances.find((a) => a.name === applianceName)
    if (selected) {
      setNewAppliance({
        ...newAppliance,
        name: selected.name,
        wattage: selected.wattage,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E2A38] flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-[#22C55E]" />
          Appliance Load Profiler
        </h1>
        <p className="text-gray-600">Analyze your appliance energy usage and get optimization tips</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Appliances */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Appliances</CardTitle>
              <CardDescription>Build your energy load profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Appliance Type</Label>
                <Select onValueChange={handleApplianceSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appliance" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonAppliances.map((appliance) => (
                      <SelectItem key={appliance.name} value={appliance.name}>
                        {appliance.name} ({appliance.wattage}W)
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Appliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Appliance Name</Label>
                <Input
                  placeholder="e.g., LED Bulb"
                  value={newAppliance.name}
                  onChange={(e) => setNewAppliance({ ...newAppliance, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newAppliance.quantity}
                    onChange={(e) =>
                      setNewAppliance({ ...newAppliance, quantity: Number.parseInt(e.target.value) || 1 })
                    }
                  />
                </div>
                <div>
                  <Label>Wattage (W)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newAppliance.wattage || ""}
                    onChange={(e) =>
                      setNewAppliance({ ...newAppliance, wattage: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Hours per Day</Label>
                <Input
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={newAppliance.hoursPerDay}
                  onChange={(e) =>
                    setNewAppliance({ ...newAppliance, hoursPerDay: Number.parseFloat(e.target.value) || 1 })
                  }
                />
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  placeholder="e.g., Living Room"
                  value={newAppliance.location}
                  onChange={(e) => setNewAppliance({ ...newAppliance, location: e.target.value })}
                />
              </div>

              <Button onClick={addAppliance} className="w-full bg-[#22C55E] hover:bg-[#16A34A]">
                <Plus className="h-4 w-4 mr-2" />
                Add Appliance
              </Button>
            </CardContent>
          </Card>

          {appliances.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Appliances ({appliances.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {appliances.map((appliance) => (
                    <div key={appliance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{appliance.name}</p>
                        <p className="text-sm text-gray-600">
                          {appliance.quantity}x • {appliance.wattage}W • {appliance.hoursPerDay}h/day
                        </p>
                        {appliance.location && <p className="text-xs text-gray-500">{appliance.location}</p>}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeAppliance(appliance.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={calculateLoadProfile}
                  className="w-full mt-4 bg-[#1E2A38] hover:bg-[#1E2A38]/90"
                  disabled={loading}
                >
                  {loading ? "Analyzing..." : "Calculate Load Profile"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        {loadProfile && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#22C55E]" />
                  Energy Load Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Daily</p>
                    <p className="text-lg font-bold text-blue-600">{loadProfile.totalDailyLoad.toFixed(1)} kWh</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Weekly</p>
                    <p className="text-lg font-bold text-purple-600">{loadProfile.totalWeeklyLoad.toFixed(1)} kWh</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Monthly</p>
                    <p className="text-lg font-bold text-orange-600">{loadProfile.totalMonthlyLoad.toFixed(1)} kWh</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Sustainability Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${loadProfile.sustainabilityRating}%` }}
                      />
                    </div>
                    <span className="font-bold text-green-600">{loadProfile.sustainabilityRating.toFixed(0)}/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="energy-card">
              <CardHeader>
                <CardTitle>Solar System Recommendation</CardTitle>
                <CardDescription>Recommended system for your load</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Solar Panels</p>
                    <p className="text-xl font-bold text-[#22C55E]">
                      {loadProfile.solarRecommendation.systemSize.toFixed(1)} kW
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Battery</p>
                    <p className="text-xl font-bold text-[#22C55E]">
                      {loadProfile.solarRecommendation.batterySize.toFixed(1)} kWh
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Inverter</p>
                    <p className="text-xl font-bold text-[#22C55E]">
                      {loadProfile.solarRecommendation.inverterSize.toFixed(1)} kW
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  AI Energy-Saving Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {loadProfile.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                      <Badge variant="secondary" className="mt-0.5 text-xs">
                        Tip {index + 1}
                      </Badge>
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
