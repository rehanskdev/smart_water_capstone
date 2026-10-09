import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  controls,
  children,
  footer,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {controls && <div className="flex items-center gap-2 shrink-0">{controls}</div>}
        </div>
        <div className="w-full">{children}</div>
      </div>
      {footer && <div className="mt-4 pt-4 border-t border-slate-100">{footer}</div>}
    </div>
  );
};
