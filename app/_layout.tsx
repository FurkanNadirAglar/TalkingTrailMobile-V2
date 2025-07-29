import GlobalAudioPlayer from "@/components/GlobalAudioPlayer";
import { Stack } from "expo-router";
import { View } from "react-native";
import "react-native-reanimated";
import { AudioProvider } from "../context/AudioContext";
import { TrailProvider } from "../context/TrailContext";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <TrailProvider>
      <AudioProvider>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>

          <GlobalAudioPlayer />
        </View>
      </AudioProvider>
    </TrailProvider>
  );
}
