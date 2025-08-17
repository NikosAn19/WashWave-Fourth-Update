import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { RelativePathString, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native"; // ✅ Διορθωμένο import

const MenuScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // ✅ Χρήση useFocusEffect ΜΕΣΑ στο component
  useFocusEffect(
    useCallback(() => {
      console.log("📲 MenuScreen loaded");
    }, [])
  );

  const handleBookPress = () => {
    console.log("📅 Μετάβαση σε φόρμα κράτησης");
    router.push("/multistepform" as RelativePathString);
  };

  const handleServicesPress = () => {
    console.log("🧼 Μετάβαση στη λίστα υπηρεσιών");
    router.push("/services" as RelativePathString);
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            📱 Κλείσε ραντεβού εύκολα {"\n"}
            ⏱ Απόλαυσε άμεση εξυπηρέτηση {"\n"}
            🚗 και ξέχνα την αναμονή.
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={handleBookPress}>
            <Text style={styles.cardText}>Κλείσε ραντεβού</Text>
            <FontAwesome
              name="calendar"
              size={30}
              color="#00ADFE"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleServicesPress}>
            <Text style={styles.cardText}>Δες τις υπηρεσίες</Text>
            <MaterialCommunityIcons
              name="car-wash"
              size={32}
              color="#00ADFE"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
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
    padding: 20,
    alignItems: "center",
  },
  welcomeContainer: {
    marginTop: 20,
    marginBottom: 15,
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
  cardContainer: {
    width: "100%",
    justifyContent: "flex-start",
  },
  card: {
    width: "100%",
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
});

export default MenuScreen;
