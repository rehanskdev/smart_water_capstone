import { apiRequest } from './api';
import { FORECAST_DATA_7D } from '../data/mockData';
import { ForecastPoint } from '../types';

export const forecastService = {
  getForecastData: async (
    horizon: '24H' | '7D' | '30D'
  ): Promise<ForecastPoint[]> => {
    return apiRequest(
      `/v1/forecast?horizon=${horizon}`,
      { method: 'GET' },
      () => {
        if (horizon === '24H') {
          return [
            { date: '00:00', timestamp: '00:00', historical: 2850, predicted: 2820, lowerBound: 2680, upperBound: 2960, actual: 2850, errorPercentage: 1.05 },
            { date: '04:00', timestamp: '04:00', historical: 2680, predicted: 2640, lowerBound: 2510, upperBound: 2770, actual: 2680, errorPercentage: 1.49 },
            { date: '08:00', timestamp: '08:00', historical: 7840, predicted: 7690, lowerBound: 7350, upperBound: 8030, actual: 7840, errorPercentage: 1.91 },
            { date: '12:00 (Now)', timestamp: '12:00', historical: 8120, predicted: 8050, lowerBound: 7720, upperBound: 8380, actual: 8120, errorPercentage: 0.86 },
            { date: '14:00 (Peak)', timestamp: '14:00', historical: null, predicted: 9240, lowerBound: 8820, upperBound: 9660, actual: null, errorPercentage: null },
            { date: '18:00', timestamp: '18:00', historical: null, predicted: 8510, lowerBound: 8110, upperBound: 8910, actual: null, errorPercentage: null },
            { date: '22:00', timestamp: '22:00', historical: null, predicted: 5340, lowerBound: 5040, upperBound: 5640, actual: null, errorPercentage: null },
            { date: '02:00 (+1d)', timestamp: '02:00', historical: null, predicted: 2490, lowerBound: 2340, upperBound: 2640, actual: null, errorPercentage: null },
          ];
        }
        if (horizon === '30D') {
          return [
            ...FORECAST_DATA_7D,
            { date: 'Oct 18', timestamp: '2026-10-18', historical: null, predicted: 116400, lowerBound: 110200, upperBound: 122600, actual: null, errorPercentage: null },
            { date: 'Oct 22', timestamp: '2026-10-22', historical: null, predicted: 118900, lowerBound: 112400, upperBound: 125400, actual: null, errorPercentage: null },
            { date: 'Oct 26', timestamp: '2026-10-26', historical: null, predicted: 117200, lowerBound: 110800, upperBound: 123600, actual: null, errorPercentage: null },
            { date: 'Oct 30', timestamp: '2026-10-30', historical: null, predicted: 121500, lowerBound: 114600, upperBound: 128400, actual: null, errorPercentage: null },
          ];
        }
        return FORECAST_DATA_7D;
      }
    );
  },
};
