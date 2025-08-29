import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView } from 'react-native';
import { QuestionScreen } from '~/components/practice/QuestionScreen';
import { questionsData } from '~/constants/data_questions';

export default function QuestionPage() {
  const { id, q } = useLocalSearchParams(); // id = test_id, q = số câu
  // console.log(id, q);

  return (
    <QuestionScreen />
  );
}
