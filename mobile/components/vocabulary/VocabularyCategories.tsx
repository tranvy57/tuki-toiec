import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/Color';

interface VocabularyCategoriesProps {
  selectedCategory?: string;
  onCategorySelect: (categoryId: string) => void;
}

export const VocabularyCategories: React.FC<VocabularyCategoriesProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  const getCategoryColor = (colorName: string) => {
    return colors[colorName as keyof typeof colors] || colors.primary;
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'business':
        return 'briefcase-outline';
      case 'technology':
        return 'laptop-outline';
      case 'academic':
        return 'school-outline';
      case 'daily':
        return 'home-outline';
      case 'advanced':
        return 'trophy-outline';
      default:
        return 'book-outline';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All Categories Option */}
        <TouchableOpacity
          style={[
            styles.categoryCard,
            !selectedCategory && styles.selectedCard,
            { borderColor: colors.primary }
          ]}
          onPress={() => onCategorySelect('')}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <Ionicons name="apps-outline" size={20} color={colors.primaryForeground} />
          </View>
          <Text style={[
            styles.categoryName,
            !selectedCategory && styles.selectedText
          ]}>
            All
          </Text>
        </TouchableOpacity>

        {/* Category Options */}
        {/* {vocabularyCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const categoryColor = getCategoryColor(category.color);
          
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                isSelected && styles.selectedCard,
                { borderColor: categoryColor }
              ]}
              onPress={() => onCategorySelect(category.id)}
            >
              <View style={[styles.iconContainer, { backgroundColor: categoryColor }]}>
                <Ionicons 
                  name={getCategoryIcon(category.id) as any} 
                  size={20} 
                  color={colors.primaryForeground} 
                />
              </View>
              <Text style={[
                styles.categoryName,
                isSelected && styles.selectedText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })} */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 80,
  },
  selectedCard: {
    backgroundColor: colors.accent,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.foreground,
    textAlign: 'center',
  },
  selectedText: {
    color: colors.accentForeground,
    fontWeight: '600',
  },
});

