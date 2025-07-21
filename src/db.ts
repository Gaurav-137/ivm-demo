  import { Platform } from 'react-native';

  // Declare exports at the top-level scope
  export let initDatabase: () => Promise<any>;
  export let getDb: () => Promise<any>;

  // Platform-specific database implementation
  if (Platform.OS === 'web') {
    // Use web implementation
    const webDb = require('./db.web');
    initDatabase = webDb.initDatabase;
    getDb = webDb.getDb;
  } else {
    // Use native SQLite implementation
    const SQLite = require('expo-sqlite');
    
    let dbPromise: Promise<any> | null = null;
    let isInitialized = false;
    
    async function createTables(db: any) {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          sku TEXT,
          category TEXT,
          description TEXT,
          mrp REAL,
          costPrice REAL,
          sellingPrice REAL,
          stock INTEGER,
          minStock INTEGER,
          maxStock INTEGER,
          unit TEXT,
          barcode TEXT,
          images TEXT,
          supplierId INTEGER,
          createdAt TEXT,
          updatedAt TEXT,
          isActive INTEGER
        );
    
        CREATE TABLE IF NOT EXISTS suppliers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT,
          phone TEXT,
          address TEXT,
          gst TEXT,
          paymentTerms TEXT
        );
    
        CREATE TABLE IF NOT EXISTS purchases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          supplierName TEXT,
          supplierId INTEGER,
          purchaseDate TEXT,
          paymentMode TEXT,
          paidAmount REAL,
          totalAmount REAL,
          balanceAmount REAL,
          notes TEXT,
          status TEXT,
          createdAt TEXT,
          updatedAt TEXT,
          createdBy TEXT
        );
    
        CREATE TABLE IF NOT EXISTS purchase_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          purchaseId INTEGER,
          productId INTEGER,
          productName TEXT,
          mrp REAL,
          quantity INTEGER,
          costPrice REAL,
          batchNo TEXT,
          expiryDate TEXT,
          totalPrice REAL
        );
    
        CREATE TABLE IF NOT EXISTS sales (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderId TEXT,
          customerId INTEGER,
          customerName TEXT,
          customerPhone TEXT,
          customerEmail TEXT,
          subtotal REAL,
          discount REAL,
          tax REAL,
          totalAmount REAL,
          paidAmount REAL,
          balanceAmount REAL,
          paymentMode TEXT,
          status TEXT,
          saleDate TEXT,
          createdAt TEXT,
          updatedAt TEXT,
          createdBy TEXT,
          notes TEXT
        );
    
        CREATE TABLE IF NOT EXISTS sale_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          saleId INTEGER,
          productId INTEGER,
          productName TEXT,
          sku TEXT,
          quantity INTEGER,
          unitPrice REAL
        );
      `);
    }
    
    initDatabase = async function () {
      if (!dbPromise) {
        dbPromise = SQLite.openDatabaseAsync('inventtrack.db');
      }
      const db = await dbPromise;
      if (!isInitialized) {
        await createTables(db);
        isInitialized = true;
      }
    };
    
    getDb = async function () {
      if (!dbPromise) {
        dbPromise = SQLite.openDatabaseAsync('inventtrack.db');
      }
      const db = await dbPromise;
      if (!isInitialized) {
        await createTables(db);
        isInitialized = true;
      }
      return db;
    };
  }