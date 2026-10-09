import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Droplets,
  Crosshair,
  BarChart3,
  TrendingUp,
  Bell,
  Radio,
  Building2,
  FileText,
  Settings,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useWaterNetwork } from '../hooks/useWaterNetwork';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { unreadAlertCount, activeLeakCount, settings, isSimulationRunning } = useWaterNetwork();
  const location = useLocation();

  const isLeakRoute =
    location.pathname.startsWith('/leaks') || location.pathname.startsWith('/localization');

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Network Map', path: '/map', icon: Map },
    {
      name: 'Leak Detection',
      path: '/leaks',
      icon: Droplets,
      count: activeLeakCount > 0 ? activeLeakCount : undefined,
      subItems: [
        { name: 'Leak Localization', path: '/localization', icon: Crosshair },
      ],
    },
    { name: 'Consumption', path: '/consumption', icon: BarChart3 },
    { name: 'Forecasting', path: '/forecasting', icon: TrendingUp },
    {
      name: 'Alerts',
      path: '/alerts',
      icon: Bell,
      count: unreadAlertCount > 0 ? unreadAlertCount : undefined,
    },
    { name: 'Sensors', path: '/sensors', icon: Radio },
    { name: 'Zones', path: '/zones', icon: Building2 },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 w-64 select-none border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white leading-tight">
              SMART WATER
            </div>
            <div className="text-xs font-medium text-sky-400 tracking-wide">
              NETWORK
            </div>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.count !== undefined && (
                  <span className="text-xs font-mono tabular-nums font-semibold text-sky-300">
                    {item.count}
                  </span>
                )}
              </NavLink>

              {/* Sub-navigation for Leak Localization */}
              {item.subItems && (
                <div className={`mt-1 ml-5 pl-3 border-l border-slate-700 space-y-1 ${isLeakRoute ? 'block' : 'block'}`}>
                  {item.subItems.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                            isActive
                              ? 'bg-slate-800 text-sky-400'
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                          }`
                        }
                      >
                        <SubIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>{sub.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer User Profile & System Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-sky-400 flex items-center justify-center text-xs font-bold shrink-0">
            {settings.account.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {settings.account.name}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {settings.account.role}
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">System Status:</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isSimulationRunning ? 'Online' : 'Paused'}</span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block shrink-0">{sidebarContent}</aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 flex">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
