import { RelativePathString, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useIP } from "@/context/IPContext";

// 📍 Debug: Όταν φορτώνεται το component
console.log("📥 LoginScreen component loaded");

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();
  const { ip, loading } = useIP();

  // Handler για το login
  const handleLogin = async (): Promise<void> => {
    const payload = { email, password };

    console.log("🔐 Υποβλήθηκε login με email:", email);

    try {
      const response = await fetch(`http://${ip}:5000/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("📨 Απάντηση από το backend:", data);

      if (response.ok) {
        login(data.user); // Ενημέρωση context με τα δεδομένα του χρήστη
        console.log("✅ Επιτυχής σύνδεση, προώθηση στο /menu");

        Alert.alert("Επιτυχία", data.message || "Επιτυχής σύνδεση!", [
          {
            text: "OK",
            onPress: () => router.push("/menu" as RelativePathString),
          },
        ]);
      } else {
        console.warn("❌ Ανεπιτυχής σύνδεση:", data.message);
        Alert.alert("Σφάλμα", data.message || "Λανθασμένα στοιχεία σύνδεσης.");
      }
    } catch (error) {
      console.error("❗ Σφάλμα κατά τη σύνδεση:", error);
      Alert.alert("Σφάλμα", "Παρουσιάστηκε πρόβλημα κατά τη σύνδεση.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Σύνδεση</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Σύνδεση</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#00ADFE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
