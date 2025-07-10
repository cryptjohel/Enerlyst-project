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
import { Building, Users, Send, Copy, TrendingUp, Leaf, DollarSign, Zap, Award, UserPlus } from "lucide-react"
import { GroupDashboard } from "./group-dashboard"
import { ReportsPage } from "./reports-page"

type PageType = "overview" | "teams" | "invitations" | "reports"

export function OfficeDashboard() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState<PageType>("overview")

  const renderPage = () => {
    switch (currentPage) {
      case "teams":
        return <GroupDashboard />
      case "invitations":
        return <OfficeInvitationsPage />
      case "reports":
        return <ReportsPage />
      default:
        return <OfficeOverviewPage />
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
                <span className="font-medium">Office Dashboard</span>
              </div>
              <Badge variant="secondary" className="bg-[#22C55E]/10 text-[#22C55E] mb-1">
                {user?.companyName || user?.name}
              </Badge>
              {user?.inviteCode && (
                <div className="text-xs text-muted-foreground">
                  Team Code: <span className="font-mono font-medium">{user.inviteCode}</span>
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
                variant={currentPage === "teams" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("teams")}
              >
                <Users className="h-4 w-4 mr-2" />
                Team Management
              </Button>

              <Button
                variant={currentPage === "invitations" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentPage("invitations")}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Team Invitations
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

function OfficeOverviewPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Office Energy Dashboard</h1>
        <p className="text-muted-foreground">Monitor energy usage across your office building</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">42</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">₦850K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Office Efficiency</CardTitle>
            <Leaf className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">92/100</div>
            <p className="text-xs text-muted-foreground">Excellent performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
            <Zap className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">15.2 MWh</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Code Card */}
      <Card className="bg-[#22C55E]/5 border-[#22C55E]/20">
        <CardHeader>
          <CardTitle className="text-[#22C55E]">Team Invite Code</CardTitle>
          <CardDescription>Share this code with team members to join your office energy monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="bg-background px-3 py-2 rounded font-mono text-lg font-bold">{user?.inviteCode}</code>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(user?.inviteCode || "")
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
          <CardDescription>Manage your office energy efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 bg-[#22C55E] hover:bg-[#16A34A]">
              <Users className="h-5 w-5 mr-2" />
              Manage Teams
            </Button>
            <Button className="h-16 bg-[#1E2A38] hover:bg-[#1E2A38]/90">
              <UserPlus className="h-5 w-5 mr-2" />
              Invite Members
            </Button>
            <Button className="h-16 bg-blue-600 hover:bg-blue-700">
              <Award className="h-5 w-5 mr-2" />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OfficeInvitationsPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const { toast } = useToast()

  const sendInvitation = () => {
    if (!email || !department) {
      toast({
        title: "Missing information",
        description: "Please provide both email and department.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Invitation sent!",
      description: `Invitation sent to ${email} for ${department} department`,
    })
    setEmail("")
    setDepartment("")
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
        <h1 className="text-3xl font-bold text-foreground">Team Invitations</h1>
        <p className="text-muted-foreground">Invite team members to join your office energy monitoring</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Send Individual Invitation */}
        <Card>
          <CardHeader>
            <CardTitle>Send Team Invitation</CardTitle>
            <CardDescription>Invite a team member to join</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Team Member Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., IT, HR, Finance"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>

            <Button onClick={sendInvitation} className="w-full bg-[#22C55E] hover:bg-[#16A34A]">
              <Send className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </CardContent>
        </Card>

        {/* Share Team Code */}
        <Card>
          <CardHeader>
            <CardTitle>Share Team Code</CardTitle>
            <CardDescription>Let team members join using your office code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Office Team Code</Label>
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
                <strong>Instructions for team members:</strong>
                <br />
                1. Visit the Enerlyst website
                <br />
                2. Sign up for a new account
                <br />
                3. Enter the team code: <code className="font-mono font-bold">{user?.inviteCode}</code>
                <br />
                4. Start contributing to office energy monitoring
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Team Invitations</CardTitle>
          <CardDescription>Track invitation status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { email: "sarah.johnson@company.com", department: "IT", status: "accepted", sent: "1 week ago" },
              { email: "mike.chen@company.com", department: "Finance", status: "pending", sent: "3 days ago" },
              { email: "lisa.brown@company.com", department: "HR", status: "pending", sent: "2 days ago" },
              { email: "david.wilson@company.com", department: "Operations", status: "accepted", sent: "5 days ago" },
            ].map((invitation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{invitation.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {invitation.department} • Sent {invitation.sent}
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
