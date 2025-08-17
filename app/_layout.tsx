import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { View, StyleSheet } from "react-native";
import { AuthProvider } from "@/context/AuthContext";
import { IPProvider } from "@/context/IPContext";
import AppHeader from "@/components/AppHeader";
import * as SplashScreen from "expo-splash-screen";
import SplashScreenComponent from "../components/SplashScreen"; // renamed to avoid name conflict

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  const [splashVisible, setSplashVisible] = useState(true);
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false); // 👈 after 3s, show the app
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded || splashVisible) {
    return <SplashScreenComponent />;
  }

  const screensWithoutHeader = ["/"];
  const shouldShowHeader = !screensWithoutHeader.includes(pathname);

  return (
    <IPProvider>
      <AuthProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <View style={styles.globalContainer}>
            {shouldShowHeader && <AppHeader />}
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="home/index" />
              <Stack.Screen name="login/index" />
              <Stack.Screen name="register/index" />
              <Stack.Screen name="VerificationScreen/index" />
              <Stack.Screen name="multistepform/index" />
              <Stack.Screen name="services/index" />
              <Stack.Screen name="history/index" />
              <Stack.Screen name="AccountDetails/index" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </View>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </IPProvider>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
  },
});
