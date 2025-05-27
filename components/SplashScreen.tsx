import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import washImg from "@/assets/images/wash_wave_home.png";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Splash"
>;

type Props = {
  navigation: SplashScreenNavigationProp;
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  //Να μην καλυπτει την πανω μπαρα στα κινητα
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <Image
          source={washImg} // Τοποθέτησε την εικόνα σου στο φάκελο assets
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1, // Κάνει το container να καταλαμβάνει ολόκληρη την οθόνη
  },
  image: {
    flex: 1, // Η εικόνα καταλαμβάνει όλο τον διαθέσιμο χώρο
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SplashScreen;
