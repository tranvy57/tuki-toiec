'use client';
import { View, ScrollView } from 'react-native';
import { colors } from '~/constants/Color';
import { Header } from '~/components/home/Header';
import { PromoBanner } from '~/components/home/PromoBanner';
import { PracticeSection } from '~/components/home/PracticeSection';
import { ExamSection } from '~/components/home/ExamSection';
import { ProgressSection } from '~/components/home/ProgressSection';
import { AnimationDurations } from '~/constants/Animation';

export default function Home() {
  for (const [key, value] of Object.entries(AnimationDurations)) {
    console.log(key);
  }
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <Header />
      
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}>
        
        <PromoBanner />
        <PracticeSection />
        <ExamSection />
        <ProgressSection />

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
