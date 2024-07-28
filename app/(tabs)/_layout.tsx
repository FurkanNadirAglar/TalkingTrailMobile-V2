import { Tabs } from 'expo-router';
import React from 'react';
import { ImageBackground, View, Image, StyleSheet } from 'react-native';


// TabBarIcon için prop türlerini tanımlıyoruz

export default function Layout() {

  return (
    
      <Tabs
        
      >
        <Tabs.Screen
          name="HomeScreen/index"
          options={{ headerShown: false }}
        />
        <Tabs.Screen
          name="DetailsScreen/index"
          options={{ headerShown: false }}
        />
      
      </Tabs>
  );
}


