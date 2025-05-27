import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { RelativePathString, useRouter } from "expo-router";

const MenuScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <SafeAreaView style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {/* Τίτλος */}
        <Text style={styles.title}>Καλωσόρισες στη WashWave</Text>

        {/* Κάρτες */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push("/multistepform" as RelativePathString)}
          >
            <Text style={styles.cardText}>Κλείσε ραντεβού</Text>
            <FontAwesome name="angle-right" size={32} color="#00ADFE" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}
          onPress={() => router.push("/services" as RelativePathString)}>
            <Text style={styles.cardText}>Δες τις υπηρεσίες</Text>
            <FontAwesome name="angle-right" size={32} color="#00ADFE" />
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
    color: "#333",
  },

  cardContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
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
});

export default MenuScreen;
