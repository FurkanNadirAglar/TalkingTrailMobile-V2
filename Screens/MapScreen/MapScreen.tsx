import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { TrailContext } from "../../context/TrailContext"; // Adjust the file path accordingly

interface Attraction {
  Name: string;
  Lattitude: number;
  Longitude: number;
}

interface TrailData {
  Name: string;
  Trails: {
    [key: string]: {
      Attractions: {
        [key: string]: Attraction;
      };
    };
  };
}

const MapScreen: React.FC = () => {
  const navigation = useNavigation();
  const { shortName } = useContext(TrailContext) as { shortName?: string };
  const [trailData, setTrailData] = useState<TrailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState<any>(null);

  useEffect(() => {
    const fetchTrailData = async () => {
      try {
        if (!shortName) {
          throw new Error("Short name is missing");
        }

        const response = await fetch(
          `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName.replace(
            /\s/g,
            "_"
          )}/project.json`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data: TrailData = await response.json();
        setTrailData(data);
        updateRegion(data);
      } catch (error) {
        setError((error as Error).message);
        console.error("Error fetching trail data:", error);
      }
    };

    const updateRegion = (data: TrailData) => {
      if (data && data.Trails && data.Trails[data.Name]) {
        const attractions = Object.values(data.Trails[data.Name].Attractions);
        const latitudes = attractions.map((attraction) => attraction.Lattitude).filter(lat => lat >= -90 && lat <= 90);
        const longitudes = attractions.map((attraction) => attraction.Longitude).filter(lon => lon >= -180 && lon <= 180);

        if (latitudes.length && longitudes.length) {
          const latMin = Math.min(...latitudes);
          const latMax = Math.max(...latitudes);
          const lonMin = Math.min(...longitudes);
          const lonMax = Math.max(...longitudes);

          setRegion({
            latitude: (latMin + latMax) / 2,
            longitude: (lonMin + lonMax) / 2,
            latitudeDelta: Math.max(latMax - latMin + 0.1, 0.1), // Ensure delta is at least 0.1
            longitudeDelta: Math.max(lonMax - lonMin + 0.1, 0.1), // Ensure delta is at least 0.1
          });
        }
      }
    };

    fetchTrailData();
  }, [shortName]);

  return (
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
            style={{ width: 200, height: 70, marginTop: 10 }}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity style={{ paddingRight: 8 }}>
          <Image
            source={require("../../assets/images/Home-1.png")}
            style={{ width: 50, height: 50 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {trailData ? (
        <MapView
          provider={PROVIDER_GOOGLE} // Use Google Maps provider if necessary
          style={styles.map}
          region={region}
          showsUserLocation={true}
        >
          {Object.values(trailData.Trails[trailData.Name]?.Attractions || {}).map((attraction, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: attraction.Lattitude,
                longitude: attraction.Longitude,
              }}
              title={attraction.Name}
              image={require('../../assets/images/Map-Icon.png')} // Custom marker icon
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{error ? `Error: ${error}` : "Loading..."}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    width: 50,
  },
  backButtonImage: {
    width: 40,
    height: 40,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "gray",
  },
});

export default MapScreen;
