/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WaterNetworkProvider } from './hooks/useWaterNetwork';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { NetworkMap } from './pages/NetworkMap';
import { LeakDetection } from './pages/LeakDetection';
import { LeakLocalization } from './pages/LeakLocalization';
import { Consumption } from './pages/Consumption';
import { Forecasting } from './pages/Forecasting';
import { Alerts } from './pages/Alerts';
import { Sensors } from './pages/Sensors';
import { Zones } from './pages/Zones';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <WaterNetworkProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="map" element={<NetworkMap />} />
            <Route path="leaks" element={<LeakDetection />} />
            <Route path="localization" element={<LeakLocalization />} />
            <Route path="consumption" element={<Consumption />} />
            <Route path="forecasting" element={<Forecasting />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="sensors" element={<Sensors />} />
            <Route path="zones" element={<Zones />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WaterNetworkProvider>
  );
}

