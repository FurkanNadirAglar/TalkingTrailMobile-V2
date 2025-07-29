import { Audio, AVPlaybackStatus } from "expo-av";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type AudioContextType = {
  sound: Audio.Sound | null;
  isPlaying: boolean;
  audioUri: string | null;
  position: number;
  duration: number;
  playAudio: (uri: string) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seekTo: (value: number) => Promise<void>;
  stop: () => Promise<void>;
  forward: () => Promise<void>;
  backward: () => Promise<void>;
  unload: () => Promise<void>;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const updateStatusRef = useRef<(status: AVPlaybackStatus) => void>();

  updateStatusRef.current = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying || false);
    } else {
      setPosition(0);
      setDuration(0);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      unload();
    };
  }, []);

  const unload = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setAudioUri(null);
      setPosition(0);
      setDuration(0);
    }
  };

const playAudio = async (uri: string) => {
  try {
    if (sound) {
      await unload();
    }

    setAudioUri(uri);
    setPosition(0);
    setDuration(0);
    setIsPlaying(true);

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );

    setSound(newSound);

    const status = await newSound.getStatusAsync();
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying || false);
    }

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (updateStatusRef.current) updateStatusRef.current(status);
    });
  } catch (error) {
    console.error("Audio play error:", error);
  }
};


  const play = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await sound.playAsync();
      }
    }
  };

  const pause = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.pauseAsync();
      }
    }
  };

  const seekTo = async (value: number) => {
    if (sound && duration > 0) {
      const seekPosition = Math.min(Math.max(value, 0), duration);
      await sound.setPositionAsync(seekPosition);
    }
  };

 const stop = async () => {
  if (sound) {
    await sound.stopAsync();
    await unload();
  }

  setAudioUri(null);
  setPosition(0);
  setDuration(0);
  setIsPlaying(false);
};


  const forward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPos = Math.min((status.positionMillis || 0) + 10000, status.durationMillis || 0);
        await sound.setPositionAsync(newPos);
      }
    }
  };

  const backward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPos = Math.max((status.positionMillis || 0) - 10000, 0);
        await sound.setPositionAsync(newPos);
      }
    }
  };

  return (
    <AudioContext.Provider
      value={{
        sound,
        isPlaying,
        audioUri,
        position,
        duration,
        playAudio,
        play,
        pause,
        seekTo,
        stop,
        forward,
        backward,
        unload,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};
