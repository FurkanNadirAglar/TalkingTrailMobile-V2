import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TrailContext } from '../../context/TrailContext';

interface ProjectDetails {
  Name: string;
  Images: string[];
  Trails: {
    [key: string]: {
      Attractions: {
        [key: string]: {
          Name: string;
          Images: string[];
          Audio?: string;
          VideoId?: string;
          Description?: string;
        };
      };
    };
  };
}

const Details: React.FC = () => {
  const router = useRouter();
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<{ [key: string]: boolean }>({});
  const context = useContext(TrailContext);

  if (!context) {
    console.error('TrailContext is undefined');
    return <View><Text>Error: TrailContext is undefined</Text></View>;
  }
  const { shortName, downloadedTrails, setDownloadedTrails } = context;

  useEffect(() => {
    if (!shortName) {
      console.error('shortName is not defined');
      return;
    }

    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(
          `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName}/project.json`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ProjectDetails = await response.json();
        setProjectDetails(data);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, [shortName]);

  const handleDownload = async (attraction: any, talkingPoint: string, attractionKey: string) => {
    if (!shortName) {
      Alert.alert('Error', 'shortName is not defined');
      return;
    }

    const { Images = [], Audio } = attraction;
    const fileUris = [
      ...Array.isArray(Images) ? Images.map(img => `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName}/${img}`) : [],
      Audio ? `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName}/${Audio}` : null
    ].filter(Boolean) as string[];

    try {
      for (const uri of fileUris) {
        const filename = uri.split('/').pop() || 'unknown';
        const fileUri = FileSystem.documentDirectory + filename;

        try {
          console.log('Downloading:', uri, 'to:', fileUri);
          const { uri: downloadedUri } = await FileSystem.downloadAsync(uri, fileUri);
          console.log('Download successful:', downloadedUri);

          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (fileInfo.exists) {
            console.log('File exists:', fileInfo.uri);

            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
              const folderName = uri.includes('Images') ? 'TalkingTrail' : 'TalkingTrailMp3';
              const asset = await MediaLibrary.createAssetAsync(fileUri);
              await MediaLibrary.createAlbumAsync(folderName, asset, false);
              console.log(`File saved to ${folderName} album:`, asset.uri);
            } else {
              console.warn('Permission to access media library denied');
            }
          } else {
            console.warn('File does not exist:', fileInfo.uri);
          }
        } catch (error) {
          console.error('Error during download:', error);
          Alert.alert('Error', 'Failed to download file');
        }
      }

      setDownloadedTrails(prevTrails => [
        ...prevTrails,
        { name: shortName, talkingPoint, image: fileUris[0] }
      ]);

      setDownloadStatus(prevStatus => ({
        ...prevStatus,
        [attractionKey]: true
      }));

      Alert.alert('Success', 'Files downloaded and saved to media library successfully');
    } catch (error) {
      console.error('Error in handleDownload:', error);
      Alert.alert('Error', 'Failed to download and save files');
    }
  };

  if (!projectDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { Name, Trails } = projectDetails;

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require('../../assets/images/BackButton-1.png')}
              style={styles.backButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/Header.png')}
              style={{ width: wp('50%'), height: hp('9%'), marginTop: 10, left: 5 }}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity style={{ paddingRight: 8 }} onPress={() => router.push('/(routes)/HomeScreen')}>
            <Image
              source={require('../../assets/images/Home-1.png')}
              style={{ width: wp('12%'), height: wp('12%'), marginTop: 10, left: 20 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName}/${projectDetails.Images[0]}`,
            }}
            style={styles.image}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{Name}</Text>
            <View style={styles.talkingPointsContainer}>
         
            </View>
          </View>
        </View>
        {Object.keys(Trails).map((trailKey) => {
          const trail = Trails[trailKey];
          return (
            <View key={trailKey}>
              {Object.keys(trail.Attractions).map((attractionKey, index) => {
                const attraction = trail.Attractions[attractionKey];
                return (
                  <TouchableOpacity
                    key={attractionKey}
                    onPress={() =>
                      router.push({
                        pathname: '/(routes)/TalkingDetails',
                        params: {
                          imageUri: `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName}/${attraction.Images[0]}`,
                          attractionName: attraction.Name,
                          description: attraction.Description || '',
                          videoUri: attraction.VideoId ? `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName}/${attraction.VideoId}` : null,
                          audioUri: attraction.Audio ? `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName}/${attraction.Audio}` : null,
                        }
                      })
                    }
                  >
                    <View style={styles.attractionContainer}>
                      <Image
                        source={{ uri: `https://talkingtrailstorage.blob.core.windows.net/projects/${shortName}/${attraction.Images[0]}` }}
                        style={styles.attractionImage}
                      />
                      <View>
                        <View style={styles.attractionNameContainer}>
                          <Text style={styles.attractionName}>{attraction.Name}</Text>
                        </View>
                        <View style={styles.talkingPointContainer}>
                          <TouchableOpacity
                            onPress={() => handleDownload(attraction, `${index + 1} TALKING POINT`, attractionKey)}
                          >
                            <Image
                              source={downloadStatus[attractionKey] ? require('../../assets/images/Checkbox-2-Green.png') : require('../../assets/images/DownArrow-1.png')}
                              style={styles.talkingPointIcon}
                            />
                          </TouchableOpacity>
                          <Text style={styles.attractionDetail}>{`${index + 1 < 10 ? '0' : ''}${index + 1} TALKING POINT`}</Text>
                        </View>
                      </View>
                    </View>
                    {index !== Object.keys(trail.Attractions).length - 1 && <View style={styles.separator} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButtonImage: {
    width: wp('10%'),
    height: hp('5%'),
    right: '40%',
    top: 3,
  },
  downArrowIcon: {
    width: wp('12%'),
    height: wp('12%'),
    marginLeft: 5,
  },
  talkingPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  talkingPointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  talkingPointIcon: {
    width: wp('5%'),
    height: wp('7%'),
    marginRight: 5,
  },
  attractionDetail: {
    fontSize: wp('3.5%'),
    color: 'gray',
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  attractionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  attractionImage: {
    width: wp('25%'),
    height: hp('12%'),
    marginLeft: wp('8%'),
    marginRight: wp('3%'),
    borderRadius: 8,
    alignSelf: 'flex-start',
    resizeMode: 'stretch',
  },
  attractionName: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
    flexWrap: 'wrap',
    maxWidth: '75%',
  },
  attractionNameContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  separator: {
    borderBottomWidth: 0.7,
    borderBottomColor: 'lightgrey',
    marginLeft: 10,
    width: wp('100%'),
    marginBottom: 10,
  },
  image: {
    width: wp('100%'),
    height: hp('30%'),
    marginBottom: 10,
    resizeMode: 'stretch',
  },
  imageContainer: {

    width: "100%",
    alignItems: "center",
  
  },
titleContainer: {
  width: "100%",
  alignItems: "flex-start",
  paddingHorizontal: wp('5%'),
  marginTop: hp('2%'),
  // İstersen position: 'relative' + bottom ile oynayabilirsin
  position: 'relative',
  bottom: hp('7%'),  // İkinci koddaki gibi düşünebilirsin
  backgroundColor: 'white',
  borderRadius: wp('3%'),
  paddingVertical: hp('2%'),
  
},
  title2: {
    color: 'gray',
    fontSize: wp('3.5%'),
    marginTop: hp('1.5%'),
  },
});

export default Details;
