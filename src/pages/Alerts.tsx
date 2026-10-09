import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Check,
  Crosshair,
} from 'lucide-react';
import { useWaterNetwork } from '../hooks/useWaterNetwork';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { AlertItem } from '../types';

export const Alerts: React.FC = () => {
  const {
    alerts,
    leaks,
    markAlertAsRead,
    resolveAlert,
    markAllAlertsRead,
    setSelectedLeakForLocalization,
  } = useWaterNetwork();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning' | 'Information' | 'Resolved'>('All');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const filteredAlerts = alerts.filter((item) => {
    if (filter === 'All') return true;
    if (filter === 'Resolved') return item.status === 'Resolved' || item.severity === 'Resolved';
    return item.severity === filter;
  });

  const handleViewLeak = (leakId?: string) => {
    if (leakId) {
      const target = leaks.find((l) => l.id === leakId);
      if (target) setSelectedLeakForLocalization(target);
    }
    navigate('/localization');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts & Notifications"
        description="Real-time hydraulic anomalies, pressure warnings, and sensor telemetry events."
        actions={
          <button
            onClick={markAllAlertsRead}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        }
      />

      {/* Segmented Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-3">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['All', 'Critical', 'Warning', 'Information', 'Resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filter === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-mono tabular-nums px-2">
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </span>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'Critical';
          const isWarning = alert.severity === 'Warning';
          const isResolved = alert.severity === 'Resolved' || alert.status === 'Resolved';

          return (
            <div
              key={alert.id}
              className={`bg-white border rounded-xl p-5 transition-colors ${
                alert.status === 'Unread' ? 'border-slate-300' : 'border-slate-200 opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isCritical
                        ? 'bg-red-50 text-red-600'
                        : isWarning
                        ? 'bg-amber-50 text-amber-600'
                        : isResolved
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-sky-50 text-sky-600'
                    }`}
                  >
                    {isCritical ? (
                      <AlertOctagon className="w-5 h-5" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isResolved ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <StatusBadge status={alert.severity} />
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-700">{alert.zoneName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{alert.timestamp}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-500">Status: {alert.status}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{alert.title}</h3>
                    <p className="text-sm text-slate-600">{alert.message}</p>

                    {alert.estimatedLoss && (
                      <div className="pt-1 text-xs font-mono tabular-nums text-red-700 font-semibold">
                        Estimated loss: {alert.estimatedLoss}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {alert.relatedLeakId && (
                    <button
                      onClick={() => handleViewLeak(alert.relatedLeakId)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>View Leak</span>
                    </button>
                  )}

                  {alert.status === 'Unread' && (
                    <button
                      onClick={() => markAlertAsRead(alert.id)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Mark as Read
                    </button>
                  )}

                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Resolve
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedAlert(alert)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Details Modal */}
      <Modal
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert ? selectedAlert.title : 'Alert Details'}
        subtitle={selectedAlert ? `Alert ID: ${selectedAlert.id} · ${selectedAlert.zoneName}` : ''}
      >
        {selectedAlert && (
          <div className="space-y-4 text-sm">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Severity:</span>
                <StatusBadge status={selectedAlert.severity} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-mono tabular-nums text-slate-900">
                  {selectedAlert.timestamp}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Zone:</span>
                <span className="font-semibold text-slate-900">{selectedAlert.zoneName}</span>
              </div>
              {selectedAlert.estimatedLoss && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Water Loss:</span>
                  <span className="font-mono font-bold text-red-600">
                    {selectedAlert.estimatedLoss}
                  </span>
                </div>
              )}
            </div>

            <p className="text-slate-700 leading-relaxed">{selectedAlert.message}</p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  resolveAlert(selectedAlert.id);
                  setSelectedAlert(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
