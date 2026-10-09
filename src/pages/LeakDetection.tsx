import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  Activity,
  CheckCircle2,
  Droplets,
  Crosshair,
  Eye,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from 'recharts';
import { useWaterNetwork } from '../hooks/useWaterNetwork';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { LeakEvent } from '../types';

export const LeakDetection: React.FC = () => {
  const { leaks, consumption24h, setSelectedLeakForLocalization, updateLeakStatus } =
    useWaterNetwork();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Investigating' | 'Resolved'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalLeak, setModalLeak] = useState<LeakEvent | null>(null);

  const activeLeaksCount = leaks.filter((l) => l.status === 'Active' || l.status === 'Investigating').length;

  const filteredLeaks = leaks.filter((leak) => {
    const matchesStatus = statusFilter === 'ALL' || leak.status === statusFilter;
    const matchesSearch =
      leak.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leak.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leak.pipeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenLocalizationPage = (leak: LeakEvent) => {
    setSelectedLeakForLocalization(leak);
    navigate('/localization');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leak Detection"
        description="Identify abnormal flow and pressure patterns across the network."
        actions={
          <button
            onClick={() => navigate('/localization')}
            className="px-3.5 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Open Leak Localization</span>
          </button>
        }
      />

      {/* Top 4 Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Leaks"
          value={activeLeaksCount}
          status="Critical"
          icon={AlertOctagon}
        />
        <KpiCard
          title="Detected Today"
          value={4}
          subtitle="2 High / Med"
          status="Warning"
          icon={Activity}
        />
        <KpiCard
          title="Resolved"
          value={12}
          subtitle="Last 30 Days"
          status="Normal"
          icon={CheckCircle2}
        />
        <KpiCard
          title="Estimated Water Loss"
          value="3,850"
          unit="L/hr"
          trendPercent="+14.2%"
          trendDirection="up"
          trendGood={false}
          status="Critical"
          icon={Droplets}
        />
      </div>

      {/* Large Leak Monitoring Chart */}
      <ChartCard
        title="Hydraulic Flow Divergence & Leak Signature Monitor"
        subtitle="Comparing Normal Flow, Expected Flow, and Actual Metered Flow — Red shaded window highlights abnormal flow divergence (09:00–11:00)"
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={consumption24h} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v} L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value.toLocaleString()} L/hr`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              {/* Highlight abnormal leak region between 08:00 and 12:00 */}
              <ReferenceArea
                x1="08:00"
                x2="12:00"
                fill="#fee2e2"
                fillOpacity={0.55}
                stroke="#ef4444"
                strokeDasharray="3 3"
              />

              <Area
                type="monotone"
                dataKey="normalFlow"
                name="Normal Flow"
                fill="#e0f2fe"
                stroke="#38bdf8"
                strokeWidth={1.5}
              />
              <Line
                type="monotone"
                dataKey="expected"
                name="Expected Flow"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual Flow"
                stroke="#dc2626"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#dc2626' }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Leak Registry Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Detected Leak Incidents</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click "View" to inspect telemetry anomalies or localize the pipe segment
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ID, zone, pipe..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(['ALL', 'Active', 'Investigating', 'Resolved'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status === 'ALL' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-2.5 pr-4">Leak ID</th>
                <th className="py-2.5 px-4">Zone</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4">Detected</th>
                <th className="py-2.5 px-4">Severity</th>
                <th className="py-2.5 px-4 text-right">Water Loss</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLeaks.map((leak) => (
                <tr key={leak.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 pr-4 font-mono tabular-nums font-bold text-slate-900 whitespace-nowrap">
                    {leak.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                    {leak.zoneName}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-700 whitespace-nowrap">
                    {leak.pipeId}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-xs text-slate-600 whitespace-nowrap">
                    {leak.detectedAt}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={leak.severity} />
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                    {leak.estimatedLossRate.toLocaleString()} L/hr
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={leak.status} />
                  </td>
                  <td className="py-3 pl-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setModalLeak(leak)}
                        className="px-3 py-1 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleOpenLocalizationPage(leak)}
                        className="px-3 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors inline-flex items-center gap-1"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        <span>Localize</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Leak Modal when clicking "View" */}
      <Modal
        isOpen={!!modalLeak}
        onClose={() => setModalLeak(null)}
        title={modalLeak ? `Leak Incident ${modalLeak.id} — ${modalLeak.zoneName}` : 'Leak Details'}
        subtitle={modalLeak ? `${modalLeak.pipeId} (${modalLeak.locationDescription})` : ''}
        maxWidth="xl"
      >
        {modalLeak && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
              <div>
                <div className="text-slate-500">Confidence</div>
                <div className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                  {modalLeak.confidence}%
                </div>
              </div>
              <div>
                <div className="text-slate-500">Pressure Diff</div>
                <div className="text-base font-bold font-mono tabular-nums text-red-600 mt-0.5">
                  {modalLeak.pressureDiffPercentage}%
                </div>
              </div>
              <div>
                <div className="text-slate-500">Flow Diff</div>
                <div className="text-base font-bold font-mono tabular-nums text-amber-600 mt-0.5">
                  +{modalLeak.flowDiffPercentage}%
                </div>
              </div>
              <div>
                <div className="text-slate-500">Est. Loss</div>
                <div className="text-base font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                  {modalLeak.estimatedLossRate.toLocaleString()} L/hr
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 mb-2">
                DIAGNOSTIC TELEMETRY TIMELINE
              </h4>
              <div className="space-y-2">
                {modalLeak.analysisSteps.map((step, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-slate-200 bg-white flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{step.step}</div>
                      <div className="text-slate-600 mt-0.5">{step.detail}</div>
                    </div>
                    <span className="font-mono tabular-nums text-slate-400 shrink-0">
                      {step.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateLeakStatus(modalLeak.id, 'Investigating');
                    setModalLeak({ ...modalLeak, status: 'Investigating' });
                  }}
                  className="px-3.5 py-2 text-xs font-medium bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  Mark as Investigating
                </button>
                <button
                  onClick={() => {
                    updateLeakStatus(modalLeak.id, 'Resolved');
                    setModalLeak({ ...modalLeak, status: 'Resolved' });
                  }}
                  className="px-3.5 py-2 text-xs font-medium bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  Mark as Resolved
                </button>
              </div>

              <button
                onClick={() => {
                  const target = modalLeak;
                  setModalLeak(null);
                  handleOpenLocalizationPage(target);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
              >
                Open Full Localization View →
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
