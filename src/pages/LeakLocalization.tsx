import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crosshair,
  CheckCircle2,
  AlertOctagon,
  Map,
  Gauge,
  Activity,
  Droplets,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useWaterNetwork } from '../hooks/useWaterNetwork';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';

export const LeakLocalization: React.FC = () => {
  const {
    leaks,
    selectedLeakForLocalization,
    setSelectedLeakForLocalization,
    updateLeakStatus,
  } = useWaterNetwork();
  const navigate = useNavigate();

  const leak = selectedLeakForLocalization || leaks[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leak Localization"
        description="High-precision acoustic and hydraulic gradient fault isolation."
        breadcrumb="Leak Detection"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Select Incident:</span>
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
              {leaks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedLeakForLocalization(item)}
                  className={`px-3 py-1 text-xs font-mono font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    item.id === leak.id
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.id}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Top Identity Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-6 sm:gap-10">
          <div>
            <div className="text-xs text-slate-500">Leak ID</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
              {leak.id}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="text-xs text-slate-500">Zone</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{leak.zoneName}</div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="text-xs text-slate-500">Pipe</div>
            <div className="text-xl font-bold font-mono text-sky-700 mt-0.5">
              {leak.pipeId.replace('Pipe ', '')}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block" />
          <div>
            <div className="text-xs text-slate-500">Current Status</div>
            <div className="mt-1">
              <StatusBadge status={leak.status} size="md" />
            </div>
          </div>
        </div>

        {/* Action Buttons required by prompt */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => updateLeakStatus(leak.id, 'Investigating')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              leak.status === 'Investigating'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            Mark as Investigating
          </button>
          <button
            onClick={() => updateLeakStatus(leak.id, 'Resolved')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              leak.status === 'Resolved'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Mark as Resolved
          </button>
          <button
            onClick={() => navigate('/map')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Map className="w-3.5 h-3.5" />
            <span>View on Network Map</span>
          </button>
        </div>
      </div>

      {/* Main Visual Pipe Segment & Localization Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-sky-700">MOST LIKELY LOCATION</span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                "{leak.locationDescription}"
              </h2>
            </div>
            <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-2.5 text-right shrink-0">
              <div className="text-[11px] font-medium text-sky-800">Confidence Score</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-sky-700">
                {leak.confidence}%
              </div>
            </div>
          </div>

          {/* Visual Pipe Segment S03 ───────── 🔴 LEAK ───────── S04 */}
          <div className="bg-slate-900 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-6">
              <span>UPSTREAM TELEMETRY NODE: {leak.upstreamSensorId}</span>
              <span>SEGMENT: {leak.pipeId} (280m Cast-Iron Main)</span>
              <span>DOWNSTREAM NODE: {leak.downstreamSensorId}</span>
            </div>

            <div className="relative py-8 px-6">
              {/* Main Pipe Bar */}
              <div className="h-5 w-full bg-slate-800 rounded-full border border-slate-700 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-sky-600 to-red-600"
                  style={{ width: `${leak.localizationPosition}%` }}
                />
              </div>

              {/* Upstream Sensor Node (e.g., S03) */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-sky-600 border-2 border-white flex items-center justify-center font-mono font-bold text-sm shadow-md">
                  {leak.upstreamSensorId}
                </div>
                <span className="text-[11px] font-mono text-sky-300 mt-2">3.8 bar · 110 L/m</span>
              </div>

              {/* Rupture / Leak Marker in Middle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${leak.localizationPosition}%` }}
              >
                <div className="px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-mono font-bold mb-2 whitespace-nowrap border border-red-300">
                  LEAK ({leak.id})
                </div>
                <div className="w-11 h-11 rounded-full bg-red-600 border-2 border-fecaca flex items-center justify-center shadow-lg">
                  <AlertOctagon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-mono text-red-300 mt-2">
                  ~145m from {leak.upstreamSensorId}
                </span>
              </div>

              {/* Downstream Sensor Node (e.g., S04) */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-amber-600 border-2 border-white flex items-center justify-center font-mono font-bold text-sm shadow-md">
                  {leak.downstreamSensorId}
                </div>
                <span className="text-[11px] font-mono text-amber-300 mt-2">2.1 bar · 165 L/m</span>
              </div>
            </div>
          </div>

          {/* 5 Key Measurements Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Gauge className="w-3.5 h-3.5 text-red-600" />
                <span>Pressure Diff</span>
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-red-600">
                {leak.pressureDiffPercentage}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Activity className="w-3.5 h-3.5 text-amber-600" />
                <span>Flow Difference</span>
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-amber-600">
                +{leak.flowDiffPercentage}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                <span>Estimated Loss</span>
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {leak.estimatedLossRate.toLocaleString()} L/hr
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Duration</span>
              </div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {leak.duration}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-red-700 mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                <span>Severity</span>
              </div>
              <div className="text-lg font-bold font-mono text-red-700 uppercase">
                {leak.severity}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Localization Analysis Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crosshair className="w-4 h-4 text-sky-600" />
              <h3 className="text-base font-semibold text-slate-900">
                Localization Analysis
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Automated step-by-step hydraulic fault verification
            </p>

            <div className="space-y-3.5">
              {leak.analysisSteps.map((step, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900">
                        {step.step}
                      </span>
                      <span className="text-[11px] font-mono tabular-nums text-slate-400">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-slate-600">Model Confidence Score</span>
              <span className="font-mono tabular-nums font-bold text-sky-700">
                {leak.confidence}% Verified
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 rounded-full"
                style={{ width: `${leak.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
