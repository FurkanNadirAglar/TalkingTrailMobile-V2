import { AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Audio, AVPlaybackStatus } from "expo-av";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

type ParamList = {
  TalkingDetails: {
    imageUri: string;
    attractionName: string;
    description: string;
    videoUri?: string;
    audioUri: string;
  };
};

const TalkingDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "TalkingDetails">>();
  const { imageUri, attractionName, description, videoUri, audioUri } = route.params;

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPosition, setAudioPosition] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const { sound: newSound, status } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: false }
        );
        setSound(newSound);
        if (status.isLoaded) {
          setAudioDuration((status.durationMillis || 0) / 1000);
        } else {
          setAudioDuration(0);
        }
        newSound.setOnPlaybackStatusUpdate(updateAudioPosition);
      } catch (error) {
        console.error("Failed to load audio", error);
      }
    };
    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUri]);

  const updateAudioPosition = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setAudioPosition((status.positionMillis || 0) / (status.durationMillis || 1));
    }
  };

  const playSound = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const pauseSound = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    }
  };

  const onSliderChange = async (value: number) => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.setPositionAsync(value * (status.durationMillis || 1));
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const forward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.min(
          (status.positionMillis || 0) + 10000,
          status.durationMillis || 0
        );
        await sound.setPositionAsync(newPosition);
      }
    }
  };

  const backward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max((status.positionMillis || 0) - 10000, 0);
        await sound.setPositionAsync(newPosition);
      }
    }
  };

  const seekToBeginning = async () => {
    if (sound) {
      await sound.setPositionAsync(0);
    }
  };

  const seekToEnd = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.setPositionAsync(status.durationMillis || 0);
      }
    }
  };

  const handlePressWebsite = () => {
    const formattedAttractionName = attractionName.toLowerCase().replace(/\s+/g, "");
    const url = `https://www.talkingtrail.com/${formattedAttractionName}`;
    Linking.openURL(url).catch((err) => console.error("Error opening URL:", err));
  };

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/images/BackButton-1.png")}
              style={styles.backButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Image
              source={require("../../assets/images/Header.png")}
              style={{ width: wp("45%"), height: hp("7%"), marginTop: hp("1%") }}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity style={{ paddingRight: wp("2%") }}>
            <Image
              source={require("../../assets/images/Home-1.png")}
              style={{ width: wp("12%"), height: wp("12%"), marginTop: hp("1%") }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Text style={styles.imageTextContainer}>{attractionName}</Text>
          {audioUri && (
            <>
              <Slider
                style={{ width: wp("90%"), height: hp("5%"), bottom: hp("7%") }}
                minimumValue={0}
                maximumValue={1}
                value={audioPosition}
                onSlidingComplete={onSliderChange}
                minimumTrackTintColor="rgba(204, 204, 0, 204)"
                maximumTrackTintColor="#000000"
                thumbTintColor="rgba(204, 204, 0, 204)"
              />
              <Text style={styles.sliderText}>
                {formatTime(audioPosition * audioDuration)} / {formatTime(audioDuration)}
              </Text>
              <View style={styles.controls}>
                <TouchableOpacity onPress={seekToBeginning}>
                  <AntDesign name="stepbackward" size={hp("3.5%")} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={backward}>
                  <AntDesign name="banckward" size={hp("3.5%")} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={isPlaying ? pauseSound : playSound}>
                  <AntDesign name={isPlaying ? "pause" : "caretright"} size={hp("6%")} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity onPress={forward}>
                  <AntDesign name="forward" size={hp("3.5%")} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={seekToEnd}>
                  <AntDesign name="stepforward" size={hp("3.5%")} color="black" />
                </TouchableOpacity>
              </View>
            </>
          )}
          <Text style={styles.description}>{description}</Text>
          <TouchableOpacity onPress={handlePressWebsite}>
            <Text style={styles.websiteLink}>GO TO WEBSITE</Text>
          </TouchableOpacity>
          {videoUri && (
            <>
              <TouchableOpacity>
                <Text style={styles.button}>Play Video</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.button}>Stop Video</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingTop: hp("2%"),
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("3%"),
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
  },
  websiteLink: {
    marginVertical: hp("1%"),
    marginBottom: hp("3%"),
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: wp("4%"),
  },
  image: {
    width: wp("100%"),
    height: hp("40%"),
    marginBottom: hp("1%"),
    resizeMode: "stretch",
  },
  imageTextContainer: {
    position: "relative",
    bottom: hp("8%"),
    backgroundColor: "white",
    borderRadius: 15,
    padding: wp("8%"),
    width: wp("90%"),
    color: "black",
    fontWeight: "bold",
    fontSize: wp("6%"),
    textAlign: "left",
  },
description: {
  marginHorizontal: wp("8%"),
  fontSize: wp("4%"),
  textAlign: "left", // Ortalamak yerine sola yaslanır
  bottom: hp("2%"),
},
  button: {
    marginTop: hp("1%"),
    padding: hp("1.5%"),
    backgroundColor: "lightblue",
    borderRadius: 5,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: wp("90%"),
    marginVertical: hp("2%"),
    bottom: hp("5%"),
  },
  sliderText: {
    alignSelf: "center",
    bottom: hp("6%"),
    fontSize: wp("4%"),
  },
  backButtonImage: {
    width: wp("10%"),
    height: hp("4%"),
    marginTop: hp("1%"),
  },
});

export default TalkingDetails;
