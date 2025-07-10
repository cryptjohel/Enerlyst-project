"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "./navbar"
import { useAuth } from "./auth-provider"
import { Building, Users, Send, Copy, TrendingUp, Leaf, DollarSign, Award, AlertTriangle } from "lucide-react"
import { GroupDashboard } from "./group-dashboard"
import { ReportsPage } from "./reports-page"
// Import the new EstateAdminCalculator component
import { EstateAdminCalculator } from "./estate-admin-calculator"

type PageType = "overview" | "units" | "invitations" | "reports"

export function EstateDashboard() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState<PageType>("overview")
  const { toast } = useToast()

  const renderPage = () => {
    switch (currentPage) {
      case "units":
        return <GroupDashboard />
      case "invitations":
        return <InvitationsPage />
      case "reports":
        return <ReportsPage />
      default:
        return <EstateOverviewPage />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAuthClick={() => {}} />

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 space-y-2">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-5 w-5 text-[#22C55E]" />
                <span className="font-medium">Estate Dashboard</span>
              </div>
              <Badge variant="secondary" className="bg-[#22C55E]/10 text-[#22C55E] mb-1">
                {user?.companyName || user?.name}
              </Badge>
              {user?.inviteCode && (
                <div className="text-xs text-muted-foreground">
                  Invite Code: <span className="font-mono font-medium">{user.inviteCode}</span>
                </div>
              )}
            </div>

            <nav className="space-y-1">
              <Button
                variant={currentPage === "overview" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("overview")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Overview
              </Button>

              <Button
                variant={currentPage === "units" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("units")}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Units
              </Button>

              <Button
                variant={currentPage === "invitations" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("invitations")}
              >
                <Send className="h-4 w-4 mr-2" />
                Invitations
              </Button>

              <Button
                variant={currentPage === "reports" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("reports")}
              >
                <Award className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{renderPage()}</main>
        </div>
      </div>
    </div>
  )
}

function EstateOverviewPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Estate Management Dashboard</h1>
        <p className="text-muted-foreground">Monitor energy usage across your entire estate</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Building className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">24</div>
            <p className="text-xs text-muted-foreground">Active units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">₦1.2M</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Sustainability</CardTitle>
            <Leaf className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">78/100</div>
            <p className="text-xs text-muted-foreground">Estate average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">3</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Invite Code Card */}
      <Card className="bg-[#22C55E]/5 border-[#22C55E]/20">
        <CardHeader>
          <CardTitle className="text-[#22C55E]">Estate Invite Code</CardTitle>
          <CardDescription>Share this code with tenants to join your estate's energy monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="bg-background px-3 py-2 rounded font-mono text-lg font-bold">{user?.inviteCode}</code>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(user?.inviteCode || "")
                // toast notification would go here
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your estate efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 bg-[#22C55E] hover:bg-[#16A34A]">
              <Users className="h-5 w-5 mr-2" />
              Manage Units
            </Button>
            <Button className="h-16 bg-[#1E2A38] hover:bg-[#1E2A38]/90">
              <Send className="h-5 w-5 mr-2" />
              Send Invitations
            </Button>
            <Button className="h-16 bg-blue-600 hover:bg-blue-700">
              <Award className="h-5 w-5 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
      <EstateAdminCalculator />
    </div>
  )
}

function InvitationsPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState("")
  const [unitNumber, setUnitNumber] = useState("")
  const { toast } = useToast()

  const sendInvitation = () => {
    if (!email || !unitNumber) {
      toast({
        title: "Missing information",
        description: "Please provide both email and unit number.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Invitation sent!",
      description: `Invitation sent to ${email} for unit ${unitNumber}`,
    })
    setEmail("")
    setUnitNumber("")
  }

  const copyInviteLink = () => {
    const inviteLink = `https://enerlyst.com/join/${user?.inviteCode}`
    navigator.clipboard.writeText(inviteLink)
    toast({
      title: "Link copied!",
      description: "Invite link copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tenant Invitations</h1>
        <p className="text-muted-foreground">Invite tenants to join your estate's energy monitoring</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Send Individual Invitation */}
        <Card>
          <CardHeader>
            <CardTitle>Send Individual Invitation</CardTitle>
            <CardDescription>Invite a specific tenant to join</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Tenant Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tenant@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="unit">Unit Number</Label>
              <Input
                id="unit"
                placeholder="e.g., A1, B2, 101"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
              />
            </div>

            <Button onClick={sendInvitation} className="w-full bg-[#22C55E] hover:bg-[#16A34A]">
              <Send className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </CardContent>
        </Card>

        {/* Share Invite Code */}
        <Card>
          <CardHeader>
            <CardTitle>Share Invite Code</CardTitle>
            <CardDescription>Let tenants join using your estate code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Estate Invite Code</Label>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-3 py-2 rounded font-mono text-lg font-bold flex-1">
                  {user?.inviteCode}
                </code>
                <Button variant="outline" size="icon" onClick={copyInviteLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Invite Link</Label>
              <div className="flex items-center gap-2">
                <Input value={`https://enerlyst.com/join/${user?.inviteCode}`} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={copyInviteLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Instructions for tenants:</strong>
                <br />
                1. Visit the Enerlyst website
                <br />
                2. Sign up for a new account
                <br />
                3. Enter the invite code: <code className="font-mono font-bold">{user?.inviteCode}</code>
                <br />
                4. Start tracking their energy usage
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Track invitation status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { email: "john.doe@email.com", unit: "A1", status: "pending", sent: "2 days ago" },
              { email: "jane.smith@email.com", unit: "B2", status: "accepted", sent: "1 week ago" },
              { email: "mike.wilson@email.com", unit: "C3", status: "pending", sent: "3 days ago" },
            ].map((invitation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{invitation.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Unit {invitation.unit} • Sent {invitation.sent}
                  </p>
                </div>
                <Badge
                  variant={invitation.status === "accepted" ? "default" : "secondary"}
                  className={invitation.status === "accepted" ? "bg-[#22C55E]" : ""}
                >
                  {invitation.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
