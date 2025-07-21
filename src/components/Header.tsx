import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Search, Bell, Globe } from 'lucide-react-native';
import { COLORS, FONTS } from '../constants';
import { useI18n } from '../i18n';


interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
}

export function Header({ title, subtitle, showSearch = true }: HeaderProps) {
  const { language, setLanguage, t } = useI18n();
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Search bar commented out as requested
        {showSearch && (
          <View style={styles.searchContainer}>
            <Search size={20} color={COLORS.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        )}
        */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Bell size={20} color={COLORS.gray} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Globe size={20} color={COLORS.gray} />
          </TouchableOpacity>
          <View style={styles.languageSelector}>
            <TouchableOpacity onPress={() => setLanguage(language === 'en' ? 'mr' : 'en')}>
              <Text style={styles.languageText}>
                {language === 'en' ? t('english') : t('marathi')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}
// ...existing code...



const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.dark,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  languageSelector: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
  },
  languageText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: '#374151',
  },
  titleContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.dark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.gray,
  },
});