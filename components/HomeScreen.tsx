import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { RelativePathString, useRouter } from "expo-router";

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  console.log("🏠 HomeScreen loaded");


  return (
    <SafeAreaView style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {/* Κείμενο καλωσορίσματος */}
        <View>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Καλώς ήρθες στο {""}
              <Text>
                <Text style={styles.waveText}>Wash</Text>{" "}
                <Text style={styles.washText}>Wave 🌊 </Text>
              </Text>{" "} {"\n"}
              Η νέα εποχή στον καθαρισμό του οχήματος σου είναι εδώ! {"\n"}
              Είσαι έτοιμος να ξεκινήσεις;
            </Text>
          </View>

          {/* Κάρτες */}
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push("/login" as RelativePathString)}
            >
              <View style={styles.cardContent}>
                <FontAwesome name="sign-in" size={40} color="#00ADFE" style={styles.icon} />
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
                <FontAwesome name="user-plus" size={40} color="#00ADFE" style={styles.icon} />
                <Text style={styles.cardText}>
                  Δεν έχω λογαριασμό και θέλω να δημιουργήσω
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Κουμπί Παραβλέψη στο κάτω μέρος */}
        <TouchableOpacity
          style={styles.skipContainer}
          onPress={() => router.push("/menu" as RelativePathString)}
        >
          <Text style={styles.skipText}>Παράβλεψη</Text>
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
    paddingHorizontal: 20,
    justifyContent: "space-between", // ✅ Κάνει το skip να πάει κάτω
  },
  welcomeContainer: {
    marginTop: 20,
    marginBottom: 0,
    paddingHorizontal: 10,
  },
  welcomeText: {
    fontSize: 17,
    color: "#333",
    textAlign: "center",
    fontFamily: "System",
    fontWeight: "400",
    lineHeight: 26,
  },
  waveText: {
    color: "#00ADFE",
    fontWeight: "normal",
  },
  washText: {
    fontWeight: "bold",
    color: "#000",
  },
  cardContainer: {
    alignItems: "center",
  },
  card: {
    width: "90%",
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginVertical: 15,
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
