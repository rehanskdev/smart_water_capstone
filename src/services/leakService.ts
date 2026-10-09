import { apiRequest } from './api';
import { INITIAL_LEAKS } from '../data/mockData';
import { LeakEvent } from '../types';

export const leakService = {
  getAllLeaks: async (): Promise<LeakEvent[]> => {
    return apiRequest('/v1/leaks', { method: 'GET' }, () => INITIAL_LEAKS);
  },

  getLeakById: async (id: string): Promise<LeakEvent | undefined> => {
    return apiRequest(`/v1/leaks/${id}`, { method: 'GET' }, () =>
      INITIAL_LEAKS.find((leak) => leak.id === id)
    );
  },

  updateLeakStatus: async (
    id: string,
    status: LeakEvent['status']
  ): Promise<{ id: string; status: LeakEvent['status'] }> => {
    return apiRequest(
      `/v1/leaks/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
      () => ({ id, status })
    );
  },
};
