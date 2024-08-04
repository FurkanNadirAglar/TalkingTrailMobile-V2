import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import { useRouter } from 'expo-router';

const AboutUs: React.FC = () => {
  const router = useRouter();

  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Image
              source={require('../../assets/images/BackButton-1.png')}
              style={styles.backButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/Header.png')}
              style={{ width: 200, height: 70, marginTop: 10, left: 20 }}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity style={{ paddingRight: 8 }} onPress={() => router.push('/')}>
            <Image
              source={require('../../assets/images/Home-1.png')}
              style={{ width: 50, height: 50, marginTop: 10, left: 10 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        <Image
          source={require('../../assets/images/LoadPage-1.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Experience the Story with Talking Trail</Text>
          <Text style={styles.subTitle}>About Us</Text>
          <Text style={styles.descriptionText}>
            Talking Trail is fortunate to share the rich history, culture, and heritage of our communities. We believe the connections travelers make along the way is what matters most, and will keep them coming back. We pride ourselves in sharing the rich, gritty stories that will be retold around the campfire or the dinner table. We would be proud to showcase your community!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: 20,
  } as ViewStyle,
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  } as ViewStyle,
  backButton: {
    position: 'absolute',
    top: 24,
  } as ViewStyle,
  backButtonImage: {
    width: 50,
    height: 40,
  } as ImageStyle,
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 20,
    bottom: 100,
  } as TextStyle,
  subTitle: {
    fontSize: 16,
    marginRight: 189,
    right: 15,
    bottom: 110,
    fontWeight: 'bold',
  } as TextStyle,
  backgroundImage: {
    width: '100%',
    height: 300,
    marginTop: 20,
  } as ImageStyle,
  textContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  } as ViewStyle,
  titleText: {
    position: 'relative',
    bottom: 100,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 40,
    width: 370,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'left',
  } as TextStyle,
});

export default AboutUs;
