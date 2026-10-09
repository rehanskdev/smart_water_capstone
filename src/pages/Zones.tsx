import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Radio,
  Droplets,
  Gauge,
  AlertTriangle,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { useWaterNetwork } from '../hooks/useWaterNetwork';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { Zone } from '../types';

export const Zones: React.FC = () => {
  const { zones, sensors } = useWaterNetwork();
  const navigate = useNavigate();

  // Default selected zone to Zone 3 so operator can immediately inspect its detailed analytics
  const [selectedZone, setSelectedZone] = useState<Zone>(zones[2] || zones[0]);

  const zoneSensors = sensors.filter((s) => s.zoneName === selectedZone.name);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Water Distribution Zones"
        description="District Metered Area (DMA) telemetry, pressure stability, and non-revenue water loss."
      />

      {/* Zone Cards Grid (Zone 1 to Zone 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {zones.map((zone) => {
          const isSelected = zone.id === selectedZone.id;
          const displayStatus =
            zone.status === 'Critical' || zone.status === 'Warning'
              ? 'Attention Required'
              : 'Normal';

          return (
            <div
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`bg-white rounded-xl p-5 border transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-600 ring-1 ring-sky-600'
                  : 'border-slate-200 hover:border-sky-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                      <Building2 className="w-4 h-4 text-sky-600" />
                    </div>
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                      {zone.name}
                    </h2>
                  </div>
                  <span className="text-xs font-mono tabular-nums font-semibold text-slate-500">
                    Health {zone.healthScore}%
                  </span>
                </div>

                <div className="space-y-2.5 text-xs border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Sensors:</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {zone.sensorCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Consumption:</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {zone.consumption.toLocaleString()} L
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Pressure:</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {zone.pressure.toFixed(1)} bar
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Water Loss:</span>
                    <span
                      className={`font-mono tabular-nums font-bold ${
                        zone.waterLossPercentage > 10 ? 'text-red-600' : 'text-slate-900'
                      }`}
                    >
                      {zone.waterLossPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Status:</span>
                <StatusBadge status={displayStatus} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Zone Detailed Analytics Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-semibold text-sky-700 uppercase">
              DETAILED DMA ANALYTICS
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              {selectedZone.name} — Infrastructure & Sensor Breakdown
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/map')}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
            >
              <span>Inspect on Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            {selectedZone.waterLossPercentage > 10 && (
              <button
                onClick={() => navigate('/localization')}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Localize Active Leak →
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>Population Served</span>
            </div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {selectedZone.populationServed.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Droplets className="w-3.5 h-3.5 text-sky-600" />
              <span>Non-Revenue Loss Vol</span>
            </div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {selectedZone.waterLossVolume.toLocaleString()} L/day
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Gauge className="w-3.5 h-3.5 text-sky-600" />
              <span>Pipeline Length</span>
            </div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {selectedZone.pipeLengthKm} km
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Radio className="w-3.5 h-3.5 text-sky-600" />
              <span>Active Sensors in Zone</span>
            </div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
              {selectedZone.sensorCount} Units
            </div>
          </div>
        </div>

        {/* Sensors assigned to this Zone */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">
            Assigned Telemetry Nodes in {selectedZone.name}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-2 pr-4">Sensor ID</th>
                  <th className="py-2 px-4">Location Name</th>
                  <th className="py-2 px-4">Type</th>
                  <th className="py-2 px-4 text-right">Pressure</th>
                  <th className="py-2 px-4 text-right">Flow</th>
                  <th className="py-2 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {zoneSensors.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-4 font-mono font-bold text-slate-900">{s.id}</td>
                    <td className="py-2.5 px-4 text-slate-700">{s.name}</td>
                    <td className="py-2.5 px-4 text-slate-500">{s.type}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                      {s.pressure.toFixed(1)} bar
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                      {s.flow} L/min
                    </td>
                    <td className="py-2.5 pl-4 text-right">
                      <StatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
