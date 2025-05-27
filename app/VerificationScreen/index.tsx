// app/VerificationScreen/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, RelativePathString } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const VerificationScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  
  // Λαμβάνουμε το email από τα query params
  const email = (searchParams.email as string) || "";
  // Αν για development θέλουμε να περάζουμε επίσης και τον verification_code στο URL, μπορούμε να τον ανακτήσουμε:
  const devVerificationCode = (searchParams.verification_code as string) || undefined;
  
  const [code, setCode] = useState("");
  const { login } = useAuth();

  useEffect(() => {
    // Αν υπάρχει verification code στο URL για testing, εμφανίζουμε toast ή alert
    if (devVerificationCode) {
      if (Platform.OS === "android") {
        ToastAndroid.show(
          `Your verification code is: ${devVerificationCode}`,
          ToastAndroid.LONG
        );
      } else {
        Alert.alert("Verification Code", `Your verification code is: ${devVerificationCode}`);
      }
    }
    else{
        Alert.alert('No verification code');
    }
  }, [devVerificationCode]);

  const handleVerify = async () => {
    try {
      const response = await fetch("http://10.10.20.47:5000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verification_code: code }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user);
        Alert.alert("Επιτυχία", "Email verified successfully.", [
          {
            text: "OK",
            onPress: () => router.push("/menu" as RelativePathString),
          },
        ]);
      } else {
        Alert.alert("Σφάλμα", data.message || "Verification failed.");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      Alert.alert("Σφάλμα", "An error occurred during verification.");
    }
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="envelope" size={80} color="#00ADFE" style={styles.icon} />
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
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Επαλήθευση</Text>
      </TouchableOpacity>
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
  },
  subheader: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#00ADFE",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default VerificationScreen;
