import { apiRequest } from './api';
import { INITIAL_ALERTS } from '../data/mockData';
import { AlertItem } from '../types';

export const alertService = {
  getAllAlerts: async (): Promise<AlertItem[]> => {
    return apiRequest('/v1/alerts', { method: 'GET' }, () => INITIAL_ALERTS);
  },

  markAlertRead: async (id: string): Promise<{ id: string; status: 'Read' }> => {
    return apiRequest(
      `/v1/alerts/${id}/read`,
      { method: 'PATCH' },
      () => ({ id, status: 'Read' })
    );
  },

  resolveAlert: async (id: string): Promise<{ id: string; status: 'Resolved' }> => {
    return apiRequest(
      `/v1/alerts/${id}/resolve`,
      { method: 'PATCH' },
      () => ({ id, status: 'Resolved' })
    );
  },
};
