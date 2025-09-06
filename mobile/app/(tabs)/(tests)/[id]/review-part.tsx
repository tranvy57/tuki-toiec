import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '~/constants/Color';
import { useStartTestPractice } from '~/api/attempts/useStartAttempt';
import { useCurrentTest } from '~/hooks/useCurrentTest';

// Mock part data structure based on your schema

interface ReviewPartPageProps {}

export default function ReviewPartPage({}: ReviewPartPageProps) {
  const { currentPart, currentGroup } = useCurrentTest();

  const router = useRouter();

  // Get part number from params or default to 1
//   const partNumber = parseInt(params.part as string) || 1;
//   const testId = params.id as string;

//   const partInfo = partDescriptions[partNumber as keyof typeof partDescriptions];

  const handleContinue = () => {
    router.replace({
      pathname: `/(tabs)/(tests)/[id]/question`,
    });
  };

  const handleGoBack = () => {
    router.back();
  };

//   if (!partInfo) {
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
//         <View className="flex-1 items-center justify-center">
//           <Text style={{ color: colors.foreground }}>Part not found</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <View
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 16,
          paddingHorizontal: 16,
        }}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleGoBack}
            className="-ml-2 p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-1 items-center">
            <Text className="text-lg font-bold text-white">Part {currentPart?.partNumber}</Text>
          </View>

          <View className="w-8" />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        {/* Part Info Card */}
        <View className="mx-4 mb-4 mt-6">
          <View
            className="rounded-2xl p-6"
            style={{
              backgroundColor: colors.card,
              shadowColor: colors.foreground,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
            {/* Part Number Badge */}
            <View className="mb-4 items-center">
              <View
                className="rounded-full px-6 py-2"
                style={{ backgroundColor: colors.primary + '20' }}>
                <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
                  Part {currentPart?.partNumber}
                </Text>
              </View>
            </View>

            {/* Directions */}
            <View>
              <Text className="mb-3 text-lg font-semibold" style={{ color: colors.foreground }}>
                Directions
              </Text>

              <View className="rounded-lg p-4" style={{ backgroundColor: colors.muted }}>
                <Text className="text-base leading-6" style={{ color: colors.foreground }}>
                  {currentPart?.directions}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tips Card */}
        <View className="mx-4 mb-6">
          <View
            className="rounded-2xl p-6"
            style={{
              backgroundColor: colors.warning + '10',
              borderColor: colors.warning + '30',
              borderWidth: 1,
            }}>
            <View className="mb-3 flex-row items-center">
              <AntDesign name="bulb1" size={20} color={colors.warning} style={{ marginRight: 8 }} />
              <Text className="text-lg font-semibold" style={{ color: colors.foreground }}>
                Tips
              </Text>
            </View>

            <Text className="text-sm leading-5" style={{ color: colors.mutedForeground }}>
              • Read the directions carefully before starting{'\n'}• Manage your time effectively
              {'\n'}• Mark your answers clearly{'\n'}• Review your answers if time permits
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Continue Button */}
      <View
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
        <TouchableOpacity
          onPress={handleContinue}
          className="rounded-xl px-6 py-4"
          style={{
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          activeOpacity={0.8}>
          <View className="flex-row items-center justify-center">
            <Text className="mr-2 text-lg font-bold text-white">Continue</Text>
            <AntDesign name="arrowright" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
