import { API_ENDPOINTS } from '../constants';

export const createApiUrl = (endpoint: string, params?: Record<string, any>): string => {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.inventtrack.com';
  let url = `${baseUrl}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }
  }
  
  return url;
};

export const getAuthHeaders = (): Record<string, string> => {
  const apiKey = process.env.EXPO_PUBLIC_API_KEY || '';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };
};

export { API_ENDPOINTS };