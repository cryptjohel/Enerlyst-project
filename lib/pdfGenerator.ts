import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "@/public/logo.png"; // Next.js StaticImageData

interface ApplianceReport {
  name: string;
  wattage: number;
  quantity: number;
  hoursPerDay: number;
}

interface DieselReport {
  capacityLiters: number;
  loadKW: number;
  runtimeHours: number;
  efficiency?: number;
  fuelConsumed?: number;
  costPerLitre?: number;
  totalCost?: number;
}

interface ReportInput {
  title: string;
  type: "appliance" | "diesel";
  appliances?: ApplianceReport[];
  loadProfile?: { daily: number; weekly: number; monthly: number };
  dieselData?: DieselReport;
  aiInsights?: {
    summary: string;
    recommendations?: string;
    solarRecommendation?: string;
    nigerianContext?: string;
  };
}

export function generateEnergyReport(
  report: ReportInput,
  options?: { mode?: "download" | "buffer" }
) {
  if (!report?.title) throw new Error("Report title is required");

  const doc = new jsPDF();

  // --- Brand Header ---
  doc.setFillColor(25, 91, 255); // brand blue
  doc.rect(0, 0, 210, 30, "F"); // top banner
  doc.addImage(logo.src, "PNG", 10, 5, 20, 20); // ✅ fixed: use .src
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Enerlyst Report", 40, 20);

  doc.setTextColor(0, 0, 0);

  // --- Report Title ---
  doc.setFontSize(14);
  doc.text(report.title, 14, 40);

  // --- Appliance Section ---
  if (report.type === "appliance" && report.appliances?.length) {
    autoTable(doc, {
      startY: 50,
      head: [["Name", "Wattage (W)", "Qty", "Hours/day", "kWh/day"]],
      body: report.appliances.map((a) => [
        a.name,
        a.wattage,
        a.quantity,
        a.hoursPerDay,
        ((a.wattage * a.quantity * a.hoursPerDay) / 1000).toFixed(2),
      ]),
    });

    if (report.loadProfile) {
      const startY = (doc as any).lastAutoTable?.finalY ?? 80;
      autoTable(doc, {
        startY: startY + 10,
        head: [["Period", "kWh"]],
        body: [
          ["Daily", report.loadProfile.daily?.toFixed(2) ?? "N/A"],
          ["Weekly", report.loadProfile.weekly?.toFixed(2) ?? "N/A"],
          ["Monthly", report.loadProfile.monthly?.toFixed(2) ?? "N/A"],
        ],
      });
    }
  }

  // --- Diesel Section ---
  if (report.type === "diesel" && report.dieselData) {
    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Value"]],
      body: [
        ["Capacity (L)", report.dieselData.capacityLiters],
        ["Load (kW)", report.dieselData.loadKW],
        ["Runtime (hrs)", report.dieselData.runtimeHours],
        ["Efficiency (%)", report.dieselData.efficiency ?? "N/A"],
        ["Fuel Consumed (L)", report.dieselData.fuelConsumed ?? "N/A"],
        ["Cost per Litre", report.dieselData.costPerLitre ?? "N/A"],
        ["Total Cost", report.dieselData.totalCost ?? "N/A"],
      ],
    });
  }

  // --- AI Insights Section ---
  if (report.aiInsights?.summary) {
    const startY = (doc as any).lastAutoTable?.finalY ?? 120;
    doc.setFontSize(12);
    doc.text("AI Insights", 14, startY + 20);
    doc.setFontSize(10);

    doc.text(`Summary: ${report.aiInsights.summary}`, 14, startY + 30);
    if (report.aiInsights.recommendations) {
      doc.text(
        `Recommendations: ${report.aiInsights.recommendations}`,
        14,
        startY + 40
      );
    }
    if (report.aiInsights.solarRecommendation) {
      doc.text(
        `Solar: ${report.aiInsights.solarRecommendation}`,
        14,
        startY + 50
      );
    }
    if (report.aiInsights.nigerianContext) {
      doc.text(
        `Nigeria Context: ${report.aiInsights.nigerianContext}`,
        14,
        startY + 60
      );
    }
  }

  // --- Return PDF ---
  if (options?.mode === "buffer") {
    return doc.output("arraybuffer"); // for email/backend
  }

  if (options?.mode === "download") {
    doc.save(`${report.title}.pdf`); // frontend download
  }

  return null;
}
