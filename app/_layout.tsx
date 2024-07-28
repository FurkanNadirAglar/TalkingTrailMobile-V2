import "react-native-reanimated";
import { Stack } from "expo-router";
import { TrailProvider } from "../context/TrailContext"; // Adjust the path as needed

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
      <TrailProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }}/>
          
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TrailProvider>
  );
}
