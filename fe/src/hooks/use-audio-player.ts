import { useRef, useState, useEffect } from "react";

export function useAudioPlayer(audioUrl: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);

  const formatTime = (sec: number) => {
    if (!sec) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    console.log("togglePlay", isPlaying);
    if (isPlaying) audio.pause();
    else audio.play();
  };

  const onSeek = (val: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = val[0];
    audio.currentTime = newTime;
    setPosition(newTime);
  };

  const onVolumeChange = (val: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const vol = val[0];
    audio.volume = vol;
    setVolume(vol);
  };

  const onSpeedChange = (val: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rate = val[0];
    audio.playbackRate = rate;
    setSpeed(rate);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => setDuration(audio.duration || 0);
    const handleTimeUpdate = () => setPosition(audio.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setPosition(0);
    };

    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Sync volume & speed initial
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = speed;
    }
  }, [volume, speed]);

  return {
    audioRef,
    isPlaying,
    duration,
    position,
    volume,
    speed,
    formatTime,
    togglePlay,
    onSeek,
    onVolumeChange,
    onSpeedChange,
  };
}
