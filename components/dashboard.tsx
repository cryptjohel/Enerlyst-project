"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "./auth-provider"
import {
  Zap,
  LogOut,
  Calculator,
  BarChart3,
  Users,
  Download,
  TrendingUp,
  Leaf,
  DollarSign,
  Home,
  Building,
  Factory,
} from "lucide-react"
import { DieselCalculator } from "./diesel-calculator"
import { ApplianceProfiler } from "./appliance-profiler"
import { ReportsPage } from "./reports-page"
import { GroupDashboard } from "./group-dashboard"

type PageType = "overview" | "diesel" | "appliances" | "reports" | "group"

export function Dashboard() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<PageType>("overview")
  const [userMode, setUserMode] = useState<"personal" | "estate" | "office" | "factory">("personal")

  const renderPage = () => {
    switch (currentPage) {
      case "diesel":
        return <DieselCalculator />
      case "appliances":
        return <ApplianceProfiler />
      case "reports":
        return <ReportsPage />
      case "group":
        return <GroupDashboard />
      default:
        return <OverviewPage userMode={userMode} setUserMode={setUserMode} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-[#22C55E]" />
                <span className="text-2xl font-bold text-[#1E2A38]">Enerlyst</span>
              </div>
              <Badge variant="secondary" className="bg-[#22C55E]/10 text-[#22C55E]">
                {userMode.charAt(0).toUpperCase() + userMode.slice(1)} Mode
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 space-y-2">
            <nav className="space-y-1">
              <Button
                variant={currentPage === "overview" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("overview")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </Button>

              <Button
                variant={currentPage === "diesel" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("diesel")}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Diesel Calculator
              </Button>

              <Button
                variant={currentPage === "appliances" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("appliances")}
              >
                <Zap className="h-4 w-4 mr-2" />
                Appliance Profiler
              </Button>

              <Button
                variant={currentPage === "reports" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("reports")}
              >
                <Download className="h-4 w-4 mr-2" />
                Reports
              </Button>

              {userMode !== "personal" && (
                <Button
                  variant={currentPage === "group" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentPage("group")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Group Dashboard
                </Button>
              )}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{renderPage()}</main>
        </div>
      </div>
    </div>
  )
}

function OverviewPage({
  userMode,
  setUserMode,
}: {
  userMode: string
  setUserMode: (mode: "personal" | "estate" | "office" | "factory") => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1E2A38]">Energy Dashboard</h1>
        <p className="text-gray-600">Monitor and optimize your energy usage</p>
      </div>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Your Mode</CardTitle>
          <CardDescription>Choose how you want to use Enerlyst</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { mode: "personal", icon: Home, label: "Personal", desc: "Homeowner" },
              { mode: "estate", icon: Building, label: "Estate", desc: "Property Manager" },
              { mode: "office", icon: Building, label: "Office", desc: "Office Building" },
              { mode: "factory", icon: Factory, label: "Factory", desc: "Industrial" },
            ].map(({ mode, icon: Icon, label, desc }) => (
              <Button
                key={mode}
                variant={userMode === mode ? "default" : "outline"}
                className="h-20 flex-col space-y-2"
                onClick={() => setUserMode(mode as any)}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs opacity-70">{desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="energy-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">$1,234</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="energy-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sustainability Score</CardTitle>
            <Leaf className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">85/100</div>
            <p className="text-xs text-muted-foreground">Excellent energy efficiency</p>
          </CardContent>
        </Card>

        <Card className="energy-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
            <Zap className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">2,456 kWh</div>
            <p className="text-xs text-muted-foreground">This month's consumption</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with energy optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-16 bg-[#22C55E] hover:bg-[#16A34A]">
              <Calculator className="h-5 w-5 mr-2" />
              Calculate Diesel Costs
            </Button>
            <Button className="h-16 bg-[#1E2A38] hover:bg-[#1E2A38]/90">
              <BarChart3 className="h-5 w-5 mr-2" />
              Profile Appliances
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Your latest energy analysis reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Monthly Energy Report - December 2024", date: "2 days ago", savings: "$234" },
              { name: "Diesel Usage Analysis", date: "1 week ago", savings: "$456" },
              { name: "Appliance Load Profile", date: "2 weeks ago", savings: "$123" },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-gray-600">{report.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#22C55E]">{report.savings}</p>
                  <p className="text-sm text-gray-600">saved</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
