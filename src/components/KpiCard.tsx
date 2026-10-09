import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trendPercent?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendGood?: boolean;
  status?: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  trendPercent,
  trendDirection = 'neutral',
  trendGood = true,
  status,
  icon: Icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-xl p-4 transition-colors ${
        onClick ? 'cursor-pointer hover:border-sky-300' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-slate-500 truncate">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-slate-500 font-mono tabular-nums">
            {unit}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          {trendPercent && (
            <span
              className={`inline-flex items-center gap-0.5 font-mono tabular-nums font-medium ${
                trendGood ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              {trendPercent}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 truncate font-mono tabular-nums">{subtitle}</span>
          )}
        </div>

        {status && <StatusBadge status={status} size="sm" />}
      </div>
    </div>
  );
};
