import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { MenuCard } from './MenuCard';

export const ExamSection = () => {
  const router = useRouter();

  return (
    <>
      <Text className="mb-4 text-lg font-bold text-foreground">Luyện thi</Text>
      <View className="mb-6 gap-3">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <MenuCard title="Thi thử online" icon="💻" onPress={() => router.push('/exam')} />
          </View>
          <View className="flex-1">
            <MenuCard title="Thi thử" icon="📝" onPress={() => router.push('/exam')} />
          </View>
        </View>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <MenuCard title="Bao đỗ" icon="🎯" badge="HOT" onPress={() => router.push('/exam')} />
          </View>
          <View className="flex-1">
            <MenuCard
              title="Lý thuyết"
              icon="📚"
              badge="FREE"
              onPress={() => router.push('/exam')}
            />
          </View>
        </View>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <MenuCard title="Nâng cấp" icon="💎" onPress={() => router.push('/upgrade')} />
          </View>
          <View className="flex-1">
            <MenuCard title="Cài đặt" icon="⚙️" onPress={() => router.push('/settings')} />
          </View>
        </View>
      </View>
    </>
  );
};
