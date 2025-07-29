import { useAudio } from "@/context/AudioContext";
import { AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
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

  const {
    audioUri: playingUri,
    isPlaying,
    position,
    duration,
    playAudio,
    play,
    pause,
    seekTo,
    forward,
    backward,
    stop,
  } = useAudio();

  const audioPositionNormalized = duration ? position / duration : 0;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayPause = () => {
    if (playingUri === audioUri) {
      isPlaying ? pause() : play();
    } else {
      playAudio(audioUri);
    }
  };

  const handleSliderChange = (value: number) => {
    if (duration) {
      seekTo(value * duration);
    }
  };

  const handlePressWebsite = () => {
    const formattedAttractionName = attractionName.toLowerCase().replace(/\s+/g, "");
    const url = `https://www.talkingtrail.com/trails/${formattedAttractionName}`;
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
                value={audioPositionNormalized}
                onSlidingComplete={handleSliderChange}
                minimumTrackTintColor="rgba(204, 204, 0, 204)"
                maximumTrackTintColor="#000000"
                thumbTintColor="rgba(204, 204, 0, 204)"
              />
              <Text style={styles.sliderText}>
                {formatTime(position)} / {formatTime(duration)}
              </Text>
              <View style={styles.controls}>
                <TouchableOpacity onPress={() => seekTo(0)}>
                  <AntDesign name="stepbackward" size={hp("3.5%")} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={backward}>
                  <AntDesign name="banckward" size={hp("3.5%")} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlayPause}>
                  <AntDesign
                    name={isPlaying && playingUri === audioUri ? "pause" : "caretright"}
                    size={hp("6%")}
                    color="gray"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={forward}>
                  <AntDesign name="forward" size={hp("3.5%")} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => seekTo(duration)}>
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
    textAlign: "left",
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
