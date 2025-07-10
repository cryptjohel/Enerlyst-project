"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, Award, AlertTriangle, Building, Zap } from "lucide-react"

interface Unit {
  id: string
  name: string
  tenant: string
  monthlyUsage: number
  sustainabilityScore: number
  lastReading: string
  status: "good" | "warning" | "poor"
}

export function GroupDashboard() {
  const [units] = useState<Unit[]>([
    {
      id: "1",
      name: "Unit A1",
      tenant: "John Smith",
      monthlyUsage: 450,
      sustainabilityScore: 85,
      lastReading: "2 hours ago",
      status: "good",
    },
    {
      id: "2",
      name: "Unit A2",
      tenant: "Sarah Johnson",
      monthlyUsage: 320,
      sustainabilityScore: 92,
      lastReading: "1 hour ago",
      status: "good",
    },
    {
      id: "3",
      name: "Unit B1",
      tenant: "Mike Wilson",
      monthlyUsage: 680,
      sustainabilityScore: 65,
      lastReading: "30 mins ago",
      status: "warning",
    },
    {
      id: "4",
      name: "Unit B2",
      tenant: "Lisa Brown",
      monthlyUsage: 890,
      sustainabilityScore: 45,
      lastReading: "5 hours ago",
      status: "poor",
    },
  ])

  const totalUsage = units.reduce((sum, unit) => sum + unit.monthlyUsage, 0)
  const avgSustainabilityScore = Math.round(
    units.reduce((sum, unit) => sum + unit.sustainabilityScore, 0) / units.length,
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const sendAlert = (unitId: string) => {
    // TODO: Implement alert sending logic
    console.log(`Sending alert to unit ${unitId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E2A38] flex items-center gap-2">
          <Users className="h-8 w-8 text-[#22C55E]" />
          Group Dashboard
        </h1>
        <p className="text-gray-600">Manage energy usage across your estate or building</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Building className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">{units.length}</div>
            <p className="text-xs text-muted-foreground">Active units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Zap className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">{totalUsage.toLocaleString()} kWh</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Sustainability</CardTitle>
            <Award className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">{avgSustainabilityScore}/100</div>
            <p className="text-xs text-muted-foreground">Estate average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {units.filter((u) => u.status === "warning" || u.status === "poor").length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#22C55E]" />
            Sustainability Leaderboard
          </CardTitle>
          <CardDescription>Most energy-efficient tenants this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {units
              .sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)
              .map((unit, index) => (
                <div key={unit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#22C55E] text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{unit.name}</p>
                      <p className="text-sm text-gray-600">{unit.tenant}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#22C55E]">{unit.sustainabilityScore}/100</p>
                    <p className="text-sm text-gray-600">{unit.monthlyUsage} kWh</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Unit Management */}
      <Card>
        <CardHeader>
          <CardTitle>Unit Management</CardTitle>
          <CardDescription>Monitor and manage individual units</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {units.map((unit) => (
              <div key={unit.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{unit.name}</h3>
                    <p className="text-sm text-gray-600">{unit.tenant}</p>
                  </div>
                  <Badge className={getStatusColor(unit.status)}>{unit.status}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Monthly Usage</p>
                    <p className="font-medium">{unit.monthlyUsage} kWh</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sustainability</p>
                    <p className="font-medium">{unit.sustainabilityScore}/100</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Reading</p>
                    <p className="font-medium">{unit.lastReading}</p>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendAlert(unit.id)}
                      disabled={unit.status === "good"}
                    >
                      Send Alert
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Sustainability Score</span>
                    <span>{unit.sustainabilityScore}%</span>
                  </div>
                  <Progress value={unit.sustainabilityScore} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
