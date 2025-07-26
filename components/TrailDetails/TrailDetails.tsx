import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { TrailContext } from "../../context/TrailContext";

const TrailDetails: React.FC = () => {
  const navigation = useNavigation();
  const { shortName } = useContext(TrailContext) as { shortName?: string };
  const [trailData, setTrailData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrailData = async () => {
      try {
        const response = await fetch(
          `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName?.replace(
            /\s/g,
            "_"
          )}/project.json`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTrailData(data);
      } catch (error) {
        setError((error as Error).message);
        console.error("Error fetching trail data:", error);
      }
    };

    fetchTrailData();
  }, [shortName]);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Image
              source={require("../../assets/images/BackButton-1.png")}
              style={styles.backButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Image
              source={require("../../assets/images/Header.png")}
              style={styles.headerImage}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity style={{ paddingRight: wp(2) }}>
            <Image
              source={require("../../assets/images/Home-1.png")}
              style={styles.homeIcon}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {trailData && trailData.Images && trailData.Images[0] && (
          <Image
            source={{
              uri: `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName?.replace(
                /\s/g,
                "_"
              )}/${trailData.Images[0]}`,
            }}
            style={styles.image}
            resizeMode="stretch"
          />
        )}

        <View style={styles.textContainer}>
          {error ? (
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : trailData ? (
            <>
              <Text style={styles.titleText}>{trailData.Name}</Text>
              <Text style={styles.subTitle}>{trailData.Blurb}</Text>
              <Text style={styles.descriptionText}>
                {trailData.Description}
              </Text>
            </>
          ) : (
            <Text style={styles.loadingText}>Loading...</Text>
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
    paddingTop: hp(3),
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(2.5),
  },
  backButton: {
    position: "absolute",
    top: hp(3),
  },
  backButtonImage: {
    width: wp(12),
    height: hp(5),
  },
  headerImage: {
    width: wp(50),
    height: hp(9),
    marginTop: hp(1),
    left: wp(5),
  },
  homeIcon: {
    width: wp(12),
    height: wp(12),
    marginTop: hp(1),
    left: wp(2),
  },
  image: {
    width: wp(100),
    height: hp(30),
    marginBottom: hp(1.5),
    resizeMode: "stretch",
  },
  textContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },
  titleText: {
    position: "relative",
    bottom: hp(12),
    backgroundColor: "white",
    borderRadius: wp(3),
    padding: wp(8),
    width: wp(90),
    color: "black",
    fontWeight: "bold",
    fontSize: wp(6),
    textAlign: "left",
  },
  subTitle: {
    fontSize: wp(4),
    fontWeight: "bold",
    bottom: hp(14),
    paddingHorizontal: wp(8),
    textAlign: "left",
  },
  descriptionText: {
    fontSize: wp(3.5),
    lineHeight: wp(5.5),
    textAlign: "left",
    paddingHorizontal: wp(8),
    bottom: hp(11),
  },
  loadingText: {
    fontSize: wp(4.5),
    color: "gray",
  },
  errorText: {
    fontSize: wp(4.5),
    color: "red",
  },
});

export default TrailDetails;
