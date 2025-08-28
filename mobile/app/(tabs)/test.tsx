import { Stack } from 'expo-router';

import { StyleSheet, Text, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import TabScene from '~/components/TabScene';

export default function Test() {
  return (
    <TabScene>
      <View>
        <Text>
          Thi thử
        </Text>
      </View>
    </TabScene>
  );
}
