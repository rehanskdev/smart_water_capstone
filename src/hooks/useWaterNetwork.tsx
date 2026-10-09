import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Sensor,
  Zone,
  LeakEvent,
  AlertItem,
  ConsumptionPoint,
  ForecastPoint,
  ReportItem,
  SystemSettings,
} from '../types';
import {
  INITIAL_SENSORS,
  INITIAL_ZONES,
  INITIAL_LEAKS,
  INITIAL_ALERTS,
  CONSUMPTION_24H,
  FORECAST_DATA_7D,
  REPORTS_LIST,
  INITIAL_SETTINGS,
} from '../data/mockData';

interface WaterNetworkContextType {
  sensors: Sensor[];
  zones: Zone[];
  leaks: LeakEvent[];
  alerts: AlertItem[];
  consumption24h: ConsumptionPoint[];
  forecast7d: ForecastPoint[];
  reports: ReportItem[];
  settings: SystemSettings;
  totalSupplied: number;
  totalConsumption: number;
  waterLossLiters: number;
  waterLossPercentage: number;
  activeLeakCount: number;
  networkHealth: number;
  activeSensorCount: number;
  totalSensorCount: number;
  unreadAlertCount: number;
  isSimulationRunning: boolean;
  lastTelemetryTick: string;
  selectedLeakForLocalization: LeakEvent;
  setSelectedLeakForLocalization: (leak: LeakEvent) => void;
  toggleSimulation: () => void;
  triggerSimulatedAnomaly: () => void;
  updateLeakStatus: (leakId: string, status: LeakEvent['status']) => void;
  markAlertAsRead: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  markAllAlertsRead: () => void;
  updateSettings: (newSettings: SystemSettings) => void;
  generateCustomReport: (type: ReportItem['type']) => void;
}

const WaterNetworkContext = createContext<WaterNetworkContextType | undefined>(undefined);

