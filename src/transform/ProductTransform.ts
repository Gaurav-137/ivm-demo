import { Product } from '../types';
import { formatCurrency, formatDate, getStockStatus } from '../utils';

export interface ProductListItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  status: 'low' | 'medium' | 'good';
  lastUpdated: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  description: string;
  mrp: string;
  costPrice: string;
  sellingPrice: string;
  stock: string;
  minStock: string;
  unit: string;
  barcode: string;
}

export class ProductTransform {
  static toListItem(product: Product): ProductListItem {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category,
      stock: product.stock,
      minStock: product.minStock,
      price: product.sellingPrice,
      status: getStockStatus(product.stock, product.minStock),
      lastUpdated: formatDate(product.updatedAt),
    };
  }

  static toFormData(product: Product): ProductFormData {
    return {
      name: product.name,
      sku: product.sku,
      category: product.category,
      description: product.description || '',
      mrp: product.mrp.toString(),
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      unit: product.unit,
      barcode: product.barcode || '',
    };
  }

  static fromFormData(formData: ProductFormData): Partial<Product> {
    return {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      category: formData.category.trim(),
      description: formData.description.trim() || undefined,
      mrp: parseFloat(formData.mrp) || 0,
      costPrice: parseFloat(formData.costPrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 0,
      unit: formData.unit.trim(),
      barcode: formData.barcode.trim() || undefined,
      updatedAt: new Date(),
    };
  }

  static calculateMetrics(products: Product[]) {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
    const lowStockCount = products.filter(p => getStockStatus(p.stock, p.minStock) === 'low').length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const averagePrice = products.length > 0 ? products.reduce((sum, p) => sum + p.sellingPrice, 0) / products.length : 0;

    return {
      totalProducts,
      totalValue,
      lowStockCount,
      outOfStockCount,
      averagePrice,
    };
  }
}