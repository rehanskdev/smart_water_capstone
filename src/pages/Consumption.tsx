import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Droplets,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { useWaterNetwork } from '../hooks/useWaterNetwork';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { CONSUMPTION_7D, CONSUMPTION_30D, HEATMAP_DATA } from '../data/mockData';

export const Consumption: React.FC = () => {
  const { consumption24h, zones, sensors } = useWaterNetwork();

  const [interval, setInterval] = useState<'Hourly' | 'Daily' | 'Weekly' | 'Monthly'>('Hourly');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedSensor, setSelectedSensor] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<string>('Oct 02 - Oct 08, 2026');

  // Scale data slightly when filtering by zone so controls feel responsive and real
  const zoneMultiplier =
    selectedZone === 'ALL'
      ? 1
      : selectedZone === 'Zone 1'
      ? 0.22
      : selectedZone === 'Zone 2'
      ? 0.20
      : selectedZone === 'Zone 3'
      ? 0.26
      : selectedZone === 'Zone 4'
      ? 0.15
      : 0.17;

  const baseData =
    interval === 'Hourly'
      ? consumption24h
      : interval === 'Daily'
      ? CONSUMPTION_7D
      : CONSUMPTION_30D;

  const chartData = baseData.map((pt) => ({
    ...pt,
    actual: Math.round(pt.actual * zoneMultiplier),
    previous: Math.round(pt.previous * zoneMultiplier),
  }));

  const getHeatmapColor = (val: number) => {
    if (val >= 85) return 'bg-sky-700 text-white';
    if (val >= 70) return 'bg-sky-500 text-white';
    if (val >= 50) return 'bg-sky-300 text-slate-900';
    if (val >= 30) return 'bg-sky-100 text-slate-800';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consumption Analytics"
        description="Analyze historical water usage across the network."
      />

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="Oct 08, 2026 (Today)">Oct 08, 2026 (Today)</option>
            <option value="Oct 02 - Oct 08, 2026">Oct 02 - Oct 08, 2026 (Last 7 Days)</option>
            <option value="Sep 09 - Oct 08, 2026">Sep 09 - Oct 08, 2026 (Last 30 Days)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Distribution Zone
          </label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Zones (Network Total)</option>
            {zones.map((z) => (
              <option key={z.id} value={z.name}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Sensor Node
          </label>
          <select
            value={selectedSensor}
            onChange={(e) => setSelectedSensor(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Metering Sensors (48)</option>
            {sensors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} — {s.zoneName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Time Interval
          </label>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['Hourly', 'Daily', 'Weekly', 'Monthly'] as const).map((item) => (
              <button
                key={item}
                onClick={() => setInterval(item)}
                className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  interval === item
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Average Consumption"
          value={Math.round(4530 * zoneMultiplier).toLocaleString()}
          unit="L/hr"
          status="Normal"
          icon={BarChart3}
        />
        <KpiCard
          title="Peak Consumption"
          value={Math.round(9420 * zoneMultiplier).toLocaleString()}
          unit="L/hr"
          status="Warning"
          icon={TrendingUp}
        />
        <KpiCard
          title="Lowest Consumption"
          value={Math.round(2410 * zoneMultiplier).toLocaleString()}
          unit="L/hr"
          status="Normal"
          icon={TrendingDown}
        />
        <KpiCard
          title="Total Consumption"
          value={Math.round(108750 * zoneMultiplier).toLocaleString()}
          unit="L"
          status="Normal"
          icon={Droplets}
        />
        <KpiCard
          title="Peak Usage Time"
          value="10:00 AM"
          subtitle="Morning Ramp"
          icon={Clock}
        />
      </div>

      {/* Main Chart: Water Consumption Over Time */}
      <ChartCard
        title="Water Consumption Over Time"
        subtitle={`Showing ${interval.toLowerCase()} volumetric consumption for ${
          selectedZone === 'ALL' ? 'all 5 municipal zones' : selectedZone
        } (${dateRange})`}
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
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
                tickFormatter={(v) => `${v.toLocaleString()} L`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: number) => [`${val.toLocaleString()} L`, '']}
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="Metered Consumption"
                stroke="#0284c7"
                fill="#e0f2fe"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Bottom Split: Zone Comparison Bar Chart + Day × Hour Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Zone Consumption Comparison"
          subtitle="Daily volumetric distribution across Zone 1 to Zone 5 (Liters)"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zones} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: number) => [`${val.toLocaleString()} L`, 'Daily Consumption']}
                />
                <Bar dataKey="consumption" radius={[6, 6, 0, 0]}>
                  {zones.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={
                        entry.status === 'Critical'
                          ? '#dc2626'
                          : entry.status === 'Warning'
                          ? '#d97706'
                          : '#0284c7'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Day × Hour Consumption Intensity Heatmap */}
        <ChartCard
          title="Consumption Intensity Matrix (Day × Hour)"
          subtitle="Normalized hourly demand utilization (% of peak hydraulic capacity)"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="text-xs font-mono text-slate-500">
                  <th className="py-1.5 pr-3 text-left">Day</th>
                  {['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'].map((hr) => (
                    <th key={hr} className="py-1.5 px-1.5 font-medium">
                      {hr}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs font-mono tabular-nums">
                {HEATMAP_DATA.map((row) => (
                  <tr key={row.day}>
                    <td className="py-1.5 pr-3 text-left font-sans font-semibold text-slate-700">
                      {row.day}
                    </td>
                    {row.hours.map((cell) => (
                      <td key={cell.hour} className="p-1">
                        <div
                          className={`py-1.5 rounded-md font-semibold ${getHeatmapColor(
                            cell.value
                          )}`}
                          title={`${row.day} @ ${cell.hour}: ${cell.value}% capacity`}
                        >
                          {cell.value}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
