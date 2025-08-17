import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ Update with your actual image path
import splashImage from "@/assets/images/wash_wave_home.png"; // make sure this exists

console.log("🌊 SplashScreen loaded");

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={splashImage}
        style={styles.image}
        resizeMode="contain" // or "contain" if you want padding
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default SplashScreen;
