import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useState } from 'react';
import { Search, Package, TriangleAlert as AlertTriangle, TrendingUp, Filter } from 'lucide-react-native';
import { Header } from './Header';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  lastUpdated: string;
}

export function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const inventoryData: InventoryItem[] = [
    {
      id: '1',
      name: 'Premium Headphones',
      sku: 'HP-001',
      category: 'Electronics',
      stock: 45,
      minStock: 10,
      price: 2499,
      lastUpdated: '2025-01-07'
    },
    {
      id: '2',
      name: 'Wireless Mouse',
      sku: 'MS-002',
      category: 'Electronics',
      stock: 8,
      minStock: 15,
      price: 1299,
      lastUpdated: '2025-01-06'
    },
    {
      id: '3',
      name: 'USB Cable',
      sku: 'CB-003',
      category: 'Accessories',
      stock: 125,
      minStock: 20,
      price: 299,
      lastUpdated: '2025-01-07'
    },
    {
      id: '4',
      name: 'Bluetooth Speaker',
      sku: 'SP-004',
      category: 'Electronics',
      stock: 3,
      minStock: 10,
      price: 3499,
      lastUpdated: '2025-01-05'
    },
  ];

  const filteredData = inventoryData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock) return 'low';
    if (stock <= minStock * 2) return 'medium';
    return 'good';
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case 'low': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'good': return '#10B981';
      default: return '#6B7280';
    }
  };

  const totalItems = inventoryData.length;
  const lowStockItems = inventoryData.filter(item => item.stock <= item.minStock).length;
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.stock * item.price), 0);

  return (
    <View style={styles.container}>
      <Header title="Inventory" subtitle="Manage your stock levels" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
            <Package size={20} color="#3B82F6" />
            <Text style={styles.statValue}>{totalItems}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#EF4444' }]}>
            <AlertTriangle size={20} color="#EF4444" />
            <Text style={styles.statValue}>{lowStockItems}</Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
            <TrendingUp size={20} color="#10B981" />
            <Text style={styles.statValue}>₹{Math.round(totalValue / 1000)}K</Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory Items</Text>
          
          <View style={styles.itemsContainer}>
            {filteredData.map((item) => {
              const stockStatus = getStockStatus(item.stock, item.minStock);
              return (
                <TouchableOpacity key={item.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemSku}>SKU: {item.sku}</Text>
                    </View>
                    <View style={[styles.stockBadge, { backgroundColor: getStockColor(stockStatus) + '15' }]}>
                      <Text style={[styles.stockText, { color: getStockColor(stockStatus) }]}>
                        {item.stock} units
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                  </View>
                  
                  {stockStatus === 'low' && (
                    <View style={styles.warningContainer}>
                      <AlertTriangle size={16} color="#EF4444" />
                      <Text style={styles.warningText}>Low stock alert</Text>
                    </View>
                  )}
                  
                  <Text style={styles.lastUpdated}>Updated: {item.lastUpdated}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add New Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  filterButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  itemsContainer: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemSku: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stockText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  lastUpdated: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});