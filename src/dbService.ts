import { getDb } from './db';

export const addPurchase = async (purchase: any) => {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO purchases (supplierName, supplierId, purchaseDate, paymentMode, paidAmount, totalAmount, balanceAmount, notes, status, createdAt, updatedAt, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      purchase.supplierName,
      purchase.supplierId,
      purchase.purchaseDate.toISOString(),
      purchase.paymentMode,
      purchase.paidAmount,
      purchase.totalAmount,
      purchase.balanceAmount,
      purchase.notes,
      purchase.status,
      purchase.createdAt.toISOString(),
      purchase.updatedAt.toISOString(),
      purchase.createdBy
    ]
  );
  
  const purchaseId = result.lastInsertRowId;
  for (const item of purchase.items) {
    await db.runAsync(
      `INSERT INTO purchase_items (purchaseId, productId, productName, mrp, quantity, costPrice, batchNo, expiryDate, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        purchaseId,
        item.productId,
        item.productName,
        item.mrp,
        item.quantity,
        item.costPrice,
        item.batchNo,
        item.expiryDate ? new Date(item.expiryDate).toISOString() : null,
        item.totalPrice
      ]
    );
  }
};

export const addSale = async (sale: any) => {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO sales (orderId, customerId, customerName, customerPhone, customerEmail, subtotal, discount, tax, totalAmount, paidAmount, balanceAmount, paymentMode, status, saleDate, createdAt, updatedAt, createdBy, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sale.orderId,
      sale.customerId,
      sale.customerName,
      sale.customerPhone,
      sale.customerEmail,
      sale.subtotal,
      sale.discount,
      sale.tax,
      sale.totalAmount,
      sale.paidAmount,
      sale.balanceAmount,
      sale.paymentMode,
      sale.status,
      new Date(sale.saleDate).toISOString(),
      new Date(sale.createdAt).toISOString(),
      new Date(sale.updatedAt).toISOString(),
      sale.createdBy,

      sale.notes
    ]
  );
};

export const getSales = async () => {
  const db = await getDb();
  const result = await db.getAllAsync('SELECT * FROM sales ORDER BY createdAt DESC');
  return result.map((row: any) => ({
    ...row,
    saleDate: new Date(row.saleDate),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }));
};

export const getProducts = async () => {
  const db = await getDb();
  return await db.getAllAsync('SELECT * FROM products ORDER BY name');
};

export const addProduct = async (product: any) => {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO products (name, sku, category, description, mrp, costPrice, sellingPrice, stock, minStock, maxStock, unit, barcode, images, supplierId, createdAt, updatedAt, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      product.name,
      product.sku,
      product.category || '',
      product.description || '',
      product.mrp || 0,
      product.costPrice || 0,
      product.sellingPrice || 0,
      product.stock || 0,
      product.minStock || 0,
      product.maxStock || 0,
      product.unit || '',
      product.barcode || '',
      JSON.stringify(product.images || []),
      product.supplierId || null,
      new Date().toISOString(),
      new Date().toISOString(),
      product.isActive ? 1 : 0
    ]
  );
};

export const getPurchases = async () => {
  const db = await getDb();
  return await db.getAllAsync('SELECT * FROM purchases ORDER BY createdAt DESC');
};

export const getSuppliers = async () => {
  const db = await getDb();
  return await db.getAllAsync('SELECT * FROM suppliers ORDER BY name');
};

export const addSupplier = async (supplier: any) => {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO suppliers (name, email, phone, address, gst, paymentTerms) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      supplier.name,
      supplier.email || '',
      supplier.phone || '',
      supplier.address || '',
      supplier.gst || '',
      supplier.paymentTerms || ''
    ]
  );
};
