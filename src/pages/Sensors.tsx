import React, { useState } from 'react';
import {
  Radio,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Search,
  Battery,
  Signal,
} from 'lucide-react';
import { useWaterNetwork } from '../hooks/useWaterNetwork';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Sensor } from '../types';

export const Sensors: React.FC = () => {
  const { sensors, zones } = useWaterNetwork();

  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  const filteredSensors = sensors.filter((s) => {
    const matchesZone = zoneFilter === 'ALL' || s.zoneName === zoneFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sensors"
        description="Monitor all IoT sensors connected to the network."
      />

      {/* Top 4 Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Sensors"
          value={48}
          subtitle="5 Zones"
          icon={Radio}
        />
        <KpiCard
          title="Online"
          value={46}
          subtitle="95.8% Uptime"
          status="Online"
          icon={CheckCircle2}
        />
        <KpiCard
          title="Warning"
          value={1}
          subtitle="Zone 3 (S-003)"
          status="Warning"
          icon={AlertTriangle}
        />
        <KpiCard
          title="Offline"
          value={1}
          subtitle="Zone 5 (S-012)"
          status="Offline"
          icon={WifiOff}
        />
      </div>

      {/* Sensor Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">IoT Telemetry Nodes</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any row to inspect hardware diagnostics, battery level, and signal telemetry
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sensor ID or type..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">All Zones</option>
              {zones.map((z) => (
                <option key={z.id} value={z.name}>
                  {z.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Online">Online</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-2.5 pr-4">Sensor ID</th>
                <th className="py-2.5 px-4">Zone</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4 text-right">Pressure</th>
                <th className="py-2.5 px-4 text-right">Flow</th>
                <th className="py-2.5 px-4 text-right">Last Reading</th>
                <th className="py-2.5 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSensors.map((sensor) => (
                <tr
                  key={sensor.id}
                  onClick={() => setSelectedSensor(sensor)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 pr-4 font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap">
                    {sensor.id}
                  </td>
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {sensor.zoneName}
                  </td>
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {sensor.type}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap">
                    {sensor.pressure.toFixed(1)} bar
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap">
                    {sensor.flow} L/min
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-xs text-slate-500 whitespace-nowrap">
                    {sensor.lastReading}
                  </td>
                  <td className="py-3 pl-4 text-right whitespace-nowrap">
                    <StatusBadge status={sensor.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sensor Detail Modal */}
      <Modal
        isOpen={!!selectedSensor}
        onClose={() => setSelectedSensor(null)}
        title={selectedSensor ? `${selectedSensor.id} — ${selectedSensor.name}` : 'Sensor Details'}
        subtitle={selectedSensor ? `${selectedSensor.zoneName} · ${selectedSensor.type} Transducer` : ''}
      >
        {selectedSensor && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs text-slate-500">Current Pressure</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                  {selectedSensor.pressure.toFixed(2)} bar
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Current Flow Rate</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                  {selectedSensor.flow} L/min
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/80">
                <div className="text-xs text-slate-500 inline-flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5" /> Battery Level
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-slate-800 mt-0.5">
                  {selectedSensor.batteryLevel}% (Li-SOCl2)
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/80">
                <div className="text-xs text-slate-500 inline-flex items-center gap-1">
                  <Signal className="w-3.5 h-3.5" /> LoRaWAN RSSI
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-slate-800 mt-0.5">
                  {selectedSensor.signalStrength} dBm
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>Last Heartbeat: {selectedSensor.lastReading}</span>
              <StatusBadge status={selectedSensor.status} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
