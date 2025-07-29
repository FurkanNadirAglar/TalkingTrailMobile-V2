import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ImageStyle,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { TrailContext } from "../../context/TrailContext";

interface PlaceData {
  shortName: string;
  label: string;
  data: {
    Images?: string[];
    Trails?: Record<string, { Attractions: Record<string, any> }>;
  };
}

const HomeScreen: React.FC = () => {
  const { setShortName } = useContext(TrailContext)!;
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchPlaceData() {
      try {
        const projectsList = [
          { key: "Alliance_Nebraska", label: "Alliance Nebraska" },
          { key: "Battle_Lake", label: "Battle Lake Minnesota" },
          { key: "Bismarck_Alley_Art", label: "Bismarck Alley Art" },
          { key: "Camp_Hancock_Historic_Site", label: "Camp Hancock Historic Site"},
          { key: "Carter_County_Montana", label: "Carter County Montana" },
          { key: "MinotAirMuseum", label: "Dakota Territory Air Museum" },
          { key: "EnchantedHwy", label: "Enchanted Highway" },
          { key: "fargoairmuseum", label: "Fargo Air Museum" },
          { key: "Former_Governors_Mansion", label: "Former Governors Mansion",},
          { key: "fortlincoln", label: "Fort Lincoln State Park" },
          { key: "Frontier_Gateway_Museum", label: "Frontier Gateway Museum" },
          { key: "Garrison_Talking_Trail", label: "Garrison ND Talking Trail" },
          { key: "Grand_Forks", label: "Grand Forks ND" },
          { key: "Historic_Downtown_Bismarck", label: "Historic Downtown Bismarck"},
          { key: "jamestowntalkingtrail", label: "Jamestown Talking Trail" },
          { key: "Kenmare_ND", label: "Kenmare Talking Trail" },
          { key: "Lanesboro", label: "Lanesboro Minnesota" },
          { key: "Lawton_OK", label: "Lawton OK Talking Trail" },
          { key: "Logan_County_Colorado", label: "Logan County Colorado Talking Trail"},
          { key: "Mercer_County_ND", label: "Mercer County ND" },
          { key: "Missouri_River_Country", label: "Missouri River Country Talking Trail"},
          { key: "Missour_River_Heritage_Mural", label: "Missouri River Heritage Mural"},
          { key: "Nelson_County", label: "Nelson County" },
          { key: "New_York_Mills_MN", label: "New York Mills Minnesota" },
          { key: "North_Dakota_Capitol_Grounds", label: "North Dakota Capitol Grounds"},
          { key: "NPNHA", label: "Northern Plains National Heritage Area" },
          { key: "oldredtrail", label: "Old Red Trail Scenic Byway" },
          { key: "Otter_Tail_County", label: "Otter Tail County" },
          { key: "Overland_Trail_Museum", label: "Overland Trail Museum" },
          { key: "Ponca_Tribe_of_Nebraska", label: "Ponca Tribe of Nebraska" },
          { key: "Rendezvous_Region", label: "Rendezvous Region Talking Trail"},
          { key: "Standing_Rock_Sioux_Tribe", label: "Standing Rock Sioux Tribe"},
          { key: "Sully_County_SD", label: "Sully County South Dakota" },
          { key: "Tri_County_Alliance", label: "Tri County Alliance Germans from Russia"},
          { key: "Turtle_Mountain_Band_of_Chippewa", label: "Turtle Mountain Band of Chippewa Indians Talking Trail"},
          { key: "Whitefish_Dunes_State_Park", label: "Whitefish Dunes State Park"},
        ];

        const placesData: PlaceData[] = [];

       for (const project of projectsList) {
  try {
    const response = await fetch(
      `https://talkingtrailstorage.blob.core.windows.net/projects/${project.key}/project.json`
    );

    if (!response.ok) {
      console.warn(`Failed to fetch project ${project.key}: ${response.status} ${response.statusText}`);
      continue;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.warn(`Unexpected content type for ${project.key}:`, text);
      continue;
    }

    const data = await response.json();
    placesData.push({ shortName: project.key, label: project.label, data });
  } catch (error) {
    console.error(`Error fetching or parsing project ${project.key}:`, error);
  }
}


        setPlaces(placesData);
      } catch (error) {
        console.error("Error fetching place data:", error);
      }
    }

    fetchPlaceData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/images/Header.png")}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.aboutButton}
          onPress={() => router.push({ pathname: "/(routes)/AboutUs" })}
        >
          <Image
            source={require("../../assets/images/Home-1.png")}
            style={styles.homeIcon}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View>
          {places.map(({ shortName, label, data }) => (
            <TouchableOpacity
              key={shortName}
              onPress={() => {
                setShortName(shortName);
                router.push({
                  pathname: "/(tabs)/DetailsScreen",
                  params: { shortName },
                });
              }}
              style={styles.placeContainer}
            >
              <Image
                source={{
                  uri:
                    data && data.Images && data.Images.length > 0
                      ? `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName}/${data.Images[0]}`
                      : undefined,
                }}
                style={styles.placeImage}
                resizeMode="stretch"
              />
              <View style={styles.overlay}>
                <View style={styles.overlayContent}>
                  <Text style={styles.overlayText}>{label}</Text>
                </View>
                <Image
                  source={require("../../assets/images/DownArrow-1-rev.png")}
                  style={styles.downArrowIcon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: wp("100%"),
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
  } as ViewStyle,
  headerImage: {
    width: wp("60%"),
    height: hp("6%"),
    marginTop: hp("1.5%"),
    marginLeft: wp("10%"),
  } as ImageStyle,
  aboutButton: {
    paddingRight: wp("2%"),
  } as ViewStyle,
  homeIcon: {
    width: wp("12%"),
    height: wp("12%"),
    marginTop: hp("1%"),
    left: wp("5%"),
  } as ImageStyle,
  placeContainer: {
    position: "relative",
  } as ViewStyle,
  placeImage: {
    width: wp("100%"),
    height: wp("70%"),
  } as ImageStyle,
  overlay: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: hp("1.2%"),
    width: wp("100%"),
    flexDirection: "row",
    justifyContent: "space-between",
    height: hp("11%"),
  } as ViewStyle,
  overlayContent: {
    flexDirection: "column",
  } as ViewStyle,
  overlayText: {
    color: "#fff",
    fontSize: hp("2.6%"),
    fontWeight: "bold",
  } as TextStyle,
  overlayTextTalking: {
    color: "lightgray",
    fontSize: hp("1.6%"),
    marginTop: hp("0.5%"),
  } as TextStyle,
  downArrowIcon: {
    width: wp("15%"),
    height: wp("15%"),
    position: "absolute",
    right: wp("2%"),
  } as ImageStyle,
});

export default HomeScreen;
