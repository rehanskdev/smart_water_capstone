import { apiRequest } from './api';
import { INITIAL_SENSORS, INITIAL_ZONES } from '../data/mockData';
import { Sensor, Zone } from '../types';

export const sensorService = {
  getAllSensors: async (): Promise<Sensor[]> => {
    return apiRequest('/v1/sensors', { method: 'GET' }, () => INITIAL_SENSORS);
  },

  getSensorById: async (id: string): Promise<Sensor | undefined> => {
    return apiRequest(`/v1/sensors/${id}`, { method: 'GET' }, () =>
      INITIAL_SENSORS.find((s) => s.id === id)
    );
  },

  getZones: async (): Promise<Zone[]> => {
    return apiRequest('/v1/zones', { method: 'GET' }, () => INITIAL_ZONES);
  },
};
