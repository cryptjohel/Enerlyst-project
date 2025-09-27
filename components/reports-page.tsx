"use client";
import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ApplianceProfiler from "./appliance-profiler";

interface Appliance {
  name: string;
  wattage: number;
  hours: number;
  consumption: number;
}

export default function ReportsPage() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);

  const totalConsumption = appliances.reduce(
    (acc, a) => acc + a.consumption,
    0
  );

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Appliance Energy Report", 14, 22);

    autoTable(doc, {
      head: [["Appliance", "Wattage (W)", "Hours/Day", "Consumption (Wh)"]],
      body: appliances.map((a) => [
        a.name,
        a.wattage,
        a.hours,
        a.consumption.toFixed(2),
      ]),
      startY: 30,
    });

    const finalY = (doc as any).lastAutoTable?.finalY ?? 40;

    doc.setFontSize(14);
    doc.text(
      `Total Daily Consumption: ${totalConsumption.toFixed(2)} Wh`,
      14,
      finalY + 10
    );

    doc.save("energy-report.pdf");
  };

  return (
    <div className="space-y-6">
      <ApplianceProfiler onReportGenerated={setAppliances} />

      <button
        onClick={generatePDF}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={appliances.length === 0}
      >
        Generate PDF
      </button>
    </div>
  );
}
