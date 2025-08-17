import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  useRouter,
  useLocalSearchParams,
  RelativePathString,
} from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useIP } from "@/context/IPContext";

const VerificationScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();

  // Λήψη email και dev verification code από τα query params
  const email = (searchParams.email as string) || "";
  const devVerificationCode =
    (searchParams.verification_code as string) || undefined;

  const [code, setCode] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [countdown, setCountdown] = useState(20); // Δευτερόλεπτα για modal
  const { login } = useAuth();
  const { ip } = useIP();

  useEffect(() => {
    if (devVerificationCode) {
      console.log("🧪 Developer verification code received:", devVerificationCode);
      setShowCodeModal(true);
      setCountdown(20);

      // Countdown για εμφάνιση modal
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowCodeModal(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Επίσης timeout για αυτόματο κλείσιμο
      const autoCloseTimer = setTimeout(() => {
        console.log("⌛ Modal auto-closed");
        setShowCodeModal(false);
        clearInterval(timer);
      }, 20000);

      return () => {
        clearInterval(timer);
        clearTimeout(autoCloseTimer);
      };
    } else {
      console.warn("⚠️ No verification code found in searchParams");
      Alert.alert("No verification code");
    }
  }, [devVerificationCode]);

  const handleVerify = async () => {
    if (!code.trim()) {
      Alert.alert("Σφάλμα", "Παρακαλώ εισάγετε τον κωδικό επαλήθευσης.");
      return;
    }

    console.log("📨 Sending verification request for:", email, "with code:", code);

    try {
      const response = await fetch(`http://${ip}:5000/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verification_code: code }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log("✅ Verification successful, user:", data.user);
        login(data.user);
        Alert.alert("Επιτυχία", "Το e-mail σου επιβεβαιώθηκε!", [
          {
            text: "OK",
            onPress: () => {
              console.log("🔁 Redirecting to /menu");
              router.push("/menu" as RelativePathString);
            },
          },
        ]);
      } else {
        console.warn("❌ Verification failed:", data.message);
        Alert.alert("Σφάλμα", data.message || "Η επαλήθευση δεν ολοκληρώθηκε. Δοκίμασε ξανά");
      }
    } catch (error) {
      console.error("💥 Error during verification:", error);
      Alert.alert("Σφάλμα", "Προέκυψε σφάλμα κατά την επιβεβαιώση του e-mail.");
    }
  };

  const copyCodeToInput = () => {
    if (devVerificationCode) {
      console.log("📋 Copied dev code to input");
      setCode(devVerificationCode);
      setShowCodeModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <FontAwesome
        name="envelope"
        size={80}
        color="#00ADFE"
        style={styles.icon}
      />
      <Text style={styles.header}>Επαλήθευση Email</Text>
      <Text style={styles.subheader}>
        Ελέγξτε το email σας ({email}) για τον κωδικό επαλήθευσης.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Εισάγετε τον κωδικό"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Επαλήθευση</Text>
      </TouchableOpacity>

      {/* 💬 Modal για εμφάνιση κωδικού (dev μόνο) */}
      <Modal
        visible={showCodeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCodeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FontAwesome
              name="info-circle"
              size={40}
              color="#00ADFE"
              style={styles.modalIcon}
            />

            <Text style={styles.modalTitle}>Κωδικός Επαλήθευσης</Text>
            <Text style={styles.modalSubtitle}>Ο κωδικός σας :</Text>

            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>{devVerificationCode}</Text>
            </View>

            <Text style={styles.timerText}>
              Αυτόματο κλείσιμο σε: {countdown}s
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyCodeToInput}
              >
                <FontAwesome name="copy" size={16} color="#fff" />
                <Text style={styles.copyButtonText}>Αντιγραφή</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  console.log("❌ Modal manually closed");
                  setShowCodeModal(false);
                }}
              >
                <Text style={styles.closeButtonText}>Κλείσιμο</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  subheader: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    width: "100%",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 2,
  },
  button: {
    backgroundColor: "#00ADFE",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    shadowColor: "#00ADFE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    maxWidth: 350,
    width: "100%",
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  codeContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#00ADFE",
    borderStyle: "dashed",
  },
  codeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00ADFE",
    textAlign: "center",
    letterSpacing: 4,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  timerText: {
    fontSize: 14,
    color: "#ff9800",
    marginBottom: 20,
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00ADFE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 6,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  closeButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});


export default VerificationScreen;
