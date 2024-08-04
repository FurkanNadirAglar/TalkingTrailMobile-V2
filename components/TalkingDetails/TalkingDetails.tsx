import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

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
              style={{ width: 200, height: 70, marginTop: 10, left: 5 }}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity style={{ paddingRight: 8 }}>
            <Image
              source={require("../../assets/images/Home-1.png")}
              style={{ width: 50, height: 50, marginTop: 10, left: 10 }}
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
                style={{ width: "95%", height: 40 }}
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
                <TouchableOpacity style={{ right: 100 }} onPress={seekToBeginning}>
                  <AntDesign name="stepbackward" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{ right: 70 }} onPress={backward}>
                  <AntDesign name="banckward" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={isPlaying ? pauseSound : playSound}>
                  <AntDesign name={isPlaying ? "pause" : "caretright"} size={50} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity style={{ left: 70 }} onPress={forward}>
                  <AntDesign name="forward" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{ left: 100 }} onPress={seekToEnd}>
                  <AntDesign name="stepforward" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </>
          )}
          <Text style={styles.subTitle}>SCRIPT DESCRIPTION</Text>
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
    paddingTop: 20,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  subTitle: {
    fontSize: 14,
    marginRight: 189,
    textAlign: "left",
    marginTop: 25,
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
  },
  websiteLink: {
    marginVertical: 10,
    marginBottom: 20,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  image: {
    width: 420,
    height: 360,
    marginBottom: 10,
    resizeMode: "stretch",
  },
  imageTextContainer: {
    position: "relative",
    bottom: 100,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 40,
    width: 370,
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "left",
  },
  description: {
    marginHorizontal: 40,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "lightblue",
    borderRadius: 5,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  audioControls: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: "auto",
  },
  sliderText: {
    alignSelf: "center",
    marginTop: 10,
  },
  backButtonImage: {
    width: 50,
    height: 40,
    top: 5,
    right: 10,
  },
});

export default TalkingDetails;
