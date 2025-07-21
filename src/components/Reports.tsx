import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { ChartBar as BarChart3, TrendingUp, FileText, Calendar, Download } from 'lucide-react-native';
import { Header } from './Header';

export function Reports() {
  const reportTypes = [
    {
      id: 1,
      title: 'Sales Report',
      description: 'Daily, weekly, and monthly sales analysis',
      icon: <TrendingUp size={24} color="#3B82F6" />,
      color: '#3B82F6',
    },
    {
      id: 2,
      title: 'Inventory Report',
      description: 'Stock levels and inventory movements',
      icon: <BarChart3 size={24} color="#10B981" />,
      color: '#10B981',
    },
    {
      id: 3,
      title: 'Purchase Report',
      description: 'Purchase orders and supplier analysis',
      icon: <FileText size={24} color="#F59E0B" />,
      color: '#F59E0B',
    },
    {
      id: 4,
      title: 'Financial Report',
      description: 'Profit & loss and financial insights',
      icon: <Calendar size={24} color="#8B5CF6" />,
      color: '#8B5CF6',
    },
  ];

  const recentReports = [
    { id: 1, name: 'Monthly Sales Report - December 2024', date: '2025-01-01', size: '2.4 MB' },
    { id: 2, name: 'Inventory Status Report', date: '2025-01-07', size: '1.8 MB' },
    { id: 3, name: 'Supplier Analysis Report', date: '2025-01-05', size: '3.1 MB' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Reports" subtitle="Generate and view business reports" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Generate Reports</Text>
          
          <View style={styles.reportGrid}>
            {reportTypes.map((report) => (
              <TouchableOpacity key={report.id} style={styles.reportCard}>
                <View style={[styles.reportIcon, { backgroundColor: report.color + '15' }]}>
                  {report.icon}
                </View>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDescription}>{report.description}</Text>
                <TouchableOpacity 
                  style={[styles.generateButton, { backgroundColor: report.color }]}
                >
                  <Text style={styles.generateButtonText}>Generate</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          
          <View style={styles.recentReportsContainer}>
            {recentReports.map((report) => (
              <View key={report.id} style={styles.reportItem}>
                <View style={styles.reportInfo}>
                  <FileText size={20} color="#6B7280" />
                  <View style={styles.reportDetails}>
                    <Text style={styles.reportName}>{report.name}</Text>
                    <Text style={styles.reportMeta}>
                      {report.date} • {report.size}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.downloadButton}>
                  <Download size={20} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Insights</Text>
          
          <View style={styles.insightsGrid}>
            <View style={styles.insightCard}>
              <Text style={styles.insightValue}>+15.2%</Text>
              <Text style={styles.insightLabel}>Sales Growth</Text>
              <Text style={styles.insightPeriod}>vs last month</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightValue}>₹2.4L</Text>
              <Text style={styles.insightLabel}>Revenue</Text>
              <Text style={styles.insightPeriod}>this month</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightValue}>23</Text>
              <Text style={styles.insightLabel}>Low Stock</Text>
              <Text style={styles.insightPeriod}>items</Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightValue}>94%</Text>
              <Text style={styles.insightLabel}>Order Fulfillment</Text>
              <Text style={styles.insightPeriod}>rate</Text>
            </View>
          </View>
        </View>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  reportCard: {
    flex: 1,
    minWidth: Platform.select({
      web: '22%',
      default: '45%',
    }),
    backgroundColor: 'white',
    padding: 20,
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
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  generateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  recentReportsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportDetails: {
    marginLeft: 12,
    flex: 1,
  },
  reportName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  reportMeta: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  downloadButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  insightCard: {
    flex: 1,
    minWidth: Platform.select({
      web: '22%',
      default: '45%',
    }),
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
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
  insightValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 8,
  },
  insightLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightPeriod: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});