import React, { useState } from 'react';
import { Save, RotateCcw, CheckCircle2, Server } from 'lucide-react';
import { useWaterNetwork } from '../hooks/useWaterNetwork';
import { PageHeader } from '../components/PageHeader';
import { INITIAL_SETTINGS } from '../data/mockData';
import { SystemSettings } from '../types';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useWaterNetwork();
  const [formState, setFormState] = useState<SystemSettings>(settings);
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handleReset = () => {
    setFormState(INITIAL_SETTINGS);
    updateSettings(INITIAL_SETTINGS);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure municipal SCADA parameters, leak detection thresholds, and operator preferences."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        }
      />

      {savedBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>System configuration and hydraulic alert thresholds saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. General */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-semibold text-slate-900">General</h2>
            <p className="text-xs text-slate-500">System identity and regional localization</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">System Name</label>
              <input
                type="text"
                value={formState.general.systemName}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    general: { ...formState.general, systemName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Timezone</label>
              <select
                value={formState.general.timezone}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    general: { ...formState.general, timezone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              >
                <option value="Asia/Kolkata (UTC+05:30)">Asia/Kolkata (UTC+05:30)</option>
                <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
                <option value="Europe/Berlin (UTC+01:00)">Europe/Berlin (UTC+01:00)</option>
                <option value="America/New_York (UTC-05:00)">America/New_York (UTC-05:00)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Date Format</label>
              <select
                value={formState.general.dateFormat}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    general: { ...formState.general, dateFormat: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              >
                <option value="DD/MM/YYYY (24-Hour)">DD/MM/YYYY (24-Hour)</option>
                <option value="MM/DD/YYYY (12-Hour)">MM/DD/YYYY (12-Hour)</option>
                <option value="YYYY-MM-DD (ISO 8601)">YYYY-MM-DD (ISO 8601)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Alert Thresholds */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-semibold text-slate-900">Alert Thresholds</h2>
            <p className="text-xs text-slate-500">
              Automated anomaly triggers for leak detection and pressure warnings
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Leak Detection Threshold (% Flow Divergence)
              </label>
              <input
                type="number"
                step="0.5"
                value={formState.thresholds.leakDetectionThresholdPercent}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    thresholds: {
                      ...formState.thresholds,
                      leakDetectionThresholdPercent: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Pressure Warning Threshold (bar)
              </label>
              <input
                type="number"
                step="0.1"
                value={formState.thresholds.pressureWarningThresholdBar}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    thresholds: {
                      ...formState.thresholds,
                      pressureWarningThresholdBar: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                High Consumption Threshold (Liters / Zone / Day)
              </label>
              <input
                type="number"
                step="500"
                value={formState.thresholds.highConsumptionThresholdLiters}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    thresholds: {
                      ...formState.thresholds,
                      highConsumptionThresholdLiters: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Notifications */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-semibold text-slate-900">Notifications</h2>
            <p className="text-xs text-slate-500">Operator dispatch and daily reporting channels</p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              {
                key: 'emailAlerts' as const,
                title: 'Email Alerts',
                desc: 'Send automated dispatch emails to control room engineers',
              },
              {
                key: 'criticalLeakAlerts' as const,
                title: 'Critical Leak Alerts',
                desc: 'Immediate high-priority push notification when pipe rupture > 500 L/hr',
              },
              {
                key: 'dailyReports' as const,
                title: 'Daily Reports',
                desc: 'Automatically compile and archive PDF network summary at 00:00',
              },
            ].map((item) => {
              const checked = formState.notifications[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    <div className="text-slate-500 mt-0.5">{item.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormState({
                        ...formState,
                        notifications: {
                          ...formState.notifications,
                          [item.key]: !checked,
                        },
                      })
                    }
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                      checked ? 'bg-sky-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Network Configuration & 5. Account */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Network Configuration</h2>
                <p className="text-xs text-slate-500">Physical infrastructure parameters</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-700">
                <Server className="w-3.5 h-3.5" /> Spring Boot API Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Number of Zones</label>
                <input
                  type="number"
                  value={formState.networkConfig.numberOfZones}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      networkConfig: {
                        ...formState.networkConfig,
                        numberOfZones: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Number of Sensors</label>
                <input
                  type="number"
                  value={formState.networkConfig.numberOfSensors}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      networkConfig: {
                        ...formState.networkConfig,
                        numberOfSensors: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Supply Capacity (L)
                </label>
                <input
                  type="number"
                  value={formState.networkConfig.waterSupplyCapacityLiters}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      networkConfig: {
                        ...formState.networkConfig,
                        waterSupplyCapacityLiters: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900">Account</h2>
              <p className="text-xs text-slate-500">Active operator credentials</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formState.account.name}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      account: { ...formState.account, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formState.account.email}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      account: { ...formState.account, email: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Role</label>
                <input
                  type="text"
                  value={formState.account.role}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      account: { ...formState.account, role: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
