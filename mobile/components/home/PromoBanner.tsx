import { View, Image } from 'react-native';

export const PromoBanner = () => {
  return (
    <View
      className="relative mb-6 overflow-hidden rounded-2xl p-4"
      style={{ backgroundColor: '#E3F2FD' }}>
      <Image
        source={{
          uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GwZbSEY7glVKvXusgg41Gs63b7yT2M.png',
        }}
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
      />
    </View>
  );
};
