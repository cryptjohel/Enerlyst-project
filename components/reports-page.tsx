"use client";
import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ApplianceProfiler from "./appliance-profiler";
import { DieselCalculator } from "./diesel-calculator";
import { Appliance } from "../types/appliance";

interface HistoryEntry {
  source: "Profiler" | "Diesel";
  data: Appliance[];
}

export default function ReportsPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleReportGenerated = (data: Appliance[], source: "Profiler" | "Diesel") => {
    setHistory((prev) => [...prev, { source, data }]);
  };

  const generatePDF = () => {
    if (history.length === 0) return;
    const doc = new jsPDF();
    const last = history[history.length - 1];

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 82, 152);
    doc.text("Enerlyst Energy Report", 14, 25);

    // Source
    doc.setFontSize(12);
    doc.setTextColor(
      last.source === "Profiler" ? 0 : 184,
      last.source === "Profiler" ? 128 : 134,
      last.source === "Profiler" ? 0 : 11
    );
    doc.text(`Source: ${last.source}`, 14, 35);

    // Table
    autoTable(doc, {
      head: [["Appliance/Load", "Qty", "Wattage (W)", "Hours/Day", "Consumption (Wh)", "kWh/Day"]],
      body: last.data.map((a) => [
        a.name,
        a.quantity,
        a.wattage,
        a.hoursPerDay,
        a.consumption.toFixed(2),
        (a.kwhPerDay ?? 0).toFixed(2),
      ]),
      startY: 45,
      styles: { fillColor: [240, 248, 255] },
      headStyles: { fillColor: [40, 82, 152], textColor: 255 },
    });

    const total = last.data.reduce((acc, a) => acc + (a.kwhPerDay ?? a.consumption / 1000), 0);
    const finalY = (doc as any).lastAutoTable?.finalY ?? 50;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Daily Consumption: ${total.toFixed(2)} kWh`, 14, finalY + 10);

    doc.save("energy-report.pdf");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Both calculators send results through same handler */}
      <ApplianceProfiler
        onReportGenerated={(data: Appliance[]) => handleReportGenerated(data, "Profiler")}
      />
      <DieselCalculator
        onReportGenerated={(data: Appliance[]) => handleReportGenerated(data, "Diesel")}
      />

      <button
        onClick={generatePDF}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        disabled={history.length === 0}
      >
        Generate PDF
      </button>

      {/* History */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Report History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No reports generated yet.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((entry, i) => (
              <li
                key={i}
                className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
              >
                <p className="font-medium flex items-center gap-2">
                  Analysis {i + 1}{" "}
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      entry.source === "Profiler"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {entry.source}
                  </span>
                </p>
                <ul className="text-sm text-gray-600 mt-2">
                  {entry.data.map((a, j) => (
                    <li key={j}>
                      {a.name} — {a.quantity} × {a.wattage}W × {a.hoursPerDay}h →{" "}
                      {(a.kwhPerDay ?? 0).toFixed(2)} kWh/day
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
