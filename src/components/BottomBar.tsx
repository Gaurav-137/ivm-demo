import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react-native';
import { COLORS } from '../constants';
import { ActiveTab } from '../types';
import { useI18n } from '../i18n';

export function BottomBar({ activeTab, onTabChange }: { activeTab: ActiveTab; onTabChange: (tab: ActiveTab) => void }) {
  const { t } = useI18n();
  
  const menuItems: { id: ActiveTab; title: string; icon: any; color: string }[] = [
    { id: 'dashboard', title: t('dashboard'), icon: Package, color: COLORS.primary },
    { id: 'purchases', title: t('purchases'), icon: ShoppingCart, color: COLORS.warning },
    { id: 'sales', title: t('sales'), icon: TrendingUp, color: COLORS.success },
    { id: 'admin', title: t('admin'), icon: Users, color: COLORS.gray },
  ];
  
  if (Platform.OS === 'web') return null;


  return (
    <View style={styles.container}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.tab}
            onPress={() => onTabChange(item.id)}
          >
            <Icon size={24} color={isActive ? item.color : '#B0B0B0'} />
            <Text style={[styles.label, isActive && { color: item.color }]}>{item.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
});
