import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AnimatedTabBarIcon } from './AnimatedTabBarIcon';
import { colors } from '../constants/Color';

export const TabAnimationDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'home', title: 'Trang chủ' },
    { name: 'file-text', title: 'Thi thử' },
    { name: 'calendar', title: 'Kế hoạch' },
    { name: 'user', title: 'Hồ sơ' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Animation Demo</Text>
      <Text style={styles.subtitle}>Với tông màu Brand Coral</Text>
      
      <View style={styles.demoTabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.demoTab,
              activeTab === index && styles.activeDemoTab,
            ]}
            onPress={() => setActiveTab(index)}
          >
            <AnimatedTabBarIcon
              name={tab.name as any}
              color={activeTab === index ? colors.primary : colors.warmGray400}
              focused={activeTab === index}
              size={22}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === index && styles.activeTabLabel,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.colorPalette}>
        <Text style={styles.paletteTitle}>Bảng màu được sử dụng:</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.primary }]} />
          <Text style={styles.colorName}>Primary (Brand Coral)</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.brandCoral200 }]} />
          <Text style={styles.colorName}>Glow Effect</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorSwatch, { backgroundColor: colors.warmGray400 }]} />
          <Text style={styles.colorName}>Inactive Color</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.warmGray600,
    textAlign: 'center',
    marginBottom: 40,
  },
  demoTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 12,
    marginHorizontal: -20,
    shadowColor: colors.brandCoral,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  demoTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeDemoTab: {
    backgroundColor: colors.brandCoral50,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    color: colors.warmGray400,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  colorPalette: {
    marginTop: 40,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderColor: colors.border,
    borderWidth: 1,
  },
  paletteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 16,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    borderColor: colors.border,
    borderWidth: 1,
  },
  colorName: {
    fontSize: 14,
    color: colors.foreground,
  },
});

