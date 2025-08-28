// app/(tabs)/home.tsx
import TabScene from '../../components/TabScene';
import { View, Text } from 'react-native';

export default function Profile() {
  return (
    <TabScene>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Profile</Text>
      </View>
    </TabScene>
  );
}
