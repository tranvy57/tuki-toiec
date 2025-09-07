import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

interface AudioPlayerProps {
  audioUrl: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const formatTime = (ms: number) =>
    `${Math.floor(ms / 60000)}:${Math.floor((ms % 60000) / 1000)
      .toString()
      .padStart(2, '0')}`;

  const updateStatus = (status: AVPlaybackStatus) => {
    if (!status.isLoaded || isSeeking) return;
    setPosition(status.positionMillis ?? 0);
    setDuration(status.durationMillis ?? 0);
    if (status.didJustFinish) setIsPlaying(false);
  };

  const togglePlay = async () => {
    try {
      if (!sound) {
        setIsLoading(true);
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
          updateStatus
        );
        setSound(newSound);
        setIsPlaying(true);
      } else {
        const status = await sound.getStatusAsync();
        if (!status.isLoaded) return;
        status.isPlaying ? await sound.pauseAsync() : await sound.playAsync();
        setIsPlaying(!status.isPlaying);
      }
    } catch (e) {
      console.error('Audio error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const onSlidingStart = () => {
    setIsSeeking(true);
    setShowTooltip(true);
  };

  const onValueChange = (val: number) => {
    setSeekValue(val);
  };

  const onSlidingComplete = async (val: number) => {
    if (sound) await sound.setPositionAsync(val);
    setPosition(val);
    setIsSeeking(false);
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  // tính vị trí bubble
  const thumbPosition = duration > 0 ? (isSeeking ? seekValue : position) / duration : 0;
  const bubbleLeft = thumbPosition * (SCREEN_W - 120); // 120 ~ padding + thumb width

  return (
    <View className="rounded-xl bg-white p-4 shadow-sm">
      <View className="flex-row items-center">
        {/* Play/Pause */}
        <TouchableOpacity
          onPress={togglePlay}
          disabled={isLoading}
          className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-blue-500"
          style={{ opacity: isLoading ? 0.5 : 1 }}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Feather name={isPlaying ? 'pause' : 'play'} size={24} color="white" />
          )}
        </TouchableOpacity>

        {/* Slider + Tooltip */}
        {duration > 0 && (
          <View style={{ flex: 1 }}>
            <View>
              <View style={{ height: 12, justifyContent: 'center' }}>
                <Slider
                  style={{ width: '100%', height: 20 }} // container cao hơn 1 chút
                  minimumValue={0}
                  maximumValue={duration}
                  value={isSeeking ? seekValue : position}
                  onSlidingStart={onSlidingStart}
                  onValueChange={onValueChange}
                  onSlidingComplete={onSlidingComplete}
                  minimumTrackTintColor="#2563eb"
                  maximumTrackTintColor="#e5e7eb" // màu track xám nhạt hơn
                  thumbTintColor="#2563eb" // màu nút trùng màu track
                />
              </View>

              {/* Tooltip popup nổi */}
              <View style={[styles.tooltip, { left: bubbleLeft }]}>
                <Text style={styles.tooltipText}>{formatTime(seekValue)}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    bottom: 30, // nằm trên slider
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'black',
    borderRadius: 6,
    alignSelf: 'center',
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
