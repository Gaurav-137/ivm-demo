import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'mr';

const translations = {
  en: {
    dashboard: 'Dashboard',
    purchases: 'Purchases',
    sales: 'Sales',
    admin: 'Admin',
    quickActions: 'Quick Actions',
    seeAll: 'See All',
    addProduct: 'Add Product',
    newPurchase: 'New Purchase',
    addSupplier: 'Add Supplier',
    viewReports: 'View Reports',
    welcome: 'Welcome back, Rahul!',
    subtitle: 'Your business is growing 📈',
    viewAnalytics: 'View Analytics',
    totalPurchases: 'Total Purchases',
    totalSales: 'Total Sales',
    totalOrders: 'Total Orders',
    lowStockItems: 'Low Stock Items',
    recentActivities: 'Recent Activities',
    performanceInsights: 'Performance Insights',
    orderFulfillment: 'Order Fulfillment',
    avgMonthlyRevenue: 'Avg. Monthly Revenue',
    fromLastMonth: '+15% from last month',
    selectLanguage: 'Language',
    english: 'English',
    marathi: 'Marathi',
  },
  mr: {
    dashboard: 'डॅशबोर्ड',
    purchases: 'खरेदी',
    sales: 'विक्री',
    admin: 'प्रशासन',
    quickActions: 'त्वरित क्रिया',
    seeAll: 'सर्व पहा',
    addProduct: 'नवीन उत्पादन',
    newPurchase: 'नवीन खरेदी',
    addSupplier: 'पुरवठादार जोडा',
    viewReports: 'अहवाल पहा',
    welcome: 'परत स्वागत आहे, राहुल!',
    subtitle: 'तुमचा व्यवसाय वाढत आहे 📈',
    viewAnalytics: 'विश्लेषण पहा',
    totalPurchases: 'एकूण खरेदी',
    totalSales: 'एकूण विक्री',
    totalOrders: 'एकूण ऑर्डर्स',
    lowStockItems: 'कमी साठा वस्तू',
    recentActivities: 'अलीकडील क्रिया',
    performanceInsights: 'कार्यक्षमता अंतर्दृष्टी',
    orderFulfillment: 'ऑर्डर पूर्णता',
    avgMonthlyRevenue: 'सरासरी मासिक उत्पन्न',
    fromLastMonth: 'मागील महिन्यापेक्षा +१५%',
    selectLanguage: 'भाषा',
    english: 'इंग्रजी',
    marathi: 'मराठी',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}
const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export function I18nProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [language, setLanguage] = useState<Language>('en');
  const t = (key: keyof typeof translations['en']) => translations[language][key] || key;
  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
