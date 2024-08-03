import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TrailContext } from "../../context/TrailContext"; // Adjust the file path accordingly

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
              style={{ width: 200, height: 70, marginTop: 10, left: 20 }}
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
    paddingTop: 20,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  backButton: {
    position: "absolute",
    top: 24,
  },
  backButtonImage: {
    width: 50,
    height: 40,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 20,
    bottom: 90,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    bottom: 110,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  titleText: {
    position: "relative",
    bottom: 100,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 40,
    width: 370,
    color: "black",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "left",
  },
  loadingText: {
    fontSize: 18,
    color: "gray",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  image: {
    width: 410,
    height: 260,
    marginBottom: 10,
    resizeMode: "stretch",
  },
});

export default TrailDetails;
