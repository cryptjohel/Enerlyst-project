"use client";
import { useState } from "react";

interface Appliance {
  name: string;
  wattage: number;
  hours: number;
  consumption: number;
}

interface ApplianceProfilerProps {
  onReportGenerated?: (data: Appliance[]) => void;
}

export default function ApplianceProfiler({ onReportGenerated }: ApplianceProfilerProps) {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [name, setName] = useState("");
  const [wattage, setWattage] = useState("");
  const [hours, setHours] = useState("");

  // ✅ Add new appliance
  const addAppliance = () => {
    if (!name || !wattage || !hours) return;

    const newAppliance: Appliance = {
      name,
      wattage: parseFloat(wattage),
      hours: parseFloat(hours),
      consumption: parseFloat(wattage) * parseFloat(hours),
    };

    const updated = [...appliances, newAppliance];
    setAppliances(updated);

    // Send data up to dashboard
    onReportGenerated?.(updated);

    // Reset form
    setName("");
    setWattage("");
    setHours("");
  };

  // ✅ Calculate total daily consumption
  const totalConsumption = appliances.reduce((sum, a) => sum + a.consumption, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">⚡ Appliance Profiler</h2>

      {/* Form to add appliances */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Appliance Name"
          className="border p-2 rounded flex-1"
        />
        <input
          type="number"
          value={wattage}
          onChange={(e) => setWattage(e.target.value)}
          placeholder="Wattage (W)"
          className="border p-2 rounded w-32"
        />
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Hours/Day"
          className="border p-2 rounded w-32"
        />
        <button
          onClick={addAppliance}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          ➕ Add
        </button>
      </div>

      {/* Display appliances list */}
      {appliances.length > 0 ? (
        <div className="space-y-2">
          <h3 className="font-semibold">📋 Added Appliances</h3>
          <ul className="space-y-1">
            {appliances.map((a, index) => (
              <li key={index} className="border p-2 rounded bg-gray-50">
                <span className="font-medium">{a.name}</span>: {a.wattage}W ×{" "}
                {a.hours}h = <strong>{a.consumption.toFixed(2)} Wh</strong>
              </li>
            ))}
          </ul>
          <div className="mt-4 p-2 bg-blue-100 rounded">
            <strong>Total Daily Consumption:</strong> {totalConsumption.toFixed(2)} Wh
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No appliances added yet. Start by adding one above.</p>
      )}
    </div>
  );
}
