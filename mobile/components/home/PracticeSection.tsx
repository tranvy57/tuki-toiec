import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { PracticeCard } from './PracticeCard';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '~/constants/Color';

export const PracticeSection = () => {
  const router = useRouter();

  return (
    <>
      <Text className="mb-4 w-full text-lg font-bold text-foreground">Luyện tập</Text>
      <View className="mb-6 flex w-full flex-row justify-around">
        <PracticeCard
          title="Nghe Hiểu"
          icon={<FontAwesome5 name="headphones" size={24} color={colors.primary} />}
          onPress={() => router.push('/review?skill=listening')}
        />
        <PracticeCard
          title="Đọc Hiểu"
          icon={<FontAwesome5 name="book" size={24} color={colors.primary} />}
          onPress={() => router.push('/review?skill=reading')}
        />
        <PracticeCard
          title="Luyện nói"
          icon={<FontAwesome5 name="microphone" size={24} color={colors.primary} />}
          onPress={() => router.push('/review?skill=speaking')}
        />
        <PracticeCard
          title="Viết"
          icon={<FontAwesome5 name="pencil-alt" size={24} color={colors.primary} />}
          onPress={() => router.push('/review?skill=writing')}
        />
      </View>
    </>
  );
};
