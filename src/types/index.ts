export type OperationalStatus = 'Normal' | 'Warning' | 'Critical' | 'Offline' | 'Online' | 'Good' | 'Investigating' | 'Resolved' | 'Active';

export interface Sensor {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  type: 'Pressure' | 'Flow' | 'Combined';
  pressure: number; // bar
  flow: number; // L/min
  status: 'Online' | 'Warning' | 'Offline' | 'Critical';
  lastReading: string;
  batteryLevel: number;
  signalStrength: number; // dBm
  coordinates: { x: number; y: number };
}

export interface Zone {
  id: string;
  name: string;
  sensorCount: number;
  consumption: number; // L
  pressure: number; // bar
  waterLossVolume: number; // L
  waterLossPercentage: number; // %
  status: 'Normal' | 'Warning' | 'Critical';
  healthScore: number;
  populationServed: number;
  pipeLengthKm: number;
}

export interface LeakEvent {
  id: string;
  zoneId: string;
  zoneName: string;
  pipeId: string;
  locationDescription: string;
  upstreamSensorId: string;
  downstreamSensorId: string;
  detectedAt: string;
  duration: string;
  severity: 'High' | 'Medium' | 'Low';
  estimatedLossRate: number; // L/hr
  status: 'Active' | 'Investigating' | 'Resolved';
  confidence: number; // %
  pressureDiffPercentage: number; // e.g., -18.4
  flowDiffPercentage: number; // e.g., +24.7
  localizationPosition: number; // 0 to 100% between upstream and downstream sensor
  analysisSteps: {
    step: string;
    detail: string;
    timestamp: string;
    passed: boolean;
  }[];
}

export interface AlertItem {
  id: string;
  severity: 'Critical' | 'Warning' | 'Information' | 'Resolved';
  title: string;
  message: string;
  zoneName: string;
  timestamp: string;
  status: 'Unread' | 'Read' | 'Resolved';
  relatedLeakId?: string;
  relatedSensorId?: string;
  estimatedLoss?: string;
}

export interface ConsumptionPoint {
  time: string;
  actual: number;
  previous: number;
  expected?: number;
  normalFlow?: number;
  anomaly?: boolean;
}

export interface ForecastPoint {
  date: string;
  timestamp: string;
  historical?: number | null;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  actual?: number | null;
  errorPercentage?: number | null;
}

export interface ReportItem {
  id: string;
  name: string;
  type: 'Daily Network Report' | 'Weekly Consumption Report' | 'Leak Analysis Report' | 'Zone Performance Report' | 'Forecast Accuracy Report';
  date: string;
  generatedBy: string;
  format: 'PDF' | 'CSV' | 'PDF & CSV';
  size: string;
  summary: string;
  metrics: { label: string; value: string }[];
}

export interface SystemSettings {
  general: {
    systemName: string;
    timezone: string;
    dateFormat: string;
  };
  thresholds: {
    leakDetectionThresholdPercent: number;
    pressureWarningThresholdBar: number;
    highConsumptionThresholdLiters: number;
  };
  notifications: {
    emailAlerts: boolean;
    criticalLeakAlerts: boolean;
    dailyReports: boolean;
  };
  networkConfig: {
    numberOfZones: number;
    numberOfSensors: number;
    waterSupplyCapacityLiters: number;
  };
  account: {
    name: string;
    email: string;
    role: string;
  };
}
