/**
 * Base API Configuration prepared for Spring Boot Backend (Java 21 + PostgreSQL)
 * Target endpoint: http://localhost:8080/api
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  USE_MOCK_DATA: true, // Toggle to false when Spring Boot REST API is running
  TIMEOUT_MS: 8000,
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  mockFallback: () => T | Promise<T>
): Promise<T> {
  if (API_CONFIG.USE_MOCK_DATA) {
    return Promise.resolve(mockFallback());
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error [${response.status}]: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
