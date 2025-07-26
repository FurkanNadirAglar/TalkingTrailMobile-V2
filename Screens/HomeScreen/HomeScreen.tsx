import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
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
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TrailContext } from '../../context/TrailContext';

interface PlaceData {
  shortName: string;
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
        const projects = [
          "Bismarck_Alley_Art",
          "Camp_Hancock_Historic_Site",
          "Carter_County_Montana",
          "Former_Governors_Mansion",
          "Frontier_Gateway_Museum",
          "Garrison_Talking_Trail",
          "Historic_Downtown_Bismarck",
          "Kenmare_ND",
          "Lawton_OK",
          "Logan_County_Colorado",
          "Missour_River_Heritage_Mural",
          "Missouri_River_Country",
          "Nelson_County",
          "New_York_Mills_MN",
          "North_Dakota_Capitol_Grounds",
          "NPNHA",
          "Otter_Tail_County",
          "Overland_Trail_Museum",
          "Rendezvous_Region",
          "Standing_Rock_Sioux_Tribe",
          "Tri_County_Alliance",
          "Whitefish_Dunes_State_Park",
        ];
        const placesData: PlaceData[] = [];

        for (const shortName of projects) {
          const response = await fetch(
            `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName.replace(/\s/g, '_')}/project.json`
          );
          const data = await response.json();
          placesData.push({ shortName, data });
        }

        setPlaces(placesData);
      } catch (error) {
        console.error('Error fetching place data:', error);
      }
    }

    fetchPlaceData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/images/Header.png')}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.aboutButton} onPress={() => router.push({ pathname: '/(routes)/AboutUs' })}>
          <Image
            source={require('../../assets/images/Home-1.png')}
            style={styles.homeIcon}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View>
          {places.map(({ shortName, data }) => (
            <TouchableOpacity
              key={shortName}
              onPress={() => {
                setShortName(shortName);
                router.push({
                  pathname: '/(tabs)/DetailsScreen',
                  params: { shortName },
                });
              }}
              style={styles.placeContainer}
            >
              <Image
                source={{
                  uri:
                    data && data.Images
                      ? `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName.replace(
                          /\s/g,
                          '_'
                        )}/${data.Images[0]}`
                      : undefined,
                }}
                style={styles.placeImage}
                resizeMode="stretch"
              />
              <View style={styles.overlay}>
                <View style={styles.overlayContent}>
                  <Text style={styles.overlayText}>
                    {shortName
                      .replace(/_/g, ' ')
                      .toLowerCase()
                      .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())}
                  </Text>
                  {data?.Trails &&
                    Object.values(data.Trails).map((trail, index) => (
                      <Text style={styles.overlayTextTalking} key={index}>
                        {Object.keys(trail.Attractions).length} TALKING POINTS | 149 MB | 6-8 HOURS
                      </Text>
                    ))}
                </View>
                <Image
                  source={require('../../assets/images/DownArrow-1-rev.png')}
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('100%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.5%'),
  } as ViewStyle,
  headerImage: {
    width: wp('60%'),
    height: hp('6%'),
    marginTop: hp('1.5%'),
    marginLeft: wp('10%'),
  } as ImageStyle,
  aboutButton: {
    paddingRight: wp('2%'),
  } as ViewStyle,
  homeIcon: {
    width: wp('12%'),
    height: wp('12%'),
    marginTop: hp('1%'),
    left: wp('5%'),
  } as ImageStyle,
  placeContainer: {
    position: 'relative',
  } as ViewStyle,
  placeImage: {
    width: wp('100%'),
    height: wp('70%'),
  } as ImageStyle,
  overlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: hp('1.2%'),
    width: wp('100%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: hp('11%'),
  } as ViewStyle,
  overlayContent: {
    flexDirection: 'column',
  } as ViewStyle,
  overlayText: {
    color: '#fff',
    fontSize: hp('2.3%'),
    fontWeight: 'bold',
  } as TextStyle,
  overlayTextTalking: {
    color: 'lightgray',
    fontSize: hp('1.6%'),
    marginTop: hp('0.5%'),
  } as TextStyle,
  downArrowIcon: {
    width: wp('15%'),
    height: wp('15%'),
    position: 'absolute',
    right: wp('2%'),
  } as ImageStyle,
});

export default HomeScreen;
