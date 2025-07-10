"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, Send } from "lucide-react"

interface Report {
  id: string
  title: string
  date: string
  type: "diesel" | "appliance" | "comprehensive"
  savings: string
  carbon: string
}

export function ReportsPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")

  const reports: Report[] = [
    {
      id: "1",
      title: "Monthly Energy Report – Dec 2024",
      date: "15 Dec 2024",
      type: "comprehensive",
      savings: "₦45,000",
      carbon: "120 kg CO₂",
    },
    {
      id: "2",
      title: "Diesel Usage Analysis",
      date: "10 Dec 2024",
      type: "diesel",
      savings: "₦28,000",
      carbon: "75 kg CO₂",
    },
    {
      id: "3",
      title: "Appliance Load Profile",
      date: "05 Dec 2024",
      type: "appliance",
      savings: "₦15,000",
      carbon: "40 kg CO₂",
    },
  ]

  /* ----------------- helpers ----------------- */
  const handleDownload = (report: Report) => {
    toast({
      title: "Download started",
      description: `Downloading “${report.title}”...`,
    })
    // TODO: hook up jsPDF / react-pdf generation here
  }

  const handleEmail = (report: Report) => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Report sent",
      description: `“${report.title}” emailed to ${email}`,
    })
    // TODO: integrate email-sending logic
  }

  /* ----------------- UI ----------------- */
  return (
    <div className="space-y-6">
      {/* heading */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E2A38] flex items-center gap-2">
          <FileText className="h-8 w-8 text-[#22C55E]" />
          Energy Reports
        </h1>
        <p className="text-gray-600">Download or email your AI-generated energy analysis reports</p>
      </div>

      {/* reports list */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reports</CardTitle>
          <CardDescription>Manage and share previously generated reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border rounded-lg p-4"
            >
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-gray-500">{r.date}</p>
                <p className="text-xs text-gray-500">
                  {r.savings} • {r.carbon}
                </p>
              </div>

              <div className="flex w-full md:w-auto gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 md:flex-none bg-transparent"
                  onClick={() => handleDownload(r)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 md:flex-none" onClick={() => handleEmail(r)}>
                  <Send className="h-4 w-4 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          ))}

          {/* email input */}
          <div className="mt-6 space-y-2">
            <Label htmlFor="email">Send to email address</Label>
            <Input id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
