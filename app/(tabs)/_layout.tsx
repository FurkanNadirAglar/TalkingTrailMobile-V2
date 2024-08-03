import { Tabs } from "expo-router";
import React from "react";
import { useTheme } from "@react-navigation/native";
import { Image, Text } from "react-native";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "black",
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: {
          fontSize:12,
          color: "#FFf700", // Dark yellow color for the title
        },
      }}
    >
      <Tabs.Screen
        name="DetailsScreen/index"
        options={{
          headerShown: false,
          title: "Explore",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require("../../assets/images/Explore-2.png") : require("../../assets/images/Explore-1-rev.png")}
              style={{ width: 50, height: 50 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MapsScreen/index"
        options={{
          headerShown: false,
          title: "Maps",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require("../../assets/images/Map-2-rev.png") : require("../../assets/images/Map-1-rev.png")}
              style={{ width: 50, height: 50 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="TrailDetails/index"
        options={{
          headerShown: false,
          title: "Detail",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require("../../assets/images/Details-2-rev.png") : require("../../assets/images/Details-1-rev.png")}
              style={{ width: 50, height: 50 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="DownloadScreen/index"
        options={{
          headerShown: false,
          title: "Download",
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require("../../assets/images/Download-2-rev.png") : require("../../assets/images/Download-1-rev.png")}
              style={{ width: 50, height: 50 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
