import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Button } from 'react-native';

export default function QuestionPage() {
  const { id, q } = useLocalSearchParams(); // id = test_id, q = số câu

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>
        Test {id} - Question {q}
      </Text>
      <Button title="Next" onPress={() => router.push(`/tests/${id}/${Number(q) + 1}`)} />
    </View>
  );
}
