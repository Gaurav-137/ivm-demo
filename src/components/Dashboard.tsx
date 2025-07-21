import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, AlertTriangle, Calendar, ArrowRight } from 'lucide-react-native';
import { Header } from './Header';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../constants';
import { formatCurrency } from '../utils';
import { getProducts, getPurchases, getSales } from '../dbService';
import { useI18n } from '../i18n';

export function Dashboard() {
  const { t } = useI18n();
  const [productCount, setProductCount] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [saleAmount, setSaleAmount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  // Fetch stats from SQLite
  const fetchStats = async () => {
    try {
      const products = await getProducts();
      setProductCount(products.length);
      setLowStockCount(products.filter((p: any) => Number(p.stock) <= Number(p.minStock)).length);
      
      const purchases = await getPurchases();
      const purchaseRevenue = purchases.reduce((sum: number, p: any) => sum + (Number(p.totalAmount) || 0), 0);
      setPurchaseAmount(purchaseRevenue);
      
      const sales = await getSales();
      const salesRevenue = sales.reduce((sum: number, s: any) => sum + (Number(s.totalAmount) || 0), 0);
      setSaleAmount(salesRevenue);
      
      // Total orders is the sum of purchases and sales
      setOrderCount(purchases.length + sales.length);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = [
    {
      title: t('totalPurchases'),
      value: formatCurrency(purchaseAmount),
      change: '+0%',
      isPositive: true,
      icon: <ShoppingCart size={24} color="white" />,
      color: COLORS.success,
      gradient: [COLORS.success, '#059669']
    },
    {
      title: t('totalSales'),
      value: formatCurrency(saleAmount),
      change: '+0%',
      isPositive: true,
      icon: <TrendingUp size={24} color="white" />,
      color: COLORS.warning,
      gradient: [COLORS.warning, '#D97706']
    },
    {
      title: t('totalOrders'),
      value: orderCount.toString(),
      change: '+0%',
      isPositive: true,
      icon: <Package size={24} color="white" />,
      color: COLORS.primary,
      gradient: [COLORS.primary, '#1E40AF']
    },
    {
      title: t('lowStockItems'),
      value: lowStockCount.toString(),
      change: '+0%',
      isPositive: false,
      icon: <AlertTriangle size={24} color="white" />,
      color: COLORS.danger,
      gradient: [COLORS.danger, '#DC2626']
    }
  ];

  const quickActions = [
    { title: t('addProduct'), icon: Package, color: COLORS.primary, onPress: () => {} },
    { title: t('newPurchase'), icon: ShoppingCart, color: COLORS.success, onPress: () => {} },
    { title: t('addSupplier'), icon: Users, color: COLORS.warning, onPress: () => {} },
    { title: t('viewReports'), icon: Calendar, color: '#8B5CF6', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <Header title={t('dashboard')} subtitle="Overview of your inventory" showSearch={Platform.OS === 'web'} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient colors={['#1E40AF', COLORS.primary]} style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{t('welcome')}</Text>
              <Text style={styles.heroSubtitle}>{t('subtitle')}</Text>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>{t('viewAnalytics')}</Text>
                <ArrowRight size={16} color="#1E40AF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <TouchableOpacity key={index} style={styles.statsCard}>
              <LinearGradient colors={[stat.gradient[0], stat.gradient[1]] as [string, string]} style={styles.statsGradient}>
                <View style={styles.statsHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}> 
                    {stat.icon}
                  </View>
                  <View style={styles.changeContainer}>
                    {stat.isPositive ? (
                      <TrendingUp size={14} color="rgba(255,255,255,0.9)" />
                    ) : (
                      <TrendingDown size={14} color="rgba(255,255,255,0.9)" />
                    )}
                    <Text style={styles.changeText}>{stat.change}</Text>
                  </View>
                </View>
                <Text style={styles.statsValue}>{stat.value}</Text>
                <Text style={styles.statsTitle}>{stat.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{t('seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionCard} onPress={action.onPress}>
                <LinearGradient 
                  colors={[action.color + '15', action.color + '25']} 
                  style={styles.quickActionGradient}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}> 
                    <action.icon size={20} color="white" />
                  </View>
                  <Text style={styles.quickActionText}>{action.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
  },
  heroSection: {
    marginBottom: SPACING.xxxl,
  },
  heroGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroContent: {
    padding: SPACING.xxxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  heroButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#1E40AF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 30,
    gap: 15,
  },
  statsCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? '22%' : '45%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  statsGradient: {
    padding: SPACING.xl,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: 'rgba(255,255,255,0.9)',
  },
  statsValue: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.dark,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: Platform.OS === 'web' ? 0 : 100,
  },
  quickActionCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? '22%' : '45%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: '#374151',
    textAlign: 'center',
  }
});