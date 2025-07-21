import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { getProducts, getPurchases, getSales, getSuppliers } from '../dbService';

export function DataViewer() {
  const [data, setData] = useState<any>({});
  const [activeTab, setActiveTab] = useState('products');

  const fetchData = async () => {
    try {
      const [products, purchases, sales, suppliers] = await Promise.all([
        getProducts(),
        getPurchases(), 
        getSales(),
        getSuppliers()
      ]);
      setData({ products, purchases, sales, suppliers });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderData = (items: any[], type: string) => {
    if (!items || items.length === 0) {
      return <Text style={styles.emptyText}>No {type} found</Text>;
    }

    return items.map((item, index) => (
      <View key={index} style={styles.dataItem}>
        <Text style={styles.dataText}>{JSON.stringify(item, null, 2)}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Data Viewer</Text>
      
      <View style={styles.tabs}>
        {['products', 'purchases', 'sales', 'suppliers'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({data[tab]?.length || 0})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {renderData(data[activeTab] || [], activeTab)}
      </ScrollView>

      <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
        <Text style={styles.refreshText}>Refresh Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  dataItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dataText: {
    fontSize: 12,
    fontFamily: Platform.select({ web: 'monospace', default: 'Courier' }),
    color: '#374151',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 40,
  },
  refreshButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  refreshText: {
    color: 'white',
    fontWeight: '600',
  },
});