export const WaterNetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sensors, setSensors] = useState<Sensor[]>(INITIAL_SENSORS);
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [leaks, setLeaks] = useState<LeakEvent[]>(INITIAL_LEAKS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [consumption24h, setConsumption24h] = useState<ConsumptionPoint[]>(CONSUMPTION_24H);
  const [forecast7d] = useState<ForecastPoint[]>(FORECAST_DATA_7D);
  const [reports, setReports] = useState<ReportItem[]>(REPORTS_LIST);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);
  const [lastTelemetryTick, setLastTelemetryTick] = useState<string>('10:42:15 AM');
  const [selectedLeakForLocalization, setSelectedLeakForLocalization] = useState<LeakEvent>(INITIAL_LEAKS[0]);

  const [totalSupplied, setTotalSupplied] = useState<number>(125400);
  const [totalConsumption, setTotalConsumption] = useState<number>(108750);

  // Live telemetry simulation every 4.5 seconds
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const shortTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastTelemetryTick(timeStr);

      // Slightly fluctuate sensor readings within realistic hydraulic bounds
      setSensors((prevSensors) =>
        prevSensors.map((sensor) => {
          if (sensor.status === 'Offline') return sensor;
          const pressureDelta = (Math.random() - 0.49) * 0.06;
          const flowDelta = Math.round((Math.random() - 0.48) * 2);
          const nextPressure = Math.max(1.2, Math.min(5.5, Number((sensor.pressure + pressureDelta).toFixed(2))));
          const nextFlow = Math.max(40, Math.min(220, sensor.flow + flowDelta));

          return {
            ...sensor,
            pressure: nextPressure,
            flow: nextFlow,
            lastReading: shortTime,
          };
        })
      );

      // Slightly fluctuate zone consumption & pressure
      setZones((prevZones) =>
        prevZones.map((zone) => {
          const consDelta = Math.round((Math.random() - 0.45) * 35);
          const pressDelta = (Math.random() - 0.5) * 0.04;
          const nextCons = Math.max(10000, zone.consumption + consDelta);
          const nextPress = Number(Math.max(1.5, Math.min(5.0, zone.pressure + pressDelta)).toFixed(1));
          return {
            ...zone,
            consumption: nextCons,
            pressure: nextPress,
          };
        })
      );

      // Fluctuate top-level supplied & consumption slightly around 125,400 L and 108,750 L
      setTotalSupplied((prev) => {
        const delta = Math.round((Math.random() - 0.47) * 45);
        return Math.max(124000, prev + delta);
      });
      setTotalConsumption((prev) => {
        const delta = Math.round((Math.random() - 0.47) * 38);
        return Math.max(107000, prev + delta);
      });

      // Update latest consumption point
      setConsumption24h((prev) =>
        prev.map((pt, idx) => {
          if (idx === prev.length - 1) {
            const delta = Math.round((Math.random() - 0.48) * 30);
            return { ...pt, actual: Math.max(4000, pt.actual + delta) };
          }
          return pt;
        })
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  const waterLossLiters = Math.max(0, totalSupplied - totalConsumption);
  const waterLossPercentage = Number(((waterLossLiters / totalSupplied) * 100).toFixed(1));

  const activeLeakCount = leaks.filter((l) => l.status === 'Active' || l.status === 'Investigating').length;
  const activeSensorCount = 46 + (sensors.filter((s) => s.status === 'Offline').length === 0 ? 1 : 0);
  const totalSensorCount = 48;
  const networkHealth = activeLeakCount === 0 ? 96 : activeLeakCount === 1 ? 91 : 87;
  const unreadAlertCount = alerts.filter((a) => a.status === 'Unread').length;

  const toggleSimulation = useCallback(() => {
    setIsSimulationRunning((prev) => !prev);
  }, []);

  const triggerSimulatedAnomaly = useCallback(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Create or escalate an anomaly in Zone 2 or Zone 3
    setSensors((prev) =>
      prev.map((s) =>
        s.id === 'S-004'
          ? { ...s, pressure: 1.85, flow: 178, status: 'Critical', lastReading: now }
          : s
      )
    );
    const newAlert: AlertItem = {
      id: `ALT-${Math.floor(200 + Math.random() * 799)}`,
      severity: 'Warning',
      title: 'Transient pressure drop in Zone 3',
      message: 'Live telemetry detected rapid -0.25 bar pressure transient at South Trunk Sensor S04.',
      zoneName: 'Zone 3',
      timestamp: now,
      status: 'Unread',
      relatedLeakId: 'L-001',
      estimatedLoss: '1,290 L/hr',
    };
    setAlerts((prev) => [newAlert, ...prev]);
  }, []);

  const updateLeakStatus = useCallback((leakId: string, status: LeakEvent['status']) => {
    setLeaks((prev) =>
      prev.map((leak) => {
        if (leak.id === leakId) {
          const updated = { ...leak, status };
          setSelectedLeakForLocalization((curr) => (curr.id === leakId ? updated : curr));
          return updated;
        }
        return leak;
      })
    );

    if (status === 'Resolved') {
      setAlerts((prev) =>
        prev.map((a) =>
          a.relatedLeakId === leakId ? { ...a, status: 'Resolved', severity: 'Resolved' } : a
        )
      );
    }
  }, []);

  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId && a.status === 'Unread' ? { ...a, status: 'Read' } : a))
    );
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Resolved', severity: 'Resolved' } : a))
    );
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setAlerts((prev) =>
      prev.map((a) => (a.status === 'Unread' ? { ...a, status: 'Read' } : a))
    );
  }, []);

  const updateSettings = useCallback((newSettings: SystemSettings) => {
    setSettings(newSettings);
  }, []);

  const generateCustomReport = useCallback((type: ReportItem['type']) => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    const newReport: ReportItem = {
      id: `REP-2026-${Math.floor(10 + Math.random() * 89)}`,
      name: type,
      type,
      date: today,
      generatedBy: settings.account.name,
      format: 'PDF & CSV',
      size: '2.2 MB',
      summary: `On-demand ${type.toLowerCase()} snapshot generated from real-time municipal telemetry across ${zones.length} active distribution zones.`,
      metrics: [
        { label: 'Supply Volume', value: `${totalSupplied.toLocaleString()} L` },
        { label: 'Water Loss', value: `${waterLossPercentage}%` },
        { label: 'Network Health', value: `${networkHealth}%` },
      ],
    };
    setReports((prev) => [newReport, ...prev]);
  }, [settings.account.name, zones.length, totalSupplied, waterLossPercentage, networkHealth]);

  return (
    <WaterNetworkContext.Provider
      value={{
        sensors,
        zones,
        leaks,
        alerts,
        consumption24h,
        forecast7d,
        reports,
        settings,
        totalSupplied,
        totalConsumption,
        waterLossLiters,
        waterLossPercentage,
        activeLeakCount,
        networkHealth,
        activeSensorCount,
        totalSensorCount,
        unreadAlertCount,
        isSimulationRunning,
        lastTelemetryTick,
        selectedLeakForLocalization,
        setSelectedLeakForLocalization,
        toggleSimulation,
        triggerSimulatedAnomaly,
        updateLeakStatus,
        markAlertAsRead,
        resolveAlert,
        markAllAlertsRead,
        updateSettings,
        generateCustomReport,
      }}
    >
      {children}
    </WaterNetworkContext.Provider>
  );
};

export const useWaterNetwork = () => {
  const context = useContext(WaterNetworkContext);
  if (!context) {
    throw new Error('useWaterNetwork must be used within a WaterNetworkProvider');
  }
  return context;
};
