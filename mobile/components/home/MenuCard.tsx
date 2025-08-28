import { Text, View, Pressable } from 'react-native';
import { colors } from '~/constants/Color';

type MenuCardProps = {
  title: string;
  icon: string;
  onPress?: () => void;
  badge?: 'HOT' | 'FREE';
};

export const MenuCard = ({ title, icon, onPress, badge }: MenuCardProps) => (
  <Pressable
    className="active:scale-98 relative rounded-2xl bg-white p-4 shadow-sm"
    onPress={onPress}
    style={{
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    }}>
    <View className="flex-row items-center">
      <View
        className="mr-4 h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: colors.warmGray100 }}>
        <Text className="text-xl">{icon}</Text>
      </View>
      <Text className="flex-1 text-base font-medium text-foreground">{title}</Text>
    </View>
    {badge && (
      <View
        className="absolute right-2 top-2 rounded px-2 py-1"
        style={{
          backgroundColor: badge === 'HOT' ? colors.brandCoral : colors.success,
        }}>
        <Text className="text-xs font-bold text-white">{badge}</Text>
      </View>
    )}
  </Pressable>
);
