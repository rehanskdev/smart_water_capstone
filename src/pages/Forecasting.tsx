import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Activity,
  CheckCircle2,
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
} from 'recharts';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { forecastService } from '../services/forecastService';
import { ForecastPoint } from '../types';

export const Forecasting: React.FC = () => {
  const [horizon, setHorizon] = useState<'24H' | '7D' | '30D'>('7D');
  const [forecastData, setForecastData] = useState<ForecastPoint[]>([]);

  useEffect(() => {
    forecastService.getForecastData(horizon).then(setForecastData);
  }, [horizon]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consumption Forecasting"
        description="Predict future water demand using historical consumption patterns."
        actions={
          <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs">
            <div>
              <span className="text-slate-500">Forecast model: </span>
              <span className="font-semibold text-slate-900">Time-Series Forecasting</span>
            </div>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <div className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Status: Model Updated</span>
            </div>
          </div>
        }
      />

      {/* Top 5 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Tomorrow's Forecast"
          value="118,450"
          unit="L"
          trendPercent="+8.9%"
          trendDirection="up"
          trendGood={true}
          icon={TrendingUp}
        />
        <KpiCard
          title="7-Day Forecast"
          value="824,300"
          unit="L"
          subtitle="Cumulative"
          icon={Calendar}
        />
        <KpiCard
          title="Expected Peak"
          value="2:00 PM"
          subtitle="9,240 L/hr"
          icon={Clock}
        />
        <KpiCard
          title="Forecast Accuracy"
          value="94.2%"
          status="Good"
          icon={Target}
        />
        <KpiCard
          title="MAPE"
          value="5.8%"
          subtitle="Mean Abs Error"
          status="Normal"
          icon={Activity}
        />
      </div>

      {/* Main Forecast Chart with Horizon Selector */}
      <ChartCard
        title="Historical vs Forecasted Water Demand & 95% Confidence Interval"
        subtitle="Solid blue line denotes metered historical consumption; dashed cyan line and shaded band represent time-series demand predictions"
        controls={
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {[
              { key: '24H', label: '24 Hours' },
              { key: '7D', label: '7 Days' },
              { key: '30D', label: '30 Days' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setHorizon(item.key as '24H' | '7D' | '30D')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  horizon === item.key
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k L`}
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

              <Area
                type="monotone"
                dataKey="upperBound"
                name="Confidence Upper Bound"
                stroke="none"
                fill="#e0f2fe"
                fillOpacity={0.7}
              />
              <Line
                type="monotone"
                dataKey="historical"
                name="Historical Consumption"
                stroke="#0f172a"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0f172a' }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="Forecasted Consumption"
                stroke="#0284c7"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                dot={{ r: 4, fill: '#0284c7' }}
              />
              <Line
                type="monotone"
                dataKey="lowerBound"
                name="Confidence Lower Bound"
                stroke="#94a3b8"
                strokeWidth={1.2}
                strokeDasharray="3 3"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Forecast Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Forecast Validation & Projection Table
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Predicted demand with 95% confidence bounds and historical residual error verification
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-2.5 pr-4">Date</th>
                <th className="py-2.5 px-4 text-right">Predicted Consumption</th>
                <th className="py-2.5 px-4 text-right">Lower Bound</th>
                <th className="py-2.5 px-4 text-right">Upper Bound</th>
                <th className="py-2.5 px-4 text-right">Actual</th>
                <th className="py-2.5 pl-4 text-right">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {forecastData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 pr-4 font-semibold text-slate-900 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-sky-700 whitespace-nowrap">
                    {row.predicted.toLocaleString()} L
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">
                    {row.lowerBound.toLocaleString()} L
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap">
                    {row.upperBound.toLocaleString()} L
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 whitespace-nowrap">
                    {row.actual !== null && row.actual !== undefined
                      ? `${row.actual.toLocaleString()} L`
                      : 'Pending'}
                  </td>
                  <td className="py-3 pl-4 text-right font-mono tabular-nums whitespace-nowrap">
                    {row.errorPercentage !== null && row.errorPercentage !== undefined ? (
                      <span className="text-emerald-700 font-medium">
                        {row.errorPercentage.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
