import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import logoIcon from "@/assets/images/wash_wave_home.png";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { RelativePathString, useRouter } from "expo-router";

const HomeScreen: React.FC = () => {
  //Να μην καλυπτει την πανω μπαρα στα κινητα
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <SafeAreaView style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {/* Header με το logo */}
        <View style={styles.header}>
          <Image
            source={logoIcon} // Αντικατέστησε με το path του logo σου
            style={styles.logo}
            resizeMode="cover"
          />
        </View>

        {/* Κάρτες για Σύνδεση και Εγγραφή */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/login" as RelativePathString)}
          >
            <View style={styles.cardContent}>
              <FontAwesome
                name="sign-in"
                size={40}
                color="#00ADFE"
                style={styles.icon}
              />
              <Text style={styles.cardText}>
                Έχω λογαριασμό και θέλω να συνδεθώ
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/register" as RelativePathString)}
          >
            <View style={styles.cardContent}>
              <FontAwesome
                name="user-plus"
                size={40}
                color="#00ADFE"
                style={styles.icon}
              />
              <Text style={styles.cardText}>
                Δεν έχω λογαριασμό και θέλω να δημιουργήσω
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Κουμπί Παραβλέψη */}
        <TouchableOpacity
          style={styles.skipContainer}
          onPress={() => router.push("/menu" as RelativePathString)}
        >
          <Text style={styles.skipText}>Παραβλέψη</Text>
        </TouchableOpacity>
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
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0000",
    width: "100%",
  },
  logo: {
    width: "50%",
    height: "100%",
    borderRadius: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "90%",
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginVertical: 15,
    // Σκιές για Android και iOS
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flexShrink: 1,
  },
  skipContainer: {
    alignSelf: "center",
    marginBottom: 30,
  },
  skipText: {
    fontSize: 16,
    color: "black",
    textDecorationLine: "underline",
  },
});

export default HomeScreen;
