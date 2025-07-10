"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "./navbar"
import { useAuth } from "./auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Zap, Home, Building, Factory, Calculator, BarChart3, Users, Download, CheckCircle } from "lucide-react"

export function LandingPage() {
  const [showAuth, setShowAuth] = useState<"login" | "signup" | null>(null)
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    name: "",
    userType: "" as "personal" | "estate" | "office" | "factory" | "",
    companyName: "",
  })
  const { login, signup } = useAuth()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(authData.email, authData.password)
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to Enerlyst.",
      })
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authData.userType) {
      toast({
        title: "Please select user type",
        description: "Choose how you plan to use Enerlyst.",
        variant: "destructive",
      })
      return
    }

    try {
      await signup(authData.email, authData.password, authData.name, authData.userType, authData.companyName)
      toast({
        title: "Welcome to Enerlyst!",
        description: "Your account has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please try again with different credentials.",
        variant: "destructive",
      })
    }
  }

  const handleAuthClick = (type: "login" | "signup") => {
    setShowAuth(type)
  }

  if (showAuth) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onAuthClick={handleAuthClick} />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{showAuth === "login" ? "Welcome Back" : "Create Account"}</CardTitle>
                <CardDescription>
                  {showAuth === "login"
                    ? "Sign in to your Enerlyst account"
                    : "Join thousands optimizing their energy usage"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={showAuth === "login" ? handleLogin : handleSignup} className="space-y-4">
                  {showAuth === "signup" && (
                    <>
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          value={authData.name}
                          onChange={(e) => setAuthData((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="userType">Account Type</Label>
                        <Select onValueChange={(value) => setAuthData((prev) => ({ ...prev, userType: value as any }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">
                              <div className="flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Personal - Homeowner
                              </div>
                            </SelectItem>
                            <SelectItem value="estate">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Estate - Property Manager
                              </div>
                            </SelectItem>
                            <SelectItem value="office">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Office - Building Manager
                              </div>
                            </SelectItem>
                            <SelectItem value="factory">
                              <div className="flex items-center gap-2">
                                <Factory className="h-4 w-4" />
                                Factory - Industrial
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {(authData.userType === "estate" ||
                        authData.userType === "office" ||
                        authData.userType === "factory") && (
                        <div>
                          <Label htmlFor="companyName">Company/Estate Name</Label>
                          <Input
                            id="companyName"
                            type="text"
                            value={authData.companyName}
                            onChange={(e) => setAuthData((prev) => ({ ...prev, companyName: e.target.value }))}
                            required
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={authData.email}
                      onChange={(e) => setAuthData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={authData.password}
                      onChange={(e) => setAuthData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#22C55E] hover:bg-[#16A34A]">
                    {showAuth === "login" ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Button variant="link" onClick={() => setShowAuth(showAuth === "login" ? "signup" : "login")}>
                    {showAuth === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={handleAuthClick} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/10 to-[#1E2A38]/5" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-foreground mb-6">AI-Powered Energy Optimization</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Monitor, analyze, and reduce energy costs with intelligent insights. Perfect for homeowners, property
              managers, and estate administrators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#22C55E] hover:bg-[#16A34A]" onClick={() => setShowAuth("signup")}>
                Get Started Free
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Powerful Features for Every User Type</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're a homeowner or managing multiple properties, Enerlyst has the tools you need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Calculator className="h-8 w-8 text-[#22C55E] mx-auto" />
                <CardTitle>Diesel Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Calculate diesel consumption and costs with AI-powered solar recommendations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-[#22C55E] mx-auto" />
                <CardTitle>Load Profiler</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analyze appliance energy usage and get personalized optimization tips
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-8 w-8 text-[#22C55E] mx-auto" />
                <CardTitle>Group Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage multiple units with admin dashboards and tenant leaderboards
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Download className="h-8 w-8 text-[#22C55E] mx-auto" />
                <CardTitle>Smart Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate detailed PDF reports with AI insights and improvement plans
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Built for Every Energy User</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Home className="h-8 w-8 text-[#22C55E]" />
                <CardTitle>Personal Users</CardTitle>
                <CardDescription>Homeowners optimizing energy usage</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Personal energy dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Appliance optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Solar recommendations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Building className="h-8 w-8 text-[#22C55E]" />
                <CardTitle>Estate Managers</CardTitle>
                <CardDescription>Property managers overseeing multiple units</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Multi-unit management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Tenant invitations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Aggregate analytics
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Factory className="h-8 w-8 text-[#22C55E]" />
                <CardTitle>Commercial Users</CardTitle>
                <CardDescription>Offices and industrial facilities</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Enterprise dashboards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#22C55E]" />
                    Advanced analytics
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#22C55E]/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Optimize Your Energy Usage?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already saving money and reducing their carbon footprint
          </p>
          <Button size="lg" className="bg-[#22C55E] hover:bg-[#16A34A]" onClick={() => setShowAuth("signup")}>
            Start Your Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Zap className="h-6 w-6 text-[#22C55E]" />
              <span className="text-lg font-bold text-foreground">Enerlyst</span>
            </div>
            <p className="text-muted-foreground mb-2">
              Built by <strong>Pelagus Real Estate and Energy Solutions</strong>
            </p>
            <p className="text-sm text-muted-foreground">Founded by Joel Nkemjieme • © 2024 All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
