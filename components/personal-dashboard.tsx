"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "./navbar";
import { Zap, Calculator, BarChart3, Download, TrendingUp, Leaf, DollarSign, Home } from "lucide-react";
import { DieselCalculator } from "@/components/diesel-calculator"; // named export
import ApplianceProfiler from "@/components/appliance-profiler"; // ✅ default export
import ReportsPage from "@/components/reports-page"; // ✅ default export

type PageType = "overview" | "diesel" | "appliances" | "reports";

interface PersonalDashboardProps {
  userName: string;
}

export function PersonalDashboard({ userName }: PersonalDashboardProps) {
  const [currentPage, setCurrentPage] = useState<PageType>("overview");

  const renderPage = () => {
    switch (currentPage) {
      case "diesel":
        return <DieselCalculator />;
      case "appliances":
        return (
          <ApplianceProfiler
            onReportGenerated={(data: unknown) => {
              console.log("📊 Report generated:", data);
            }}
          />
        );
      case "reports":
        return <ReportsPage />;
      default:
        return <OverviewPage userName={userName} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => {}} />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 space-y-2">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-5 w-5 text-[#22C55E]" />
                <span className="font-medium">Personal Dashboard</span>
              </div>
              <Badge variant="secondary" className="bg-[#22C55E]/10 text-[#22C55E]">
                {userName}
              </Badge>
            </div>

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
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{renderPage()}</main>
        </div>
      </div>
    </div>
  );
}

// ✅ OverviewPage now accepts setCurrentPage so Quick Actions work
function OverviewPage({
  userName,
  setCurrentPage,
}: {
  userName: string;
  setCurrentPage: (page: PageType) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome, {userName} 👋</h1>
        <p className="text-muted-foreground">Monitor and optimize your home energy usage</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="energy-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">₦45,234</div>
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
            <div className="text-2xl font-bold text-[#22C55E]">1,456 kWh</div>
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
            <Button
              className="h-16 bg-[#22C55E] hover:bg-[#16A34A]"
              onClick={() => setCurrentPage("diesel")}
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculate Diesel Costs
            </Button>
            <Button
              className="h-16 bg-[#1E2A38] hover:bg-[#1E2A38]/90"
              onClick={() => setCurrentPage("appliances")}
            >
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
              { name: "Monthly Energy Report - December 2024", date: "2 days ago", savings: "₦15,234" },
              { name: "Diesel Usage Analysis", date: "1 week ago", savings: "₦8,456" },
              { name: "Appliance Load Profile", date: "2 weeks ago", savings: "₦3,123" },
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">{report.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#22C55E]">{report.savings}</p>
                  <p className="text-sm text-muted-foreground">saved</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
