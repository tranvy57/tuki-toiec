import React, { useState, useCallback, memo } from 'react';
import { View, Button, Text } from 'react-native';

const Child = memo(({ onInc }: { onInc: () => void }) => {
  console.log('Child render'); // xem log
  return <Button title="Tăng" onPress={onInc} />;
});

export default function Home() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  // ❌ KHÔNG ổn định: mỗi render tạo hàm mới → Child re-render
  // const onInc = () => setCount((c) => c + 1);

  // ✅ Ổn định: chỉ tạo lại khi deps đổi (ở đây là [])
  const onInc = useCallback(() => setCount((c) => c + 1), []);

  return (
    <View>
      <Text>count: {count}</Text>
      <Child onInc={onInc} />
      <Button title="Đổi state khác" onPress={() => setOther((x) => x + 1)} />
    </View>
  );
}
