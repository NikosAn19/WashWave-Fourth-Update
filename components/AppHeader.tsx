// components/AppHeader.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PANEL_WIDTH = 250;

const AppHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const go = (path: RelativePathString) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        {/* Hamburger Menu Button */}
        <TouchableOpacity
          onPress={() => setMenuOpen(true)}
          style={styles.hamburgerButton}
          activeOpacity={0.7}
        >
          <FontAwesome name="bars" size={22} color="#333" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoTextWash}>Wash</Text>
            <Text style={styles.logoTextWave}>Wave</Text>
          </View>
        </View>

        {/* Spacer για symmetry */}
        <View style={styles.rightSpacer} />
      </View>

      {/* Hamburger Menu Overlay */}
      {menuOpen && (
        <>
          <Pressable
            style={[styles.backdrop, { height: SCREEN_HEIGHT + insets.top }]}
            onPress={() => setMenuOpen(false)}
          />

          <View style={[styles.menuPanel, { top: 0 }]}>
            {/* <TouchableOpacity
              onPress={() => setMenuOpen(false)}
              style={styles.closeButton}
            >
              <FontAwesome name="chevron-left" size={24} color="#333" />
            </TouchableOpacity> */}

            {isLoggedIn && user && (
              <View style={styles.userProfileContainer}>
                <FontAwesome name="user-circle" size={42} color="#00ADFE" />
                <Text style={styles.userName}>
                  {user.first_name} {user.last_name}
                </Text>
                <View style={styles.welcomeContainer}>
                  <Text style={styles.welcomeText}>Καλώς ήρθες!</Text>
                </View>
              </View>
            )}

            {!isLoggedIn ? (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => go("/home" as RelativePathString)}
                >
                  <Text style={styles.menuText}>Αρχική Οθόνη</Text>
                </TouchableOpacity>

                <Text style={styles.promptText}>
                  Κάνε σύνδεση ή εγγραφή για πλήρη πρόσβαση
                </Text>

                <TouchableOpacity
                  style={styles.authButton}
                  onPress={() => go("/login" as RelativePathString)}
                >
                  <Text style={styles.authButtonText}>Σύνδεση</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.authButton}
                  onPress={() => go("/register" as RelativePathString)}
                >
                  <Text style={styles.authButtonText}>Εγγραφή</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => go("/multistepform" as RelativePathString)}
                >
                  <Text style={styles.menuText}>Κλείσε Ραντεβού</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => go("/services" as RelativePathString)}
                >
                  <Text style={styles.menuText}>Υπηρεσίες</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => go("/history" as RelativePathString)}
                >
                  <Text style={styles.menuText}>Ιστορικό</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => go("/AccountDetails" as RelativePathString)}
                >
                  <Text style={styles.menuText}>Στοιχεία Λογαριασμού</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={() => {
                    logout();
                    go("/login" as RelativePathString);
                  }}
                >
                  <Text style={styles.logoutText}>Αποσύνδεση</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    zIndex: 1000,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 60,
  },
  hamburgerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logoTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoTextWash: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00ADFE", // Μπλε για "Wash"
    letterSpacing: 0.5,
  },
  logoTextWave: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Μαύρο για "Wave"
    letterSpacing: 0.5,
  },
  rightSpacer: {
    width: 40, // Same width as hamburger button for symmetry
  },
  // Menu styles (same as before but adjusted positioning)
  backdrop: {
    position: "absolute",
    width: SCREEN_WIDTH,
    backgroundColor: "rgba(0,0,0,0.4)",
    top: 0,
    left: 0,
    zIndex: 998,
  },
  menuPanel: {
    position: "absolute",
    top: 80, // Αντί για 0, βάλε 80px κάτω από την κορυφή
    left: 0,
    width: PANEL_WIDTH,
    maxHeight: SCREEN_HEIGHT * 0.8,
    paddingBottom: 20,
    backgroundColor: "#fff",
    paddingTop: 20, // Μικρότερο padding από πάνω
    paddingHorizontal: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 6,
    zIndex: 999,
    marginTop: 40,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  userProfileContainer: {
    alignItems: "center",
    marginBottom: 25,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  welcomeContainer: {
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  welcomeText: {
    fontSize: 12,
    color: "#00ADFE",
    fontWeight: "500",
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  promptText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 12,
  },
  authButton: {
    marginVertical: 6,
    backgroundColor: "#00ADFE",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  authButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: "#ff5252",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});

export default AppHeader;
