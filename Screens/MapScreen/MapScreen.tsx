import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { TrailContext } from "../../context/TrailContext";

const ZOOM_DELTA_STEP = 0.02;

interface Attraction {
  Name: string;
  Lattitude: number;
  Longitude: number;
  Images?: string[]; // Diziyi belirt
  PhoneExtension?: string;

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
  const { shortName } = useContext(TrailContext) as { shortName?: string };
  const [trailData, setTrailData] = useState<TrailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const fetchTrailData = async () => {
      try {
        if (!shortName) throw new Error("Short name is missing");

        const response = await fetch(
          `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName.replace(
            /\s/g,
            "_"
          )}/project.json`
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const data: TrailData = await response.json();
        setTrailData(data);
        updateRegion(data);
      } catch (error) {
        setError((error as Error).message);
        console.error("Error fetching trail data:", error);
      }
    };

    const updateRegion = (data: TrailData) => {
      const firstTrailKey = Object.keys(data.Trails)[0];
      if (data && data.Trails && data.Trails[firstTrailKey]) {
        const attractions = Object.values(data.Trails[firstTrailKey].Attractions);
        const latitudes = attractions
          .map((a) => a.Lattitude)
          .filter((lat) => lat >= -90 && lat <= 90);
        const longitudes = attractions
          .map((a) => a.Longitude)
          .filter((lon) => lon >= -180 && lon <= 180);

        if (latitudes.length && longitudes.length) {
          const latMin = Math.min(...latitudes);
          const latMax = Math.max(...latitudes);
          const lonMin = Math.min(...longitudes);
          const lonMax = Math.max(...longitudes);

          const newRegion = {
            latitude: (latMin + latMax) / 2,
            longitude: (lonMin + lonMax) / 2,
            latitudeDelta: Math.max(latMax - latMin + 0.1, 0.1),
            longitudeDelta: Math.max(lonMax - lonMin + 0.1, 0.1),
          };

          setRegion(newRegion);
        }
      }
    };

    fetchTrailData();
  }, [shortName]);

  const zoomIn = () => {
    if (region && mapRef.current) {
      const newRegion = {
        ...region,
        latitudeDelta: Math.max(region.latitudeDelta - ZOOM_DELTA_STEP, 0.01),
        longitudeDelta: Math.max(region.longitudeDelta - ZOOM_DELTA_STEP, 0.01),
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 300);
    }
  };

  const zoomOut = () => {
    if (region && mapRef.current) {
      const newRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta + ZOOM_DELTA_STEP,
        longitudeDelta: region.longitudeDelta + ZOOM_DELTA_STEP,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 300);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => {}}>
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
        <TouchableOpacity style={styles.homeButton}>
          <Image
            source={require("../../assets/images/Home-1.png")}
            style={styles.homeButtonImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {trailData && region ? (
        <>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={region}
            showsUserLocation={true}
            zoomEnabled={true}
            scrollEnabled={true}
            loadingEnabled={true}
          >
      {Object.values(
  trailData.Trails[Object.keys(trailData.Trails)[0]]?.Attractions || {}
).map((attraction, index) => {
  let imageUrl: string | undefined = undefined;

  if (attraction.Images && attraction.Images.length > 0) {
    const firstImage = attraction.Images[0];
    imageUrl = firstImage.startsWith("http")
      ? firstImage
      : `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName?.replace(
          /\s/g,
          "_"
        )}/Images/${firstImage}`;
  }
console.log("Imafasfsaage URL:", imageUrl);
  return (
   <Marker
      key={index}
      coordinate={{
        latitude: attraction.Lattitude,
        longitude: attraction.Longitude,
      }}
      image={require("../../assets/images/Map-Icon.png")}
    >
   <Callout>
  <View style={styles.calloutContainer}>
    <Text style={styles.calloutTitle}>{attraction.Name}</Text>
    {attraction.PhoneExtension ? (
      <Text style={styles.calloutTitle}>
        Extension: {attraction.PhoneExtension}
      </Text>
    ) : null}

    {imageUrl ? (
      <Image
        source={{ uri: imageUrl }}
        style={styles.calloutThumbnail}  // thumbnail style kullanalım
        resizeMode="cover"
        onLoad={() => console.log("Thumbnail loaded:", imageUrl)}
        onError={() => console.warn("Thumbnail load error for:", imageUrl)}
      />
    ) : (
      <Image
        source={require("../../assets/images/Map-Icon.png")}
        style={styles.calloutThumbnail}
        resizeMode="cover"
      />
    )}
  </View>
</Callout>

    </Marker>
  );
})}
          </MapView>

          {/* Zoom Buttons */}
          <View style={styles.zoomButtonsContainer}>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
              <Text style={styles.zoomButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
              <Text style={styles.zoomButtonText}>-</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {error ? `Error: ${error}` : "Loading..."}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: { width: wp("12%") },
  backButtonImage: { width: wp("10%"), height: wp("10%") },
  headerImage: { width: wp("40%"), height: hp("7%"), marginTop: hp("1%") },
  homeButton: { paddingRight: wp("4%") },
  homeButtonImage: { width: wp("12%"), height: wp("12%") },
  map: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - hp("15%"),
  },calloutThumbnail: {
  width: wp("15%"),  // küçük genişlik (örnek 15% ekran genişliği)
  height: hp("10%"), // küçük yükseklik
  borderRadius: 4,   // hafif yuvarlatma (opsiyonel)
  marginTop: 6,
},

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: wp("4.5%"), color: "gray" },
  zoomButtonsContainer: {
    position: "absolute",
    bottom: hp("5%"),
    right: wp("5%"),
    flexDirection: "column",
  },
  zoomButton: {
    backgroundColor: "#000000aa",
    borderRadius: 25,
    width: wp("12%"),
    height: wp("12%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  zoomButtonText: {
    color: "white",
    fontSize: wp("8%"),
    fontWeight: "bold",
    lineHeight: wp("8%"),
  },

 calloutContainer: {
  width: wp("40%"),
  padding: 10,
  backgroundColor: "white",
  borderRadius: 8,
  alignItems: "center",
  overflow: "visible", // önemli
},
  calloutTitle: {
    fontWeight: "bold",
    fontSize: wp("4.5%"),
    marginBottom: 6,
  },
calloutImage: {
  width: wp("35%"),
  height: hp("15%"),
  resizeMode: "contain",
},
});

export default MapScreen;
