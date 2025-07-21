export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Staff';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  mrp: number;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  barcode?: string;
  images?: string[];
  supplier?: Supplier;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  gst?: string;
  paymentTerms?: string;
}

export interface Purchase {
  id: string;
  supplierName: string;
  supplierId?: string;
  purchaseDate: Date;
  items: PurchaseItem[];
  paymentMode: PaymentMode;
  paidAmount: number;
  totalAmount: number;
  balanceAmount: number;
  notes?: string;
  status: PurchaseStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface PurchaseItem {
  id: string;
  productId?: string;
  productName: string;
  mrp: number;
  quantity: number;
  costPrice: number;
  batchNo?: string;
  expiryDate?: Date;
  totalPrice: number;
}

export interface Sale {
  id: string;
  orderId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMode: PaymentMode;
  status: SaleStatus;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  notes?: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  totalPurchases: number;
  lastPurchaseDate?: Date;
  createdAt: Date;
}

export type PaymentMode = 'Cash' | 'Card' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Credit';
export type PurchaseStatus = 'Draft' | 'Pending' | 'Completed' | 'Cancelled';
export type SaleStatus = 'Draft' | 'Pending' | 'Completed' | 'Cancelled' | 'Refunded';
export type ActiveTab = 'dashboard' | 'sales' | 'purchases' | 'inventory' | 'predictions' | 'reports' | 'utilities' | 'data' | 'admin';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}