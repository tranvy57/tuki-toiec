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
} from 'react-native';
import { colors } from '~/constants/Color';
import { mockTests } from '~/constants/data_tests';
import { TestItem } from '~/types/testItem';



const TOEICTestsScreen = () => {
  // const handleTestPress = (testId: number) => {
  //   console.log(`Selected test: ${title} (ID: ${testId})`);
  //   // TODO: navigation
  // };

  const renderTestItem = ({ item }: { item: TestItem }) => (
    <Link href={`/(tabs)/(tests)/${item.test_id}`} asChild>
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
        // onPress={() => handleTestPress(item.test_id)}
        activeOpacity={0.7}>
        <View className="flex-1 justify-between">
          <Text
            className="mb-2 text-sm font-semibold leading-5"
            style={{ color: colors.foreground }}
            numberOfLines={3}>
            {item.title}
          </Text>

          <View className="mt-2 flex-row items-center justify-end">
            {/* <Text className="text-xs" style={{ color: colors.mutedForeground }}>
              ID: {item.test_id}
            </Text> */}
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
          {mockTests.length} practice tests available
        </Text>
      </View>

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
          data={mockTests}
          renderItem={renderTestItem}
          keyExtractor={(item) => item.test_id.toString()}
          numColumns={3} // dễ đọc hơn mobile
          scrollEnabled={false} // vì bọc trong ScrollView
          estimatedItemSize={134}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TOEICTestsScreen;
