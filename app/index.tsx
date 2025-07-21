import { View, StyleSheet, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Sidebar } from '@/src/components/Sidebar';
import { Dashboard } from '@/src/components/Dashboard';
import Sales from '@/src/components/Sales';
import { Purchases } from '@/src/components/Purchases';
import { BottomBar } from '@/src/components/BottomBar';
import { ActiveTab } from '@/src/types';
import { DataViewer } from '@/src/components/DataViewer';
import { COLORS } from '@/src/constants';
import { initDatabase } from '@/src/db';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  useEffect(() => {
    initDatabase();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'sales':
        return <Sales />;
      case 'purchases':
        return <Purchases />;
      case 'admin':
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Admin Page</Text></View>;
      case 'data':
        return <DataViewer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        {Platform.OS === 'web' && (
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        )}
        <View style={styles.content}>
          {renderContent()}
        </View>
        {Platform.OS !== 'web' && (
          <BottomBar activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  layout: {
    flex: 1,
    flexDirection: Platform.select({
      web: 'row',
      default: 'column',
    }),
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
});