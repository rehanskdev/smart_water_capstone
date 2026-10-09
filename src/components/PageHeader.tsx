import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumb?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumb = 'Municipal SCADA Network',
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 mb-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>{breadcrumb}</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700 font-medium">{title}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-600 mt-0.5">{description}</p>
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};
