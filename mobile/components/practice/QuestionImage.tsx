import { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

export const QuestionImage = ({ uri }: { uri: string }) => {
  const [displayUri, setDisplayUri] = useState(uri); // chỉ đổi sau khi ảnh mới load xong
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (uri && uri !== displayUri) {
      setLoading(true);

      // preload ảnh mới
      Image.prefetch(uri).then(() => {
        if (!cancelled) {
          setDisplayUri(uri); // chỉ đổi khi load xong
          setLoading(false);
        }
      });
    }
    return () => {
      cancelled = true;
    };
  }, [uri]);

  return (
    <View
      style={{
        width: '100%',
        aspectRatio: 4 / 3,
        borderRadius: 8,
        backgroundColor: '#e5e7eb',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {displayUri && (
        <Image
          source={{ uri: displayUri }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="contain"
          transition={300} // crossfade
        />
      )}

      {loading && (
        <ActivityIndicator size="large" color="tomato" style={{ position: 'absolute' }} />
      )}
    </View>
  );
};
