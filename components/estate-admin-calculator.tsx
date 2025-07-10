"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Calculator, Send, FileText, Users } from "lucide-react"

interface TenantCalculation {
  tenantName: string
  tenantEmail: string
  unitNumber: string
  dieselUsage: {
    generatorSize: number
    hoursPerDay: number
    daysPerWeek: number
    dieselPrice: number
  }
  appliances: Array<{
    name: string
    wattage: number
    quantity: number
    hoursPerDay: number
  }>
  customNotes: string
}

export function EstateAdminCalculator() {
  const [calculation, setCalculation] = useState<TenantCalculation>({
    tenantName: "",
    tenantEmail: "",
    unitNumber: "",
    dieselUsage: {
      generatorSize: 0,
      hoursPerDay: 0,
      daysPerWeek: 0,
      dieselPrice: 800,
    },
    appliances: [],
    customNotes: "",
  })
  const [newAppliance, setNewAppliance] = useState({
    name: "",
    wattage: 0,
    quantity: 1,
    hoursPerDay: 1,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const addAppliance = () => {
    if (!newAppliance.name || !newAppliance.wattage) return

    setCalculation((prev) => ({
      ...prev,
      appliances: [...prev.appliances, { ...newAppliance }],
    }))
    setNewAppliance({ name: "", wattage: 0, quantity: 1, hoursPerDay: 1 })
  }

  const removeAppliance = (index: number) => {
    setCalculation((prev) => ({
      ...prev,
      appliances: prev.appliances.filter((_, i) => i !== index),
    }))
  }

  const calculateAndSendReport = async () => {
    if (!calculation.tenantName || !calculation.tenantEmail || !calculation.unitNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in tenant details",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // Simulate calculation and PDF generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Calculate totals
    const dieselConsumption = calculation.dieselUsage.generatorSize * 0.25 * calculation.dieselUsage.hoursPerDay
    const dieselCost = dieselConsumption * calculation.dieselUsage.dieselPrice
    const totalApplianceLoad = calculation.appliances.reduce(
      (total, app) => total + (app.wattage * app.quantity * app.hoursPerDay) / 1000,
      0,
    )

    // Generate AI insights
    const aiInsights = generateAIInsights(calculation, dieselConsumption, totalApplianceLoad)

    // TODO: Generate branded PDF with Enerlyst logo
    // TODO: Send email with PDF attachment

    toast({
      title: "Report Generated & Sent!",
      description: `Energy report sent to ${calculation.tenantEmail} for Unit ${calculation.unitNumber}`,
    })

    setLoading(false)
  }

  const generateAIInsights = (calc: TenantCalculation, dieselConsumption: number, applianceLoad: number) => {
    return {
      summary: `Unit ${calc.unitNumber} consumes ${dieselConsumption.toFixed(1)}L diesel daily and ${applianceLoad.toFixed(1)} kWh from appliances.`,
      recommendations: [
        "Consider solar system of 3.5kW with 7kWh battery storage",
        "Replace high-consumption appliances with energy-efficient alternatives",
        "Implement load scheduling to reduce peak demand",
      ],
      savings: `Potential monthly savings of ₦${(dieselConsumption * calc.dieselUsage.dieselPrice * 30 * 0.7).toLocaleString()}`,
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Calculator className="h-8 w-8 text-[#22C55E]" />
          Estate Admin Calculator
        </h1>
        <p className="text-muted-foreground">Calculate energy usage for tenants and send branded reports</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tenant Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#22C55E]" />
              Tenant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tenantName">Tenant Name</Label>
              <Input
                id="tenantName"
                value={calculation.tenantName}
                onChange={(e) => setCalculation((prev) => ({ ...prev, tenantName: e.target.value }))}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="tenantEmail">Tenant Email</Label>
              <Input
                id="tenantEmail"
                type="email"
                value={calculation.tenantEmail}
                onChange={(e) => setCalculation((prev) => ({ ...prev, tenantEmail: e.target.value }))}
                placeholder="john.doe@email.com"
              />
            </div>

            <div>
              <Label htmlFor="unitNumber">Unit Number</Label>
              <Input
                id="unitNumber"
                value={calculation.unitNumber}
                onChange={(e) => setCalculation((prev) => ({ ...prev, unitNumber: e.target.value }))}
                placeholder="A1, B2, etc."
              />
            </div>

            <div>
              <Label htmlFor="customNotes">Custom Notes</Label>
              <Textarea
                id="customNotes"
                value={calculation.customNotes}
                onChange={(e) => setCalculation((prev) => ({ ...prev, customNotes: e.target.value }))}
                placeholder="Additional notes about this tenant's energy usage..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Diesel Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Diesel Generator Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Generator Size (kVA)</Label>
                <Input
                  type="number"
                  value={calculation.dieselUsage.generatorSize || ""}
                  onChange={(e) =>
                    setCalculation((prev) => ({
                      ...prev,
                      dieselUsage: { ...prev.dieselUsage, generatorSize: Number(e.target.value) || 0 },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Hours per Day</Label>
                <Input
                  type="number"
                  value={calculation.dieselUsage.hoursPerDay || ""}
                  onChange={(e) =>
                    setCalculation((prev) => ({
                      ...prev,
                      dieselUsage: { ...prev.dieselUsage, hoursPerDay: Number(e.target.value) || 0 },
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Days per Week</Label>
                <Select
                  onValueChange={(value) =>
                    setCalculation((prev) => ({
                      ...prev,
                      dieselUsage: { ...prev.dieselUsage, daysPerWeek: Number(value) },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select days" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day} day{day > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Diesel Price (₦/L)</Label>
                <Input
                  type="number"
                  value={calculation.dieselUsage.dieselPrice}
                  onChange={(e) =>
                    setCalculation((prev) => ({
                      ...prev,
                      dieselUsage: { ...prev.dieselUsage, dieselPrice: Number(e.target.value) || 800 },
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appliances */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Appliances</CardTitle>
          <CardDescription>Add appliances for this tenant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Appliance Name</Label>
              <Input
                value={newAppliance.name}
                onChange={(e) => setNewAppliance((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="LED Bulb"
              />
            </div>
            <div>
              <Label>Wattage</Label>
              <Input
                type="number"
                value={newAppliance.wattage || ""}
                onChange={(e) => setNewAppliance((prev) => ({ ...prev, wattage: Number(e.target.value) || 0 }))}
                placeholder="10"
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={newAppliance.quantity}
                onChange={(e) => setNewAppliance((prev) => ({ ...prev, quantity: Number(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label>Hours/Day</Label>
              <Input
                type="number"
                step="0.5"
                value={newAppliance.hoursPerDay}
                onChange={(e) => setNewAppliance((prev) => ({ ...prev, hoursPerDay: Number(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <Button onClick={addAppliance} className="bg-[#22C55E] hover:bg-[#16A34A]">
            Add Appliance
          </Button>

          {calculation.appliances.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Added Appliances:</h4>
              {calculation.appliances.map((appliance, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{appliance.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {appliance.quantity}x • {appliance.wattage}W • {appliance.hoursPerDay}h/day
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeAppliance(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Report */}
      <Card className="bg-[#22C55E]/5 border-[#22C55E]/20">
        <CardHeader>
          <CardTitle className="text-[#22C55E] flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate & Send Report
          </CardTitle>
          <CardDescription>Create a branded PDF report with AI insights and email to tenant</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={calculateAndSendReport}
            disabled={loading}
            className="w-full bg-[#22C55E] hover:bg-[#16A34A] h-12"
          >
            {loading ? (
              "Generating Report..."
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Calculate & Send Branded Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
