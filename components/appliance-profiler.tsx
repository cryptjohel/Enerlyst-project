"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { saveCalculation } from "@/lib/firestore";
import { generateEnergyReport } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { Appliance } from "../types/appliance"; // ✅ central type

// Props type
interface ApplianceProfilerProps {
  onReportGenerated?: (data: Appliance[]) => void;
}

// Predefined appliances with wattages
const commonAppliances: { name: string; wattage: number }[] = [
  { name: "LED Bulb", wattage: 10 },
  { name: "Ceiling Fan", wattage: 75 },
  { name: "Refrigerator", wattage: 150 },
  { name: "Air Conditioner (1HP)", wattage: 746 },
  { name: "Television (LED)", wattage: 100 },
  { name: "Laptop", wattage: 65 },
  { name: "Washing Machine", wattage: 500 },
  { name: "Microwave", wattage: 1000 },
  { name: "Water Heater", wattage: 1500 },
  { name: "Iron", wattage: 1200 },
  { name: "Router", wattage: 10 },
  { name: "Desktop PC", wattage: 250 },
  { name: "Freezer", wattage: 200 },
  { name: "Electric Kettle", wattage: 2000 },
];

export default function ApplianceProfiler({ onReportGenerated }: ApplianceProfilerProps) {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [newAppliance, setNewAppliance] = useState({
    name: "",
    wattage: 0,
    quantity: 1,
    hoursPerDay: 1,
    location: "",
  });
  const [loadProfile, setLoadProfile] = useState<any | null>(null);
  const [aiInsights, setAiInsights] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth?.() ?? { user: null }; // safe-call
  const { toast } = useToast?.() ?? { toast: undefined }; // safe-call

  // Handle quick-select from predefined list
  const handleQuickSelect = (value: string) => {
    const item = commonAppliances.find((c) => c.name === value);
    if (!item) {
      setNewAppliance((p) => ({ ...p, name: value }));
      return;
    }
    setNewAppliance((p) => ({ ...p, name: item.name, wattage: item.wattage }));
  };

  // Add new appliance
  const addAppliance = () => {
    if (!newAppliance.name || !newAppliance.wattage) {
      toast?.({
        title: "Missing data",
        description: "Appliance name and wattage required",
        variant: "destructive",
      });
      return;
    }

    const consumption =
      Number(newAppliance.wattage) *
      Number(newAppliance.quantity || 1) *
      Number(newAppliance.hoursPerDay || 1);

    const kwhPerDay = consumption / 1000;

    const a: Appliance = {
      id: Date.now().toString(),
      name: newAppliance.name,
      wattage: Number(newAppliance.wattage),
      quantity: Number(newAppliance.quantity || 1),
      hoursPerDay: Number(newAppliance.hoursPerDay || 1),
      location: newAppliance.location || "",
      consumption,
      kwhPerDay,
    };

    const updated = [...appliances, a];
    setAppliances(updated);
    onReportGenerated?.(updated); // ✅ fire callback

    setNewAppliance({ name: "", wattage: 0, quantity: 1, hoursPerDay: 1, location: "" });
  };

  const removeAppliance = (id: string) => {
    const updated = appliances.filter((x) => x.id !== id);
    setAppliances(updated);
    onReportGenerated?.(updated);
  };

  // Load profile calculation
  const calculateLoadProfile = async () => {
    if (appliances.length === 0) {
      toast?.({
        title: "No appliances",
        description: "Add at least one appliance",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    const totalDailyKWh = appliances.reduce(
      (sum, a) => sum + (a.kwhPerDay ?? a.consumption / 1000),
      0
    );

    const profile = {
      daily: totalDailyKWh,
      weekly: totalDailyKWh * 7,
      monthly: totalDailyKWh * 30,
      solarRecommendation: {
        systemSize: Number((totalDailyKWh * 1.3).toFixed(2)), // kW
        batterySize: Number((totalDailyKWh * 2).toFixed(2)), // kWh
      },
    };

    setLoadProfile(profile);
    setLoading(false);

    if (user?.uid) {
      try {
        await saveCalculation(user.uid, "appliance", {
          appliances,
          profileData: profile,
        });
        toast?.({
          title: "Saved",
          description: "Calculation saved to your history.",
        });
      } catch (err) {
        console.error("Failed to save calculation", err);
        toast?.({
          title: "Save failed",
          description: "Couldn't save calculation",
          variant: "destructive",
        });
      }
    }
  };

  // AI Insights
  const getAIInsights = async () => {
    if (!loadProfile) {
      toast?.({
        title: "No profile",
        description: "Calculate load profile first",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appliances, loadProfile }),
      });
      if (!res.ok) throw new Error("AI failed");
      const ai = await res.json();
      setAiInsights(ai);
      setLoadProfile({ ...loadProfile, aiInsights: ai });
      toast?.({ title: "AI insights ready" });
    } catch (err) {
      console.error(err);
      toast?.({
        title: "AI failed",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Download report as PDF
  const downloadReport = () => {
    if (!loadProfile) {
      toast?.({
        title: "No profile",
        description: "Calculate profile first",
        variant: "destructive",
      });
      return;
    }

    const title = `Appliance_Report_${new Date().toISOString().slice(0, 10)}`;
    generateEnergyReport(
      {
        type: "appliance",
        title,
        appliances: appliances.map((a) => ({
          name: a.name,
          wattage: a.wattage,
          quantity: a.quantity,
          hoursPerDay: a.hoursPerDay,
        })),
        loadProfile,
        aiInsights,
      } as any,
      { mode: "download" } as any
    );
  };

  const totalDailyKwh = appliances.reduce(
    (s, a) => s + (a.kwhPerDay ?? a.consumption / 1000),
    0
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">⚡ Appliance Profiler</h2>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Quick Select</label>
          <select
            value={newAppliance.name}
            onChange={(e) => handleQuickSelect(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- choose appliance --</option>
            {commonAppliances.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.wattage}W)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            value={newAppliance.name}
            onChange={(e) =>
              setNewAppliance({ ...newAppliance, name: e.target.value })
            }
            className="w-full border p-2 rounded"
            placeholder="e.g. Fridge"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Wattage (W)</label>
          <input
            type="number"
            value={newAppliance.wattage || ""}
            onChange={(e) =>
              setNewAppliance({
                ...newAppliance,
                wattage: Number(e.target.value),
              })
            }
            className="w-full border p-2 rounded"
            placeholder="e.g. 150"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            value={newAppliance.quantity}
            onChange={(e) =>
              setNewAppliance({
                ...newAppliance,
                quantity: Number(e.target.value),
              })
            }
            className="w-full border p-2 rounded"
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hours / day</label>
          <input
            type="number"
            value={newAppliance.hoursPerDay}
            onChange={(e) =>
              setNewAppliance({
                ...newAppliance,
                hoursPerDay: Number(e.target.value),
              })
            }
            className="w-full border p-2 rounded"
            step="0.1"
            min="0"
            max="24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Location (optional)
          </label>
          <input
            value={newAppliance.location}
            onChange={(e) =>
              setNewAppliance({ ...newAppliance, location: e.target.value })
            }
            className="w-full border p-2 rounded"
            placeholder="e.g. Living room"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button onClick={addAppliance} className="bg-green-600 hover:bg-green-700">
          Add Appliance
        </Button>
        <Button
          onClick={calculateLoadProfile}
          className="bg-slate-800"
        >
          {loading ? "Calculating..." : "Calculate Profile"}
        </Button>
        <Button
          onClick={getAIInsights}
          className="bg-blue-600"
          disabled={!loadProfile || loading}
        >
          Get AI Insights
        </Button>
        <Button
          onClick={downloadReport}
          className="bg-indigo-600"
          disabled={!loadProfile}
        >
          Download PDF
        </Button>
      </div>

      {/* Appliances List */}
      <div>
        {appliances.length === 0 ? (
          <p className="text-gray-500">No appliances added yet.</p>
        ) : (
          <ul className="space-y-2">
            {appliances.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between border rounded p-3 bg-gray-50"
              >
                <div>
                  <div className="font-medium">
                    {a.name}{" "}
                    {a.location ? (
                      <span className="text-xs ml-2">({a.location})</span>
                    ) : null}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {a.quantity} × {a.wattage}W × {a.hoursPerDay}h/day ={" "}
                    <strong>
                      {(
                        a.kwhPerDay ?? a.consumption / 1000
                      ).toFixed(2)}{" "}
                      kWh/day
                    </strong>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => removeAppliance(a.id)}>
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Load Profile Summary */}
      {loadProfile && (
        <div className="mt-4 p-4 border rounded bg-white">
          <h3 className="font-semibold mb-2">Load Profile</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-lg font-bold">
                {loadProfile.daily.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">kWh / day</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {loadProfile.weekly.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">kWh / week</div>
            </div>
            <div>
              <div className="text-lg font-bold">
                {loadProfile.monthly.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">kWh / month</div>
            </div>
          </div>

          {aiInsights && (
            <div className="mt-4 bg-blue-50 p-3 rounded">
              <h4 className="font-semibold">AI Executive Summary</h4>
              <p className="text-sm">
                {aiInsights.executiveSummary ??
                  aiInsights.summary ??
                  "—"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
