import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplets,
  Gauge,
  AlertTriangle,
  AlertOctagon,
  HeartPulse,
  Radio,
  ArrowRight,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useWaterNetwork } from '../hooks/useWaterNetwork';
import { KpiCard } from '../components/KpiCard';
import { PageHeader } from '../components/PageHeader';
import { ChartCard } from '../components/ChartCard';
import { StatusBadge } from '../components/StatusBadge';
import { CONSUMPTION_7D, CONSUMPTION_30D } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const {
    totalSupplied,
    totalConsumption,
    waterLossLiters,
    waterLossPercentage,
    activeLeakCount,
    networkHealth,
    activeSensorCount,
    totalSensorCount,
    consumption24h,
    alerts,
    zones,
  } = useWaterNetwork();

  const navigate = useNavigate();
  const [timeHorizon, setTimeHorizon] = useState<'24H' | '7D' | '30D'>('24H');

  const chartData =
    timeHorizon === '24H'
      ? consumption24h
      : timeHorizon === '7D'
      ? CONSUMPTION_7D
      : CONSUMPTION_30D;

  // SVG Circular Gauge math
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (networkHealth / 100) * circumference;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your water distribution network."
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-mono tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Oct 08, 2026</span>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Open Network Map
            </button>
          </div>
        }
      />

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Water Supplied"
          value={totalSupplied.toLocaleString()}
          unit="L"
          trendPercent="+2.4%"
          trendDirection="up"
          trendGood={true}
          status="Normal"
          icon={Droplets}
        />
        <KpiCard
          title="Total Consumption"
          value={totalConsumption.toLocaleString()}
          unit="L"
          trendPercent="+1.8%"
          trendDirection="up"
          trendGood={true}
          status="Normal"
          icon={Gauge}
          onClick={() => navigate('/consumption')}
        />
        <KpiCard
          title="Water Loss"
          value={waterLossLiters.toLocaleString()}
          unit="L"
          subtitle={`${waterLossPercentage}%`}
          trendPercent="+0.9%"
          trendDirection="up"
          trendGood={false}
          status="Warning"
          icon={AlertTriangle}
          onClick={() => navigate('/leaks')}
        />
        <KpiCard
          title="Active Leaks"
          value={activeLeakCount}
          trendPercent="Zone 3, 5"
          trendGood={false}
          status="Critical"
          icon={AlertOctagon}
          onClick={() => navigate('/leaks')}
        />
        <KpiCard
          title="Network Health"
          value={`${networkHealth}%`}
          trendPercent="Stable"
          trendGood={true}
          status="Good"
          icon={HeartPulse}
        />
        <KpiCard
          title="Active Sensors"
          value={`${activeSensorCount} / ${totalSensorCount}`}
          subtitle="95.8%"
          status="Online"
          icon={Radio}
          onClick={() => navigate('/sensors')}
        />
      </div>

      {/* Main Row: Water Consumption Chart + Network Health Circular Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Water Consumption Chart"
            subtitle="Comparison of actual metered demand vs previous period baseline (Liters)"
            controls={
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                {(['24H', '7D', '30D'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeHorizon(range)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      timeHorizon === range
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            }
          >
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
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
                    tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value.toLocaleString()} L`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual Consumption"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#0284c7' }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="previous"
                    name="Previous Period"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Network Health Circular Progress Indicator */}
        <ChartCard
          title="Network Health"
          subtitle="Composite hydraulic & telemetry index"
        >
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="12"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke="#0284c7"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
                  {networkHealth}%
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  Network Health
                </span>
              </div>
            </div>

            <div className="w-full mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Pressure</span>
                <StatusBadge status="Normal" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Flow</span>
                <StatusBadge status="Normal" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Sensors</span>
                <span className="font-mono tabular-nums font-semibold text-emerald-700">
                  96% Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Leakage</span>
                <StatusBadge status="Warning" />
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Row: Active Alerts + Zone Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Active Alerts</h2>
                <p className="text-xs text-slate-500 mt-0.5">Recent network telemetry events</p>
              </div>
              <button
                onClick={() => navigate('/alerts')}
                className="text-xs font-medium text-sky-700 hover:text-sky-800 inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {alerts.slice(0, 4).map((alert) => {
                const isCritical = alert.severity === 'Critical';
                const isWarning = alert.severity === 'Warning';

                return (
                  <div
                    key={alert.id}
                    onClick={() =>
                      alert.relatedLeakId
                        ? navigate('/localization')
                        : navigate('/alerts')
                    }
                    className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {isCritical ? (
                        <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {alert.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {alert.message}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-slate-500 shrink-0">
                      {alert.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Real-time SCADA alarm feed</span>
            <button
              onClick={() => navigate('/localization')}
              className="text-sky-700 hover:underline font-medium"
            >
              Inspect Zone 3 Leak →
            </button>
          </div>
        </div>

        {/* Zone Performance Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Zone Performance</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                District Metered Area (DMA) consumption, pressure, and water loss metrics
              </p>
            </div>
            <button
              onClick={() => navigate('/zones')}
              className="text-xs font-medium text-sky-700 hover:text-sky-800 inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>Manage Zones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-2.5 pr-4">Zone</th>
                  <th className="py-2.5 px-4 text-right">Consumption</th>
                  <th className="py-2.5 px-4 text-right">Pressure</th>
                  <th className="py-2.5 px-4 text-right">Water Loss</th>
                  <th className="py-2.5 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {zones.map((zone) => (
                  <tr
                    key={zone.id}
                    onClick={() => navigate('/zones')}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 pr-4 font-semibold text-slate-900 whitespace-nowrap">
                      {zone.name}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      {zone.consumption.toLocaleString()} L
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      {zone.pressure.toFixed(1)} bar
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      {zone.waterLossPercentage.toFixed(1)}%
                    </td>
                    <td className="py-3 pl-4 text-right whitespace-nowrap">
                      <StatusBadge status={zone.status} />
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
