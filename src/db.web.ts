// Web-specific database implementation using localStorage
let isInitialized = false;

const STORAGE_KEYS = {
  products: 'inventtrack_products',
  suppliers: 'inventtrack_suppliers',
  purchases: 'inventtrack_purchases',
  purchase_items: 'inventtrack_purchase_items',
  sales: 'inventtrack_sales',
  sale_items: 'inventtrack_sale_items',
};

export async function initDatabase() {
  if (!isInitialized) {
    // Initialize empty arrays if they don't exist
    Object.values(STORAGE_KEYS).forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
    isInitialized = true;
  }
}

export async function getDb() {
  if (!isInitialized) {
    await initDatabase();
  }
  
  return {
    runAsync: async (sql: string, params: any[] = []) => {
      const result = await executeSQL(sql, params);
      return result;
    },
    getAllAsync: async (sql: string, params: any[] = []) => {
      return await executeSQL(sql, params);
    },
    execAsync: async (sql: string) => {
      // For CREATE TABLE statements, we don't need to do anything on web
      return;
    }
  };
}

async function executeSQL(sql: string, params: any[] = []): Promise<any> {
  const sqlLower = sql.toLowerCase().trim();
  
  if (sqlLower.startsWith('insert into products')) {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.products) || '[]');
    const newProduct = {
      id: Date.now(),
      name: params[0],
      sku: params[1],
      category: params[2],
      description: params[3],
      mrp: params[4],
      costPrice: params[5],
      sellingPrice: params[6],
      stock: params[7],
      minStock: params[8],
      maxStock: params[9],
      unit: params[10],
      barcode: params[11],
      images: params[12],
      supplierId: params[13],
      createdAt: params[14],
      updatedAt: params[15],
      isActive: params[16]
    };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    return { lastInsertRowId: newProduct.id };
  }
  
  if (sqlLower.startsWith('insert into suppliers')) {
    const suppliers = JSON.parse(localStorage.getItem(STORAGE_KEYS.suppliers) || '[]');
    const newSupplier = {
      id: Date.now(),
      name: params[0],
      email: params[1],
      phone: params[2],
      address: params[3],
      gst: params[4],
      paymentTerms: params[5]
    };
    suppliers.push(newSupplier);
    localStorage.setItem(STORAGE_KEYS.suppliers, JSON.stringify(suppliers));
    return { lastInsertRowId: newSupplier.id };
  }
  
  if (sqlLower.startsWith('insert into purchases')) {
    const purchases = JSON.parse(localStorage.getItem(STORAGE_KEYS.purchases) || '[]');
    const newPurchase = {
      id: Date.now(),
      supplierName: params[0],
      supplierId: params[1],
      purchaseDate: params[2],
      paymentMode: params[3],
      paidAmount: params[4],
      totalAmount: params[5],
      balanceAmount: params[6],
      notes: params[7],
      status: params[8],
      createdAt: params[9],
      updatedAt: params[10],
      createdBy: params[11]
    };
    purchases.push(newPurchase);
    localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(purchases));
    return { lastInsertRowId: newPurchase.id };
  }
  
  if (sqlLower.startsWith('insert into purchase_items')) {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.purchase_items) || '[]');
    const newItem = {
      id: Date.now(),
      purchaseId: params[0],
      productId: params[1],
      productName: params[2],
      mrp: params[3],
      quantity: params[4],
      costPrice: params[5],
      batchNo: params[6],
      expiryDate: params[7],
      totalPrice: params[8]
    };
    items.push(newItem);
    localStorage.setItem(STORAGE_KEYS.purchase_items, JSON.stringify(items));
    return { lastInsertRowId: newItem.id };
  }
  
  if (sqlLower.startsWith('insert into sales')) {
    const sales = JSON.parse(localStorage.getItem(STORAGE_KEYS.sales) || '[]');
    const newSale = {
      id: Date.now(),
      orderId: params[0],
      customerId: params[1],
      customerName: params[2],
      customerPhone: params[3],
      customerEmail: params[4],
      subtotal: params[5],
      discount: params[6],
      tax: params[7],
      totalAmount: params[8],
      paidAmount: params[9],
      balanceAmount: params[10],
      paymentMode: params[11],
      status: params[12],
      saleDate: params[13],
      createdAt: params[14],
      updatedAt: params[15],
      createdBy: params[16],
      notes: params[17]
    };
    sales.push(newSale);
    localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
    return { lastInsertRowId: newSale.id };
  }
  
  if (sqlLower.includes('select * from products')) {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.products) || '[]');
  }
  
  if (sqlLower.includes('select * from suppliers')) {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.suppliers) || '[]');
  }
  
  if (sqlLower.includes('select * from purchases')) {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.purchases) || '[]');
  }
  
  if (sqlLower.includes('select * from sales')) {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.sales) || '[]');
  }
  
  return [];
}