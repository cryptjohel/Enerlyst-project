"use client";
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Users, Target, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => {}} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">About Enerlyst</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionizing energy management through AI-powered insights and sustainable solutions
            </p>
          </div>

          {/* Company Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-[#22C55E]" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Enerlyst is a cutting-edge PropTech platform that combines artificial intelligence with clean energy
                solutions to help homeowners, property managers, and estate administrators optimize their energy
                consumption and reduce costs.
              </p>
              <p className="text-muted-foreground">
                Built by <strong>Pelagus Real Estate and Energy Solutions</strong>, we're committed to making
                sustainable energy accessible and affordable for everyone. Our platform provides intelligent insights,
                solar recommendations, and behavior change suggestions to eliminate energy waste.
              </p>
            </CardContent>
          </Card>

          {/* Founder */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-[#22C55E]" />
                Leadership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  JN
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Joel Nkemjieme</h3>
                  <p className="text-[#22C55E] font-medium">Founder & CEO</p>
                  <p className="text-muted-foreground mt-2">
                    Visionary leader in PropTech and CleanTech, dedicated to transforming how we think about energy
                    consumption and sustainability in real estate.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#22C55E]" />
                  What We Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• AI-powered energy analysis and optimization</li>
                  <li>• Diesel consumption tracking and solar recommendations</li>
                  <li>• Appliance load profiling and efficiency insights</li>
                  <li>• Group management for estates and office buildings</li>
                  <li>• Comprehensive energy reports and analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[#22C55E]" />
                  Our Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Reduce energy costs by up to 70%</li>
                  <li>• Lower carbon footprint significantly</li>
                  <li>• Optimize solar system investments</li>
                  <li>• Enable data-driven energy decisions</li>
                  <li>• Promote sustainable living practices</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
              <CardDescription>The principles that guide everything we do</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-[#22C55E]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">
                    Leveraging cutting-edge AI and technology to solve energy challenges
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-[#22C55E]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Accessibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Making sustainable energy solutions accessible to everyone
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-[#22C55E]" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Creating meaningful change in energy consumption and sustainability
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
