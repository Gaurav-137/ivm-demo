import { ApiService } from './ApiService';
import { Sale, Customer } from '../types';
import { API_ENDPOINTS } from '../constants';

export class SaleService {
  static async getSales(params?: {
    page?: number;
    limit?: number;
    status?: string;
    customerId?: string;
  }) {
    let url = API_ENDPOINTS.SALES;
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.customerId) searchParams.append('customerId', params.customerId);
    
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }

    return ApiService.get<Sale[]>(url);
  }

  static async getSale(id: string) {
    return ApiService.get<Sale>(`${API_ENDPOINTS.SALES}/${id}`);
  }

  static async createSale(sale: Partial<Sale>) {
    return ApiService.post<Sale>(API_ENDPOINTS.SALES, sale);
  }

  static async updateSale(id: string, sale: Partial<Sale>) {
    return ApiService.put<Sale>(`${API_ENDPOINTS.SALES}/${id}`, sale);
  }

  static async deleteSale(id: string) {
    return ApiService.delete<void>(`${API_ENDPOINTS.SALES}/${id}`);
  }

  static async completeSale(id: string) {
    return ApiService.patch<Sale>(`${API_ENDPOINTS.SALES}/${id}/complete`, {});
  }

  static async cancelSale(id: string, reason: string) {
    return ApiService.patch<Sale>(`${API_ENDPOINTS.SALES}/${id}/cancel`, { reason });
  }

  static async getSalesStats(startDate: Date, endDate: Date) {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    return ApiService.get(`${API_ENDPOINTS.SALES}/stats?start=${start}&end=${end}`);
  }

  static async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    let url = API_ENDPOINTS.CUSTOMERS;
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }

    return ApiService.get<Customer[]>(url);
  }

  static async createCustomer(customer: Partial<Customer>) {
    return ApiService.post<Customer>(API_ENDPOINTS.CUSTOMERS, customer);
  }
}