import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <StatusBar style="dark" backgroundColor="#f2f2f2" translucent={false} />
      <Stack.Screen name="index" />
      <Stack.Screen
        name="imageModal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
