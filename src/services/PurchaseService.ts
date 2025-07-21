import { ApiService } from './ApiService';
import { Purchase } from '../types';
import { API_ENDPOINTS } from '../constants';

export class PurchaseService {
  static async getPurchases(params?: {
    page?: number;
    limit?: number;
    status?: string;
    supplierId?: string;
  }) {
    let url = API_ENDPOINTS.PURCHASES;
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.supplierId) searchParams.append('supplierId', params.supplierId);
    
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }

    return ApiService.get<Purchase[]>(url);
  }

  static async getPurchase(id: string) {
    return ApiService.get<Purchase>(`${API_ENDPOINTS.PURCHASES}/${id}`);
  }

  static async createPurchase(purchase: Partial<Purchase>) {
    return ApiService.post<Purchase>(API_ENDPOINTS.PURCHASES, purchase);
  }

  static async updatePurchase(id: string, purchase: Partial<Purchase>) {
    return ApiService.put<Purchase>(`${API_ENDPOINTS.PURCHASES}/${id}`, purchase);
  }

  static async deletePurchase(id: string) {
    return ApiService.delete<void>(`${API_ENDPOINTS.PURCHASES}/${id}`);
  }

  static async completePurchase(id: string) {
    return ApiService.patch<Purchase>(`${API_ENDPOINTS.PURCHASES}/${id}/complete`, {});
  }

  static async cancelPurchase(id: string, reason: string) {
    return ApiService.patch<Purchase>(`${API_ENDPOINTS.PURCHASES}/${id}/cancel`, { reason });
  }

  static async getPurchaseStats(startDate: Date, endDate: Date) {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    return ApiService.get(`${API_ENDPOINTS.PURCHASES}/stats?start=${start}&end=${end}`);
  }
}