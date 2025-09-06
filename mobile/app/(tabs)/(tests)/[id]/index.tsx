import { router } from 'expo-router';
import { useEffect } from 'react';
import { useStartTestPractice } from '~/api/attempts/useStartAttempt';
import TestStartScreen from '~/components/practice/StartTest';
import { useCurrentTest } from '~/hooks/useCurrentTest';

export default function TestStartPage() {
  const { mutate, data, isPending, isSuccess, isError } = useStartTestPractice();
  const { setCurrentPart, setTest } = useCurrentTest();

  useEffect(() => {
    // Start the test when the component mounts
    mutate('9d3258e6-0e03-4153-a99a-3bfb3daa8c67', {
      onSuccess: (res) => {
        setTest(res.test);
      },
      onError: (err) => {
        console.error('Mutation failed:', err);
      },
    });
  }, []);

  const handleStartTest = () => {
    // setCurrentPart(1); // Set the current part to 1 when starting the test
    router.push({
      pathname: '/(tabs)/(tests)/[id]/review-part',
      params: {
        id: 'TEST001',
      },
    });
  };

  const handleGoBack = () => {
    router.back();
    // Navigate back to test list
  };

  return (
    <TestStartScreen
      testTitle="TOEIC Practice Test - Full Length"
      testId="TEST001"
      onStartTest={handleStartTest}
      onGoBack={handleGoBack}
    />
  );
}
