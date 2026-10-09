import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Play, Pause, Zap } from 'lucide-react';
import { useWaterNetwork } from '../hooks/useWaterNetwork';

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const {
    unreadAlertCount,
    isSimulationRunning,
    toggleSimulation,
    triggerSimulatedAnomaly,
    lastTelemetryTick,
  } = useWaterNetwork();
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbLabel = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/map':
        return 'Network Topology Map';
      case '/leaks':
        return 'Leak Detection';
      case '/localization':
        return 'Leak Detection / Leak Localization';
      case '/consumption':
        return 'Consumption Analytics';
      case '/forecasting':
        return 'Consumption Forecasting';
      case '/alerts':
        return 'Alerts & Notifications';
      case '/sensors':
        return 'IoT Sensor Fleet';
      case '/zones':
        return 'Distribution Zones';
      case '/reports':
        return 'Performance Reports';
      case '/settings':
        return 'System Settings';
      default:
        return 'Operations Console';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-8 shrink-0">
      {/* Zone 1: Context / Mobile Trigger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm whitespace-nowrap truncate">
          <span className="font-semibold text-slate-900">Smart Water SCADA</span>
          <span className="text-slate-300" aria-hidden="true">/</span>
          <span className="text-slate-600 truncate">{getBreadcrumbLabel()}</span>
        </div>
      </div>

      {/* Zone 2: Live Telemetry Controls & Timestamp */}
      <div className="hidden md:flex items-center gap-4 text-xs text-slate-600 whitespace-nowrap shrink-0">
        <span className="font-mono tabular-nums text-slate-500">
          Last Sync: {lastTelemetryTick}
        </span>
        <span className="text-slate-300" aria-hidden="true">·</span>
        <button
          onClick={toggleSimulation}
          className="inline-flex items-center gap-1.5 text-slate-700 hover:text-sky-700 font-medium transition-colors whitespace-nowrap shrink-0"
        >
          {isSimulationRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 text-sky-600" />
              <span>Live Telemetry Active</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-slate-500" />
              <span>Telemetry Paused</span>
            </>
          )}
        </button>
        <span className="text-slate-300" aria-hidden="true">·</span>
        <button
          onClick={triggerSimulatedAnomaly}
          className="inline-flex items-center gap-1 text-slate-600 hover:text-amber-700 font-medium transition-colors whitespace-nowrap shrink-0"
          title="Inject realistic hydraulic pressure dip in Zone 3"
        >
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>Simulate Pressure Spike</span>
        </button>
      </div>

      {/* Zone 3: Primary Action (Alerts) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => navigate('/alerts')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
        >
          <Bell className="w-3.5 h-3.5 text-sky-700" />
          <span>Alerts</span>
          {unreadAlertCount > 0 && (
            <span className="font-mono tabular-nums font-bold text-red-600">
              ({unreadAlertCount})
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
