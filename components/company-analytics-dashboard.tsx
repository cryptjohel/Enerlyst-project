"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  TrendingUp,
  Zap,
  Building,
  DollarSign,
  Globe,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
} from "lucide-react"

interface UserMetrics {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  userTypes: {
    personal: number
    estate: number
    office: number
    factory: number
  }
}

interface EnergyMetrics {
  totalEnergyTracked: number
  totalSavingsGenerated: number
  avgEfficiencyScore: number
  topAppliancesByUsage: Array<{
    name: string
    totalUsage: number
    userCount: number
    trend: "up" | "down" | "stable"
  }>
}

interface GridData {
  peakDemandHours: string[]
  loadDistribution: Array<{
    region: string
    load: number
    efficiency: number
  }>
  demandForecast: Array<{
    date: string
    predictedDemand: number
    actualDemand?: number
  }>
}

interface InvestorMetrics {
  monthlyRevenue: number
  userGrowthRate: number
  marketPenetration: number
  customerAcquisitionCost: number
  lifetimeValue: number
}

export function CompanyAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d")
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    totalUsers: 15420,
    activeUsers: 12340,
    newUsersThisMonth: 1250,
    userTypes: {
      personal: 8500,
      estate: 4200,
      office: 2100,
      factory: 620,
    },
  })

  const [energyMetrics, setEnergyMetrics] = useState<EnergyMetrics>({
    totalEnergyTracked: 2450000, // kWh
    totalSavingsGenerated: 850000000, // Naira
    avgEfficiencyScore: 78,
    topAppliancesByUsage: [
      { name: "Air Conditioner", totalUsage: 890000, userCount: 8500, trend: "up" },
      { name: "Refrigerator", totalUsage: 650000, userCount: 12000, trend: "stable" },
      { name: "LED Lighting", totalUsage: 320000, userCount: 14500, trend: "down" },
      { name: "Ceiling Fan", totalUsage: 280000, userCount: 9800, trend: "up" },
      { name: "Television", totalUsage: 240000, userCount: 11200, trend: "stable" },
    ],
  })

  const [gridData, setGridData] = useState<GridData>({
    peakDemandHours: ["18:00-20:00", "06:00-08:00"],
    loadDistribution: [
      { region: "Lagos", load: 850000, efficiency: 82 },
      { region: "Abuja", load: 420000, efficiency: 78 },
      { region: "Port Harcourt", load: 320000, efficiency: 75 },
      { region: "Kano", load: 280000, efficiency: 71 },
    ],
    demandForecast: [],
  })

  const [investorMetrics, setInvestorMetrics] = useState<InvestorMetrics>({
    monthlyRevenue: 45000000, // Naira
    userGrowthRate: 15.2, // %
    marketPenetration: 2.8, // %
    customerAcquisitionCost: 2500, // Naira
    lifetimeValue: 85000, // Naira
  })

  const refreshData = () => {
    // Simulate data refresh
    setUserMetrics((prev) => ({
      ...prev,
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 100),
    }))
  }

  const exportReport = () => {
    // TODO: Generate comprehensive analytics report
    console.log("Exporting analytics report...")
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <BarChart3 className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enerlyst Analytics Dashboard</h1>
          <p className="text-muted-foreground">Company-wide insights and business intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportReport} className="bg-[#22C55E] hover:bg-[#16A34A]">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">{userMetrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />+{userMetrics.newUsersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Globe className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">{userMetrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((userMetrics.activeUsers / userMetrics.totalUsers) * 100).toFixed(1)}% engagement rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Tracked</CardTitle>
            <Zap className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">
              {(energyMetrics.totalEnergyTracked / 1000000).toFixed(1)}M kWh
            </div>
            <p className="text-xs text-muted-foreground">Total energy monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">
              ₦{(energyMetrics.totalSavingsGenerated / 1000000).toFixed(0)}M
            </div>
            <p className="text-xs text-muted-foreground">Generated for users</p>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Type Distribution</CardTitle>
            <CardDescription>Breakdown of user categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(userMetrics.userTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-[#22C55E]" />
                    <span className="capitalize">{type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(count / userMetrics.totalUsers) * 100} className="w-20" />
                    <span className="text-sm font-medium">{count.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Appliances by Usage</CardTitle>
            <CardDescription>Most energy-consuming appliances across all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {energyMetrics.topAppliancesByUsage.map((appliance, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(appliance.trend)}
                    <div>
                      <p className="font-medium">{appliance.name}</p>
                      <p className="text-sm text-muted-foreground">{appliance.userCount.toLocaleString()} users</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(appliance.totalUsage / 1000).toFixed(0)}k kWh</p>
                    <Badge variant="secondary" className="text-xs">
                      {appliance.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Management Data */}
      <Card>
        <CardHeader>
          <CardTitle>Grid Management Insights</CardTitle>
          <CardDescription>Data for utility companies and grid optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Peak Demand Hours</h4>
              <div className="space-y-2">
                {gridData.peakDemandHours.map((hour, index) => (
                  <Badge key={index} variant="secondary" className="mr-2">
                    {hour}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Regional Load Distribution</h4>
              <div className="space-y-2">
                {gridData.loadDistribution.map((region, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{region.region}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{(region.load / 1000).toFixed(0)}k kWh</span>
                      <Badge variant={region.efficiency > 80 ? "default" : "secondary"}>
                        {region.efficiency}% eff.
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investor Metrics */}
      <Card className="bg-gradient-to-r from-[#22C55E]/10 to-blue-500/10">
        <CardHeader>
          <CardTitle className="text-[#22C55E]">Investor Dashboard</CardTitle>
          <CardDescription>Key business metrics and growth indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold text-[#22C55E]">
                ₦{(investorMetrics.monthlyRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">User Growth Rate</p>
              <p className="text-2xl font-bold text-[#22C55E]">{investorMetrics.userGrowthRate}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Market Penetration</p>
              <p className="text-2xl font-bold text-[#22C55E]">{investorMetrics.marketPenetration}%</p>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Customer Acquisition Cost</p>
              <p className="text-xl font-bold">₦{investorMetrics.customerAcquisitionCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Customer Lifetime Value</p>
              <p className="text-xl font-bold">₦{investorMetrics.lifetimeValue.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-[#22C55E]" />
            AI Business Intelligence Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Growth Insights</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                User growth is accelerating with 15.2% monthly increase. Estate managers show highest engagement rates
                at 89%, indicating strong product-market fit in the property management sector.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Energy Trends</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Air conditioner usage is trending up 23% as we enter peak season. Recommend promoting energy-efficient
                AC models and smart scheduling features to maximize user savings.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Market Opportunities</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Lagos region shows 82% efficiency but highest demand. Consider partnerships with solar installers and
                utility companies for grid optimization services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
