import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, Calendar, ChartBar as BarChart3, Target, Zap, Brain } from 'lucide-react-native';
import { Header } from './Header';
import { LinearGradient } from 'expo-linear-gradient';

export function Predictions() {
  const predictions = [
    {
      id: 1,
      title: 'Stock Depletion Alert',
      description: 'Premium Headphones will run out of stock in 5 days',
      type: 'warning',
      confidence: 92,
      icon: AlertTriangle,
      color: '#F59E0B',
      gradient: ['#F59E0B', '#D97706'],
      action: 'Reorder Now'
    },
    {
      id: 2,
      title: 'Sales Forecast',
      description: 'Expected 15% increase in sales next week',
      type: 'positive',
      confidence: 87,
      icon: TrendingUp,
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
      action: 'View Details'
    },
    {
      id: 3,
      title: 'Demand Prediction',
      description: 'Wireless Mouse demand will spike by 25%',
      type: 'info',
      confidence: 78,
      icon: Target,
      color: '#3B82F6',
      gradient: ['#3B82F6', '#1E40AF'],
      action: 'Prepare Stock'
    },
    {
      id: 4,
      title: 'Seasonal Trend',
      description: 'Electronics category shows declining trend',
      type: 'negative',
      confidence: 84,
      icon: TrendingDown,
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626'],
      action: 'Adjust Strategy'
    }
  ];

  const insights = [
    {
      title: 'Best Selling Period',
      value: 'Mon-Wed',
      description: '60% of weekly sales',
      icon: Calendar
    },
    {
      title: 'Peak Hours',
      value: '2-5 PM',
      description: 'Highest customer activity',
      icon: Zap
    },
    {
      title: 'Profit Margin',
      value: '23.5%',
      description: 'Above industry average',
      icon: BarChart3
    }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#10B981';
    if (confidence >= 75) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.container}>
      <Header title="Predictions" subtitle="AI-powered business insights" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Brain size={32} color="white" />
            <Text style={styles.heroTitle}>AI Predictions</Text>
            <Text style={styles.heroSubtitle}>
              Smart insights to optimize your inventory and boost sales
            </Text>
          </View>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400' }}
            style={styles.heroImage}
          />
        </LinearGradient>

        {/* Quick Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Insights</Text>
          <View style={styles.insightsGrid}>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <View style={styles.insightIcon}>
                  <insight.icon size={20} color="#3B82F6" />
                </View>
                <Text style={styles.insightValue}>{insight.value}</Text>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>{insight.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Predictions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Predictions</Text>
            <TouchableOpacity style={styles.refreshButton}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.predictionsContainer}>
            {predictions.map((prediction) => (
              <TouchableOpacity key={prediction.id} style={styles.predictionCard}>
                <LinearGradient 
                  colors={[prediction.color + '10', prediction.color + '20']} 
                  style={styles.predictionGradient}
                >
                  <View style={styles.predictionHeader}>
                    <View style={[styles.predictionIcon, { backgroundColor: prediction.color }]}>
                      <prediction.icon size={20} color="white" />
                    </View>
                    <View style={styles.confidenceContainer}>
                      <Text style={styles.confidenceLabel}>Confidence</Text>
                      <View style={styles.confidenceBar}>
                        <View 
                          style={[
                            styles.confidenceFill, 
                            { 
                              width: `${prediction.confidence}%`,
                              backgroundColor: getConfidenceColor(prediction.confidence)
                            }
                          ]} 
                        />
                      </View>
                      <Text style={[styles.confidenceText, { color: getConfidenceColor(prediction.confidence) }]}>
                        {prediction.confidence}%
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.predictionTitle}>{prediction.title}</Text>
                  <Text style={styles.predictionDescription}>{prediction.description}</Text>
                  
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: prediction.color }]}>
                    <Text style={styles.actionButtonText}>{prediction.action}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trend Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trend Analysis</Text>
          
          <View style={styles.trendCard}>
            <LinearGradient colors={['#EBF8FF', '#DBEAFE']} style={styles.trendGradient}>
              <View style={styles.trendHeader}>
                <BarChart3 size={24} color="#3B82F6" />
                <Text style={styles.trendTitle}>Sales Trend</Text>
              </View>
              
              <View style={styles.trendStats}>
                <View style={styles.trendStat}>
                  <Text style={styles.trendValue}>+18%</Text>
                  <Text style={styles.trendLabel}>This Month</Text>
                </View>
                <View style={styles.trendStat}>
                  <Text style={styles.trendValue}>+7%</Text>
                  <Text style={styles.trendLabel}>This Week</Text>
                </View>
                <View style={styles.trendStat}>
                  <Text style={styles.trendValue}>+3%</Text>
                  <Text style={styles.trendLabel}>Today</Text>
                </View>
              </View>
              
              <Text style={styles.trendDescription}>
                Your sales are consistently growing. Consider expanding your top-performing product categories.
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Recommendations</Text>
          
          <View style={styles.recommendationsContainer}>
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationIcon}>
                <Target size={20} color="#10B981" />
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Optimize Pricing</Text>
                <Text style={styles.recommendationDescription}>
                  Increase profit margins by 12% with dynamic pricing
                </Text>
              </View>
            </View>
            
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationIcon}>
                <Zap size={20} color="#F59E0B" />
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Bundle Products</Text>
                <Text style={styles.recommendationDescription}>
                  Create bundles to increase average order value
                </Text>
              </View>
            </View>
            
            <View style={styles.recommendationCard}>
              <View style={styles.recommendationIcon}>
                <Brain size={20} color="#8B5CF6" />
              </View>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>Inventory Optimization</Text>
                <Text style={styles.recommendationDescription}>
                  Reduce holding costs by 15% with smart stocking
                </Text>
              </View>
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
  heroSection: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  heroImage: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.2,
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
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  refreshButton: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  refreshText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  insightsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  insightDescription: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  predictionsContainer: {
    gap: 16,
  },
  predictionCard: {
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
  predictionGradient: {
    padding: 20,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  predictionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confidenceContainer: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: 16,
  },
  confidenceLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  confidenceBar: {
    width: 80,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },
  confidenceText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  predictionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  predictionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  trendCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  trendGradient: {
    padding: 20,
  },
  trendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  trendTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  trendStat: {
    alignItems: 'center',
  },
  trendValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  trendLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  trendDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  recommendationsContainer: {
    gap: 12,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 16,
  },
});