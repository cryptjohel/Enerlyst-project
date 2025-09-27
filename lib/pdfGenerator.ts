// lib/pdfGenerator.ts
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface ReportInput {
  title: string
  appliances?: { name: string; power: number; hours: number }[]
  loadProfile?: { daily: number; weekly: number; monthly: number }
  aiInsights?: { summary: string; recommendations?: string; solarRecommendation?: string; nigerianContext?: string }
}

export function generateEnergyReport(
  report: ReportInput,
  options?: { mode?: "download" | "buffer" }
) {
  if (!report?.title) {
    throw new Error("Report title is required")
  }

  const doc = new jsPDF()

  // Title
  doc.setFontSize(16)
  doc.text(report.title, 14, 20)

  // Load Profile Section
  if (report.loadProfile) {
    try {
      doc.setFontSize(12)
      doc.text("Load Profile", 14, 40)
      autoTable(doc, {
        startY: 45,
        head: [["Period", "kWh"]],
        body: [
          ["Daily", report.loadProfile.daily?.toFixed(2) ?? "N/A"],
          ["Weekly", report.loadProfile.weekly?.toFixed(2) ?? "N/A"],
          ["Monthly", report.loadProfile.monthly?.toFixed(2) ?? "N/A"],
        ],
      })
    } catch (err) {
      console.warn("⚠️ Failed to render Load Profile:", err)
    }
  }

  // Appliances Section
  if (report.appliances?.length) {
    const startY = (doc as any).lastAutoTable?.finalY ?? 70
    try {
      doc.setFontSize(12)
      doc.text("Appliances", 14, startY + 20)
      autoTable(doc, {
        startY: startY + 25,
        head: [["Name", "Power (W)", "Hours/day", "kWh/day"]],
        body: report.appliances.map((a) => [
          a.name ?? "Unknown",
          a.power ?? "0",
          a.hours ?? "0",
          a.power && a.hours ? (a.power * a.hours / 1000).toFixed(2) : "0",
        ]),
      })
    } catch (err) {
      console.warn("⚠️ Failed to render Appliances:", err)
    }
  }

  // AI Insights Section
  if (report.aiInsights?.summary) {
    const startY = (doc as any).lastAutoTable?.finalY ?? 120
    try {
      doc.setFontSize(12)
      doc.text("AI Insights", 14, startY + 20)
      doc.setFontSize(10)
      doc.text(`Summary: ${report.aiInsights.summary}`, 14, startY + 30)

      if (report.aiInsights.recommendations) {
        doc.text(`Recommendations: ${report.aiInsights.recommendations}`, 14, startY + 40)
      }
      if (report.aiInsights.solarRecommendation) {
        doc.text(`Solar: ${report.aiInsights.solarRecommendation}`, 14, startY + 50)
      }
      if (report.aiInsights.nigerianContext) {
        doc.text(`Nigeria Context: ${report.aiInsights.nigerianContext}`, 14, startY + 60)
      }
    } catch (err) {
      console.warn("⚠️ Failed to render AI Insights:", err)
    }
  }

  // Return buffer (for backend email) or save directly (frontend download)
  if (options?.mode === "buffer") {
    return doc.output("arraybuffer")
  }

  if (options?.mode === "download") {
    doc.save(`${report.title}.pdf`)
  }

  return null
}
