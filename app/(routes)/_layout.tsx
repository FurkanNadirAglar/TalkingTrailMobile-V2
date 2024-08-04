import { Stack } from 'expo-router';
import React from 'react';

const Layout: React.FC = () => {
  return (
    <Stack>
      <Stack.Screen
        name="HomeScreen/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TalkingDetails/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AboutUs/index"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default Layout;
