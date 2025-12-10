import { AntDesign } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Link } from 'expo-router';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors } from '~/constants/Color';
import { useTests } from '~/api/tests/useTest';
import { TestItem } from '~/types/testItem';

const TOEICTestsScreen = () => {
  const { data: tests, isLoading, error } = useTests();

  const renderTestItem = ({ item }: { item: any }) => (
    <Link
      href={{
        pathname: `/(tabs)/(tests)/[id]`,
        params: { id: item.id },
      }}
      asChild>
      <TouchableOpacity
        className="m-2 flex-1 rounded-xl p-4 active:scale-95"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          minHeight: 120,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 2,
        }}
        activeOpacity={0.7}>
        <View className="flex-1 justify-between">
          <Text
            className="mb-2 text-sm font-semibold leading-5"
            style={{ color: colors.foreground }}
            numberOfLines={3}>
            {item.title}
          </Text>

          <View className="mt-2 flex-row items-center justify-end">
            <View
              className="h-6 w-6 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.primary }}>
              <Text className="text-xs font-bold" style={{ color: colors.primaryForeground }}>
                <AntDesign name="arrowright" size={12} color="white" />
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  const testList = tests || [];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {/* Top header */}
      <View className="px-4 py-6" style={{ backgroundColor: colors.primary }}>
        <Text
          className="text-center text-3xl font-bold"
          style={{ color: colors.primaryForeground }}>
          TOEIC Tests
        </Text>
        <Text className="mt-2 text-center opacity-90" style={{ color: colors.primaryForeground }}>
          {testList.length} practice tests available
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-2" style={{ color: colors.mutedForeground }}>
            Loading tests...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center text-lg font-semibold" style={{ color: colors.foreground }}>
            Failed to load tests
          </Text>
          <Text className="mt-2 text-center" style={{ color: colors.mutedForeground }}>
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Section header */}
          <View className="px-4 py-3">
            <Text className="text-lg font-semibold" style={{ color: colors.primary }}>
              All Tests
            </Text>
            <Text className="text-base" style={{ color: colors.mutedForeground }}>
              Choose a test to start practicing
            </Text>
          </View>

          {/* Grid tests */}
          <FlashList
            data={testList}
            renderItem={renderTestItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            estimatedItemSize={134}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default TOEICTestsScreen;
