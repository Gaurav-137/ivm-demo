import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Calculator, Bell, Database, Settings, CircleHelp, User, Shield, Smartphone } from 'lucide-react-native';
import { Header } from './Header';

export function Utilities() {
  const utilityItems = [
    {
      id: 1,
      title: 'Calculator',
      description: 'Quick calculations for pricing and costs',
      icon: <Calculator size={24} color="#3B82F6" />,
      color: '#3B82F6',
    },
    {
      id: 2,
      title: 'Reminders',
      description: 'Set alerts for important tasks',
      icon: <Bell size={24} color="#10B981" />,
      color: '#10B981',
    },
    {
      id: 3,
      title: 'Backup & Restore',
      description: 'Secure your business data',
      icon: <Database size={24} color="#F59E0B" />,
      color: '#F59E0B',
    },
    {
      id: 4,
      title: 'Settings',
      description: 'Configure app preferences',
      icon: <Settings size={24} color="#8B5CF6" />,
      color: '#8B5CF6',
    },
    {
      id: 5,
      title: 'Help & Support',
      description: 'Get assistance and documentation',
      icon: <CircleHelp size={24} color="#EF4444" />,
      color: '#EF4444',
    },
    {
      id: 6,
      title: 'User Profile',
      description: 'Manage your account settings',
      icon: <User size={24} color="#6B7280" />,
      color: '#6B7280',
    },
  ];

  const accountInfo = {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@inventtrack.com',
    role: 'Admin',
    avatar: 'RS'
  };

  return (
    <View style={styles.container}>
      <Header title="More" subtitle="Utilities and account settings" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{accountInfo.avatar}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{accountInfo.name}</Text>
              <Text style={styles.profileEmail}>{accountInfo.email}</Text>
              <View style={styles.roleBadge}>
                <Shield size={14} color="#3B82F6" />
                <Text style={styles.roleText}>{accountInfo.role}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Utilities</Text>
          
          <View style={styles.utilitiesGrid}>
            {utilityItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.utilityCard}>
                <View style={[styles.utilityIcon, { backgroundColor: item.color + '15' }]}>
                  {item.icon}
                </View>
                <Text style={styles.utilityTitle}>{item.title}</Text>
                <Text style={styles.utilityDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2.1.5</Text>
              <Text style={styles.statLabel}>App Version</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>45 days</Text>
              <Text style={styles.statLabel}>Last Backup</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Active Reminders</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Smartphone size={20} color="#6B7280" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Platform</Text>
                <Text style={styles.infoValue}>Mobile App (React Native)</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Database size={20} color="#6B7280" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Data Storage</Text>
                <Text style={styles.infoValue}>Cloud Sync Enabled</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Shield size={20} color="#6B7280" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Security</Text>
                <Text style={styles.infoValue}>Enterprise Grade</Text>
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
  profileSection: {
    marginBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
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
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  roleText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
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
  utilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  utilityCard: {
    flex: 1,
    minWidth: Platform.select({
      web: '30%',
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
  utilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  utilityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
    textAlign: 'center',
  },
  utilityDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoText: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});