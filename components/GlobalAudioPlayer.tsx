import { AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useAudio } from "../context/AudioContext";

const GlobalAudioPlayer = () => {
  const {
    isPlaying,
    position,
    duration,
    play,
    pause,
    seekTo,
    forward,
    backward,
    audioUri,
    stop,
  } = useAudio();

  if (!audioUri) return null;

  const audioPositionNormalized = duration ? position / duration : 0;

  const formatTime = (time: number) => {
    if (time <= 0) return "0:00";
    const totalSeconds = Math.floor(time / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity onPress={backward} style={styles.button}>
          <AntDesign name="banckward" size={hp("3%")} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={isPlaying ? pause : play} style={styles.playPauseButton}>
          <AntDesign name={isPlaying ? "pause" : "caretright"} size={hp("4.5%")} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={forward} style={styles.button}>
          <AntDesign name="forward" size={hp("3%")} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={stop} style={styles.stopButton}>
          <AntDesign name="closecircle" size={hp("3%")} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.sliderContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Slider
          style={{ flex: 1, marginHorizontal: wp("2%") }}
          minimumValue={0}
          maximumValue={1}
          value={audioPositionNormalized}
          minimumTrackTintColor="rgba(204, 204, 0, 1)"
          maximumTrackTintColor="rgba(255,255,255,0.4)"
          thumbTintColor="rgba(204, 204, 0, 1)"
          onSlidingComplete={(val) => seekTo(val * duration)}
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#333",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "column",
    zIndex: 9999,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  button: {
    padding: hp("0.5%"),
  },
  playPauseButton: {
    padding: hp("0.5%"),
  },
  stopButton: {
    padding: hp("0.5%"),
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    color: "white",
    fontSize: wp("3.5%"),
    width: wp("10%"),
    textAlign: "center",
  },
});

export default GlobalAudioPlayer;
