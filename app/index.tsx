import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions, ImageStyle, ViewStyle } from "react-native";
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const Index: React.FC = () => {
  const [showFirstImage, setShowFirstImage] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstImage(false);
      router.push('/HomeScreen');
    }, 2000); // Show the first image for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {showFirstImage ? (
        <Image 
          source={require('../assets/images/TT-App_Button.png')} 
          style={styles.image} 
        />
      ) : (
        <Image 
          source={require('../assets/images/LoadPage-1.png')} 
          style={styles.fullScreenImage} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  } as ViewStyle,
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  } as ImageStyle,
  fullScreenImage: {
    flex: 1,
    width: width,
    height: height,
    resizeMode: 'cover',
  } as ImageStyle,
});

export default Index;
