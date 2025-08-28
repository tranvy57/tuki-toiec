import React, { ReactNode } from 'react';
import { Text, View, Pressable } from 'react-native';
import { colors } from '~/constants/Color';

type PracticeCardProps = {
  title: string;
  icon: ReactNode;
  onPress?: () => void;
};

export const PracticeCard = ({ title, icon, onPress }: PracticeCardProps) => (
  <Pressable
    onPress={onPress}
    className="mr-3 items-center rounded-2xl bg-white shadow-sm active:scale-95"
    style={{
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    }}>
    <View
      className="mb-3 h-14 w-14 items-center justify-center rounded-xl"
      style={{ backgroundColor: colors.brandCoral50 }}>
      {icon}
    </View>

    <Text className="text-center text-sm font-medium text-foreground">{title}</Text>
  </Pressable>
);
