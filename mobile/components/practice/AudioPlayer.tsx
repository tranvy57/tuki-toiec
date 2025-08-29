import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Feather, AntDesign } from '@expo/vector-icons';

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

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  async function togglePlay() {
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
        if (status.isLoaded && status.isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function resetAudio() {
    if (sound) {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      setIsPlaying(false);
    }
  }

  function updateStatus(status: any) {
    if (status.isLoaded && !isSeeking) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  }

  async function onSlidingComplete(value: number) {
    if (sound) {
      await sound.setPositionAsync(value);
      setIsSeeking(false);
    }
  }

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  return (
    <View className="rounded-2xl bg-white p-4 shadow-md">
      <View className="flex-row items-center">
        {/* Play/Pause */}
        <TouchableOpacity
          onPress={togglePlay}
          disabled={isLoading}
          className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-blue-500"
          style={{ opacity: isLoading ? 0.5 : 1 }}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : isPlaying ? (
            <Feather name="pause" size={24} color="white" />
          ) : (
            <Feather name="play" size={24} color="white" />
          )}
        </TouchableOpacity>

        {/* Reset */}
        <TouchableOpacity
          onPress={resetAudio}
          className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-gray-400">
          <AntDesign name="reload1" size={22} color="white" />
        </TouchableOpacity>

        {/* Status text */}
        <View className="flex-1">
          <Text className="font-medium text-gray-800">
            {isLoading ? 'Loading...' : isPlaying ? 'Playing...' : 'Tap play to start'}
          </Text>
        </View>
      </View>

      {/* Progress slider */}
      {duration > 0 && (
        <View className="mt-4">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onValueChange={() => setIsSeeking(true)}
            onSlidingComplete={onSlidingComplete}
            minimumTrackTintColor="#2563eb"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#2563eb"
          />
          <View className="mt-1 flex-row justify-between">
            <Text className="text-xs text-gray-600">{formatTime(position)}</Text>
            <Text className="text-xs text-gray-600">{formatTime(duration)}</Text>
          </View>
        </View>
      )}
    </View>
  );
};
