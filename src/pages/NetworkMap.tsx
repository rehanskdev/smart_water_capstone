import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Radio,
  AlertOctagon,
  Building2,
  Crosshair,
  Gauge,
  Activity,
  Clock,
  Battery,
} from 'lucide-react';
import { useWaterNetwork } from '../hooks/useWaterNetwork';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { Sensor } from '../types';

export const NetworkMap: React.FC = () => {
  const { sensors, zones, leaks, setSelectedLeakForLocalization } = useWaterNetwork();
  const navigate = useNavigate();

  // Default selected sensor to S-003 (Sensor S03 in Zone 2 per prompt specification)
  const defaultSensor = sensors.find((s) => s.id === 'S-003') || sensors[0];
  const [selectedSensorId, setSelectedSensorId] = useState<string>(defaultSensor.id);
  const [zoom, setZoom] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Online' | 'Warning' | 'Critical' | 'Offline'>('ALL');
  const [showSensors, setShowSensors] = useState<boolean>(true);
  const [showLeaks, setShowLeaks] = useState<boolean>(true);
  const [showZones, setShowZones] = useState<boolean>(true);

  const selectedSensor: Sensor =
    sensors.find((s) => s.id === selectedSensorId) || defaultSensor;

  const getSensorColor = (status: Sensor['status']) => {
    switch (status) {
      case 'Online':
        return { fill: '#16a34a', stroke: '#dcfce7', text: 'Normal' };
      case 'Warning':
        return { fill: '#d97706', stroke: '#fef3c7', text: 'Warning' };
      case 'Critical':
        return { fill: '#dc2626', stroke: '#fee2e2', text: 'Critical' };
      case 'Offline':
      default:
        return { fill: '#64748b', stroke: '#f1f5f9', text: 'Offline' };
    }
  };

  // Map topology sensor nodes matching the user's schematic diagram:
  // RESERVOIR -> S01 -> branch to S02 (Zone 1) and S03 (Zone 2) -> S04 --- S05 -> Zone 3 -> LEAK
  const s01 = sensors.find((s) => s.id === 'S-001')!;
  const s02 = sensors.find((s) => s.id === 'S-002')!;
  const s03 = sensors.find((s) => s.id === 'S-003')!;
  const s04 = sensors.find((s) => s.id === 'S-004')!;
  const s05 = sensors.find((s) => s.id === 'S-005')!;
  const s06 = sensors.find((s) => s.id === 'S-006')!;
  const s07 = sensors.find((s) => s.id === 'S-007')!;
  const s08 = sensors.find((s) => s.id === 'S-008')!;
  const s10 = sensors.find((s) => s.id === 'S-010')!;
  const s12 = sensors.find((s) => s.id === 'S-012')!;

  const mapSensorNodes = [
    { sensor: s01, shortLabel: 'S01', x: 450, y: 120 },
    { sensor: s02, shortLabel: 'S02', x: 270, y: 200 },
    { sensor: s03, shortLabel: 'S03', x: 630, y: 200 },
    { sensor: s04, shortLabel: 'S04', x: 270, y: 360 },
    { sensor: s05, shortLabel: 'S05', x: 630, y: 360 },
    { sensor: s06, shortLabel: 'S06', x: 110, y: 280 },
    { sensor: s07, shortLabel: 'S07', x: 790, y: 280 },
    { sensor: s08, shortLabel: 'S08', x: 270, y: 530 },
    { sensor: s10, shortLabel: 'S10', x: 790, y: 450 },
    { sensor: s12, shortLabel: 'S12', x: 520, y: 470 },
  ].filter((node) => statusFilter === 'ALL' || node.sensor.status === statusFilter);

  const handleInspectLeak = (leakId: string) => {
    const found = leaks.find((l) => l.id === leakId);
    if (found) {
      setSelectedLeakForLocalization(found);
      navigate('/localization');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Network Map"
        description="Monitor water distribution infrastructure and sensor status."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Layer Toggles */}
            <button
              onClick={() => setShowSensors((v) => !v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                showSensors
                  ? 'bg-sky-50 border-sky-200 text-sky-800'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Show Sensors</span>
            </button>
            <button
              onClick={() => setShowLeaks((v) => !v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                showLeaks
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Show Leaks</span>
            </button>
            <button
              onClick={() => setShowZones((v) => !v)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                showZones
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Show Zones</span>
            </button>
          </div>
        }
      />

      {/* Map Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 mr-1">Filter Status:</span>
          {(['ALL', 'Online', 'Warning', 'Critical', 'Offline'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Nodes' : st}
            </button>
          ))}
        </div>

        {/* Legend & Zoom Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
              Normal
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-600 inline-block" />
              Warning
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-red-600 inline-block" />
              Critical
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-slate-500 inline-block" />
              Offline
            </span>
          </div>

          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={() => setZoom((z) => Math.min(1.35, Number((z + 0.1).toFixed(2))))}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono tabular-nums text-slate-600">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.1).toFixed(2))))}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Area + Selected Sensor Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Interactive Hydraulic Schematic SVG Canvas */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative">
          <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>SCADA Hydraulic Topology Schematic — Sector North-South</span>
            <span className="font-mono tabular-nums">Click any sensor or leak node to inspect</span>
          </div>

          <div className="w-full overflow-auto flex items-center justify-center p-4 min-h-[540px]">
            <svg
              viewBox="0 0 900 580"
              className="w-full h-auto max-h-[560px] select-none transition-transform duration-150"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            >
              <defs>
                <pattern id="scadaGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path
                    d="M 30 0 L 0 0 0 30"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>

              {/* Background Grid */}
              <rect width="900" height="580" fill="url(#scadaGrid)" />

              {/* Zone Sectors (when Show Zones is enabled) */}
              {showZones && (
                <g>
                  {/* Zone 1 Box */}
                  <rect
                    x="195"
                    y="235"
                    width="150"
                    height="90"
                    rx="8"
                    fill="#0f172a"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text x="270" y="275" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="700">
                    ZONE 1
                  </text>
                  <text x="270" y="295" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">
                    {zones[0].pressure.toFixed(1)} bar · {zones[0].consumption.toLocaleString()} L
                  </text>

                  {/* Zone 2 Box */}
                  <rect
                    x="555"
                    y="235"
                    width="150"
                    height="90"
                    rx="8"
                    fill="#0f172a"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text x="630" y="275" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="700">
                    ZONE 2
                  </text>
                  <text x="630" y="295" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">
                    {zones[1].pressure.toFixed(1)} bar · {zones[1].consumption.toLocaleString()} L
                  </text>

                  {/* Zone 3 Box */}
                  <rect
                    x="195"
                    y="395"
                    width="150"
                    height="70"
                    rx="8"
                    fill="#0f172a"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                  />
                  <text x="270" y="427" textAnchor="middle" fill="#f87171" fontSize="13" fontWeight="700">
                    ZONE 3
                  </text>
                  <text x="270" y="446" textAnchor="middle" fill="#fca5a5" fontSize="11" fontFamily="JetBrains Mono">
                    {zones[2].pressure.toFixed(1)} bar · Loss 12.8%
                  </text>

                  {/* Zone 4 Box (West Wing) */}
                  <rect
                    x="40"
                    y="320"
                    width="130"
                    height="70"
                    rx="8"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text x="105" y="352" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="600">
                    ZONE 4
                  </text>
                  <text x="105" y="370" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">
                    4.0 bar · Normal
                  </text>

                  {/* Zone 5 Box (East Industrial Wing) */}
                  <rect
                    x="725"
                    y="320"
                    width="140"
                    height="70"
                    rx="8"
                    fill="#0f172a"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text x="795" y="352" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="600">
                    ZONE 5
                  </text>
                  <text x="795" y="370" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
                    3.1 bar · Warning
                  </text>
                </g>
              )}

              {/* Pipe Network Lines */}
              <g strokeLinecap="round" strokeLinejoin="round">
                {/* Reservoir to S01 */}
                <line x1="450" y1="75" x2="450" y2="120" stroke="#0ea5e9" strokeWidth="5" />
                {/* S01 split left (270) and right (630) */}
                <line x1="450" y1="120" x2="450" y2="160" stroke="#0ea5e9" strokeWidth="5" />
                <line x1="270" y1="160" x2="630" y2="160" stroke="#0ea5e9" strokeWidth="4" />
                <line x1="270" y1="160" x2="270" y2="200" stroke="#0ea5e9" strokeWidth="4" />
                <line x1="630" y1="160" x2="630" y2="200" stroke="#0ea5e9" strokeWidth="4" />

                {/* S02 through Zone 1 to S04 */}
                <line x1="270" y1="200" x2="270" y2="235" stroke="#0ea5e9" strokeWidth="4" />
                <line x1="270" y1="325" x2="270" y2="360" stroke="#0ea5e9" strokeWidth="4" />

                {/* S03 through Zone 2 to S05 */}
                <line x1="630" y1="200" x2="630" y2="235" stroke="#0ea5e9" strokeWidth="4" />
                <line x1="630" y1="325" x2="630" y2="360" stroke="#0ea5e9" strokeWidth="4" />

                {/* S04 to S05 Horizontal Interconnect (Pipe P-07) */}
                <line x1="270" y1="360" x2="630" y2="360" stroke="#38bdf8" strokeWidth="4" />
                <text x="450" y="350" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontFamily="JetBrains Mono">
                  Pipe P-07 (Interconnect S03/S05 ↔ S04)
                </text>

                {/* S04 through Zone 3 to Leak & S08 */}
                <line x1="270" y1="360" x2="270" y2="395" stroke="#ef4444" strokeWidth="4" />
                <line x1="270" y1="465" x2="270" y2="530" stroke="#ef4444" strokeWidth="4" strokeDasharray="6 4" />

                {/* West Branch to S06 & Zone 4 */}
                <line x1="270" y1="200" x2="110" y2="200" stroke="#0284c7" strokeWidth="3" />
                <line x1="110" y1="200" x2="110" y2="320" stroke="#0284c7" strokeWidth="3" />

                {/* East Branch to S07, Zone 5 & S10 (Pipe P-12) */}
                <line x1="630" y1="200" x2="790" y2="200" stroke="#f59e0b" strokeWidth="3" />
                <line x1="790" y1="200" x2="790" y2="450" stroke="#f59e0b" strokeWidth="3" />
                {/* Auxiliary S12 branch */}
                <line x1="630" y1="360" x2="520" y2="470" stroke="#475569" strokeWidth="2.5" strokeDasharray="4 4" />
              </g>

              {/* RESERVOIR Node at Top */}
              <g transform="translate(370, 20)">
                <rect
                  width="160"
                  height="55"
                  rx="8"
                  fill="#0284c7"
                  stroke="#7dd3fc"
                  strokeWidth="2"
                />
                <text x="80" y="26" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="700">
                  RESERVOIR
                </text>
                <text x="80" y="43" textAnchor="middle" fill="#e0f2fe" fontSize="10" fontFamily="JetBrains Mono">
                  Supply: 125,400 L
                </text>
              </g>

              {/* Valves on Main Trunk */}
              <g transform="translate(355, 152)">
                <rect width="16" height="16" rx="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="8" y="11" textAnchor="middle" fill="#cbd5e1" fontSize="8" fontFamily="JetBrains Mono">
                  V1
                </text>
              </g>
              <g transform="translate(535, 152)">
                <rect width="16" height="16" rx="3" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="8" y="11" textAnchor="middle" fill="#cbd5e1" fontSize="8" fontFamily="JetBrains Mono">
                  V2
                </text>
              </g>

              {/* Active Leak Nodes (when Show Leaks is enabled) */}
              {showLeaks && (
                <g>
                  {/* Primary Critical Leak L-001 below Zone 3 */}
                  <g
                    transform="translate(270, 495)"
                    className="cursor-pointer"
                    onClick={() => handleInspectLeak('L-001')}
                  >
                    <circle r="22" fill="#dc2626" fillOpacity="0.25" />
                    <circle r="14" fill="#dc2626" stroke="#fecaca" strokeWidth="2.5" />
                    <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
                      !
                    </text>
                    <rect
                      x="22"
                      y="-14"
                      width="135"
                      height="28"
                      rx="6"
                      fill="#7f1d1d"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                    />
                    <text x="90" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="JetBrains Mono">
                      LEAK L-001 (1240 L/h)
                    </text>
                  </g>

                  {/* Secondary Medium Leak L-002 in Zone 5 */}
                  <g
                    transform="translate(790, 412)"
                    className="cursor-pointer"
                    onClick={() => handleInspectLeak('L-002')}
                  >
                    <circle r="12" fill="#d97706" stroke="#fde68a" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
                      !
                    </text>
                    <rect
                      x="-135"
                      y="-12"
                      width="115"
                      height="24"
                      rx="5"
                      fill="#78350f"
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                    />
                    <text x="-77" y="4" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="600" fontFamily="JetBrains Mono">
                      LEAK L-002 (P-12)
                    </text>
                  </g>
                </g>
              )}

              {/* Sensor Nodes (when Show Sensors is enabled) */}
              {showSensors &&
                mapSensorNodes.map(({ sensor, shortLabel, x, y }) => {
                  const colors = getSensorColor(sensor.status);
                  const isSelected = sensor.id === selectedSensor.id;

                  return (
                    <g
                      key={sensor.id}
                      transform={`translate(${x}, ${y})`}
                      onClick={() => setSelectedSensorId(sensor.id)}
                      className="cursor-pointer"
                    >
                      {isSelected && (
                        <circle
                          r="24"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                        />
                      )}
                      <circle
                        r="16"
                        fill={colors.fill}
                        stroke={isSelected ? '#ffffff' : colors.stroke}
                        strokeWidth={isSelected ? '3' : '2'}
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="JetBrains Mono"
                      >
                        {shortLabel}
                      </text>
                      {/* Live reading tag next to sensor */}
                      <rect
                        x="20"
                        y="-10"
                        width="64"
                        height="20"
                        rx="4"
                        fill="#0f172a"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      <text
                        x="52"
                        y="3"
                        textAnchor="middle"
                        fill="#e2e8f0"
                        fontSize="10"
                        fontFamily="JetBrains Mono"
                      >
                        {sensor.pressure.toFixed(1)} bar
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>
        </div>

        {/* Right Side: Sensor Detail Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-mono text-sky-700 font-semibold">
                SELECTED TELEMETRY NODE
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Sensor {selectedSensor.id.replace('S-00', 'S0').replace('S-0', 'S')}
              </h2>
              <p className="text-xs text-slate-500">{selectedSensor.name}</p>
            </div>
            <StatusBadge status={selectedSensor.status} />
          </div>

          {/* Core Sensor Details matching prompt */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Zone</span>
              <span className="font-semibold text-slate-900">{selectedSensor.zoneName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 inline-flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-sky-600" />
                Pressure
              </span>
              <span className="font-mono tabular-nums font-bold text-slate-900">
                {selectedSensor.pressure.toFixed(1)} bar
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 inline-flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-600" />
                Flow
              </span>
              <span className="font-mono tabular-nums font-bold text-slate-900">
                {selectedSensor.flow} L/min
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Status</span>
              <StatusBadge status={selectedSensor.status} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Last Updated
              </span>
              <span className="font-mono tabular-nums text-slate-700">
                {selectedSensor.lastReading}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 inline-flex items-center gap-1.5">
                <Battery className="w-4 h-4 text-slate-400" />
                Battery / RSSI
              </span>
              <span className="font-mono tabular-nums text-xs text-slate-600">
                {selectedSensor.batteryLevel}% · {selectedSensor.signalStrength} dBm
              </span>
            </div>
          </div>

          {/* Quick Sensor Switcher */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-2">
              Quick Jump to Node:
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {sensors.slice(0, 10).map((s) => {
                const short = s.id.replace('S-00', 'S0').replace('S-0', 'S');
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSensorId(s.id)}
                    className={`py-1.5 text-xs font-mono font-medium rounded-md border transition-colors ${
                      s.id === selectedSensor.id
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {short}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => handleInspectLeak('L-001')}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Crosshair className="w-4 h-4" />
              <span>Localize Zone 3 Leak (L-001)</span>
            </button>
            <button
              onClick={() => navigate('/sensors')}
              className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              View Full Sensor Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
