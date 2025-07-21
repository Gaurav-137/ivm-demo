import { ApiService } from './ApiService';
import { Product } from '../types';
import { API_ENDPOINTS } from '../constants';

export class ProductService {
  static async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) {
    let url = API_ENDPOINTS.PRODUCTS;
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`;
    }

    return ApiService.get<Product[]>(url);
  }

  static async getProduct(id: string) {
    return ApiService.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  }

  static async createProduct(product: Partial<Product>) {
    return ApiService.post<Product>(API_ENDPOINTS.PRODUCTS, product);
  }

  static async updateProduct(id: string, product: Partial<Product>) {
    return ApiService.put<Product>(`${API_ENDPOINTS.PRODUCTS}/${id}`, product);
  }

  static async deleteProduct(id: string) {
    return ApiService.delete<void>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  }

  static async getLowStockProducts() {
    return ApiService.get<Product[]>(`${API_ENDPOINTS.PRODUCTS}/low-stock`);
  }

  static async updateStock(productId: string, quantity: number, type: 'IN' | 'OUT' | 'ADJUSTMENT', reason: string) {
    return ApiService.post(`${API_ENDPOINTS.PRODUCTS}/${productId}/stock`, {
      quantity,
      type,
      reason,
    });
  }

  static async searchProducts(query: string) {
    return ApiService.get<Product[]>(`${API_ENDPOINTS.PRODUCTS}/search?q=${encodeURIComponent(query)}`);
  }

  static async getCategories() {
    return ApiService.get<string[]>(`${API_ENDPOINTS.PRODUCTS}/categories`);
  }
}