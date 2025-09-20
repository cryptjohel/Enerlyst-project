"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "./navbar"
import { Users, Send, Copy, TrendingUp, Leaf, DollarSign, Zap, Award, UserPlus, Building } from "lucide-react"
import { GroupDashboard } from "./group-dashboard"
import { ReportsPage } from "./reports-page"

type PageType = "overview" | "teams" | "invitations" | "reports"

interface OfficeDashboardProps {
  userName: string
  companyName?: string
  inviteCode?: string
}

export function OfficeDashboard({ userName, companyName, inviteCode }: OfficeDashboardProps) {
  const [currentPage, setCurrentPage] = useState<PageType>("overview")

  const renderPage = () => {
    switch (currentPage) {
      case "teams":
        return <GroupDashboard />
      case "invitations":
        return <OfficeInvitationsPage inviteCode={inviteCode} />
      case "reports":
        return <ReportsPage />
      default:
        return <OfficeOverviewPage userName={userName} companyName={companyName} inviteCode={inviteCode} />
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
                {companyName || userName}
              </Badge>
              {inviteCode && (
                <div className="text-xs text-muted-foreground">
                  Team Code: <span className="font-mono font-medium">{inviteCode}</span>
                </div>
              )}
            </div>

            <nav className="space-y-1">
              <Button variant={currentPage === "overview" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setCurrentPage("overview")}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Overview
              </Button>

              <Button variant={currentPage === "teams" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setCurrentPage("teams")}>
                <Users className="h-4 w-4 mr-2" />
                Team Management
              </Button>

              <Button variant={currentPage === "invitations" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setCurrentPage("invitations")}>
                <UserPlus className="h-4 w-4 mr-2" />
                Team Invitations
              </Button>

              <Button variant={currentPage === "reports" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setCurrentPage("reports")}>
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

function OfficeOverviewPage({ userName, companyName, inviteCode }: { userName: string; companyName?: string; inviteCode?: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Office Energy Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {companyName || userName}. Monitor your office’s energy usage.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">42</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">₦850K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Leaf className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">92/100</div>
            <p className="text-xs text-muted-foreground">Great performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
            <Zap className="h-4 w-4 text-[#22C55E]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">15.2 MWh</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Code */}
      {inviteCode && (
        <Card className="bg-[#22C55E]/5 border-[#22C55E]/20">
          <CardHeader>
            <CardTitle className="text-[#22C55E]">Team Invite Code</CardTitle>
            <CardDescription>Share with teammates to join your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="bg-background px-3 py-2 rounded font-mono text-lg font-bold">{inviteCode}</code>
              <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(inviteCode)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function OfficeInvitationsPage({ inviteCode }: { inviteCode?: string }) {
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const { toast } = useToast()

  const sendInvitation = () => {
    if (!email || !department) {
      toast({
        title: "Missing fields",
        description: "Fill both fields before sending invitation.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Invitation sent!",
      description: `Sent to ${email} - Dept: ${department}`,
    })
    setEmail("")
    setDepartment("")
  }

  const copyInviteLink = () => {
    if (!inviteCode) return
    navigator.clipboard.writeText(`https://enerlyst.com/join/${inviteCode}`)
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Team Invitations</h1>
        <p className="text-muted-foreground">Send or share team invite link</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Invite</CardTitle>
            <CardDescription>Invite a team member</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teammate@company.com" />

            <Label>Department</Label>
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="IT, Finance, etc." />

            <Button onClick={sendInvitation} className="w-full bg-[#22C55E] hover:bg-[#16A34A]">
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invite Link</CardTitle>
            <CardDescription>Share with others</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input value={`https://enerlyst.com/join/${inviteCode || ""}`} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={copyInviteLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
