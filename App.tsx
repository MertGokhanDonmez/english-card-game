import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerRootComponent } from "expo";

// Import screens
import HomeScreen from "./src/screens/HomeScreen";
import AddScreen from "./src/screens/AddScreen";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

import { dynamicActivate } from "./src/locale/i18n";
import { AppLanguage } from "./src/locale/languages";

// Create the stack navigator
const Stack = createStackNavigator();

dynamicActivate(AppLanguage.tr);

export default function App() {
  return (
    <SafeAreaProvider>
      <I18nProvider i18n={i18n}>
        <StatusBar style="dark" backgroundColor="#f2f2f2" />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Add" component={AddScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
