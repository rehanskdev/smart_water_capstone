import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  WifiOff,
  Search,
  Activity,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const normalized = status.toLowerCase();

  let textColor = 'text-slate-700';
  let Icon = Activity;

  if (
    normalized === 'normal' ||
    normalized === 'online' ||
    normalized === 'good' ||
    normalized === 'resolved' ||
    normalized === 'low'
  ) {
    textColor = 'text-emerald-700';
    Icon = CheckCircle2;
  } else if (
    normalized === 'warning' ||
    normalized === 'investigating' ||
    normalized === 'medium' ||
    normalized === 'attention required'
  ) {
    textColor = 'text-amber-700';
    Icon = normalized === 'investigating' ? Search : AlertTriangle;
  } else if (
    normalized === 'critical' ||
    normalized === 'active' ||
    normalized === 'high'
  ) {
    textColor = 'text-red-700';
    Icon = AlertOctagon;
  } else if (normalized === 'offline') {
    textColor = 'text-slate-500';
    Icon = WifiOff;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium whitespace-nowrap shrink-0 ${textColor} ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      }`}
    >
      <Icon className={size === 'sm' ? 'w-3.5 h-3.5 shrink-0' : 'w-4 h-4 shrink-0'} />
      <span>{status}</span>
    </span>
  );
};
