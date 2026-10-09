import { apiRequest } from './api';
import {
  CONSUMPTION_24H,
  CONSUMPTION_7D,
  CONSUMPTION_30D,
  HEATMAP_DATA,
} from '../data/mockData';
import { ConsumptionPoint } from '../types';

export const consumptionService = {
  getConsumptionByHorizon: async (
    horizon: '24H' | '7D' | '30D'
  ): Promise<ConsumptionPoint[]> => {
    return apiRequest(
      `/v1/consumption?horizon=${horizon}`,
      { method: 'GET' },
      () => {
        if (horizon === '24H') return CONSUMPTION_24H;
        if (horizon === '7D') return CONSUMPTION_7D;
        return CONSUMPTION_30D;
      }
    );
  },

  getConsumptionHeatmap: async () => {
    return apiRequest('/v1/consumption/heatmap', { method: 'GET' }, () => HEATMAP_DATA);
  },
};
