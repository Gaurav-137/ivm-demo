import { Purchase, PurchaseItem } from '../types';
import { formatDate, formatCurrency } from '../utils';

export interface PurchaseFormData {
  supplierName: string;
  purchaseDate: Date;
  paymentMode: string;
  paidAmount: string;
  notes: string;
  items: PurchaseItemFormData[];
}

export interface PurchaseItemFormData {
  id: string;
  productName: string;
  mrp: string;
  quantity: string;
  costPrice: string;
  batchNo: string;
  expiryDate: Date | null;
}

export class PurchaseTransform {
  static toFormData(purchase: Purchase): PurchaseFormData {
    return {
      supplierName: purchase.supplierName,
      purchaseDate: purchase.purchaseDate,
      paymentMode: purchase.paymentMode,
      paidAmount: purchase.paidAmount.toString(),
      notes: purchase.notes || '',
      items: purchase.items.map(this.itemToFormData),
    };
  }

  static fromFormData(formData: PurchaseFormData): Partial<Purchase> {
    const items = formData.items.map(this.itemFromFormData);
    const totalAmount = this.calculateTotal(items);
    const paidAmount = parseFloat(formData.paidAmount) || 0;

    return {
      supplierName: formData.supplierName.trim(),
      purchaseDate: formData.purchaseDate,
      paymentMode: formData.paymentMode as any,
      paidAmount,
      totalAmount,
      balanceAmount: totalAmount - paidAmount,
      notes: formData.notes.trim() || undefined,
      items,
      updatedAt: new Date(),
    };
  }

  static itemToFormData(item: PurchaseItem): PurchaseItemFormData {
    return {
      id: item.id,
      productName: item.productName,
      mrp: item.mrp.toString(),
      quantity: item.quantity.toString(),
      costPrice: item.costPrice.toString(),
      batchNo: item.batchNo || '',
      expiryDate: item.expiryDate || null,
    };
  }

  static itemFromFormData(formData: PurchaseItemFormData): PurchaseItem {
    const quantity = parseFloat(formData.quantity) || 0;
    const costPrice = parseFloat(formData.costPrice) || 0;

    return {
      id: formData.id,
      productName: formData.productName.trim(),
      mrp: parseFloat(formData.mrp) || 0,
      quantity,
      costPrice,
      batchNo: formData.batchNo.trim() || undefined,
      expiryDate: formData.expiryDate || undefined,
      totalPrice: quantity * costPrice,
    };
  }

  static calculateTotal(items: PurchaseItem[]): number {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  }

  static validateFormData(formData: PurchaseFormData): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    if (!formData.supplierName.trim()) {
      errors.supplierName = 'Supplier name is required';
    }

    formData.items.forEach((item, index) => {
      if (!item.productName.trim()) {
        errors[`productName_${index}`] = 'Product name is required';
      }
      if (!item.quantity.trim() || parseFloat(item.quantity) <= 0) {
        errors[`quantity_${index}`] = 'Valid quantity is required';
      }
      if (!item.costPrice.trim() || parseFloat(item.costPrice) <= 0) {
        errors[`costPrice_${index}`] = 'Valid cost price is required';
      }
    });

    return errors;
  }
}