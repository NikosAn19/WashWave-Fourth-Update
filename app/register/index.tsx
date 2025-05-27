// app/RegisterScreen.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, RelativePathString } from "expo-router";

const RegisterScreen: React.FC = () => {
  const router = useRouter();

  // Κατάσταση των πεδίων
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [nomos, setNomos] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");

  // refs για αυτόματο focus
  const passwordRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const firstNameRef = useRef<TextInput>(null);
  const nomosRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const postalRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);

  const handleRegister = async () => {
    const payload = {
      email,
      password,
      phone_number: phone,
      last_name: lastName,
      first_name: firstName,
      state: nomos,
      city,
      zip_code: postalCode,
      address,
    };

    try {
      const response = await fetch(
        "http://10.10.20.47:5000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (response.ok) {
        const { verification_code } = data;
        Alert.alert("Επιτυχής Εγγραφή", data.message, [
          {
            text: "OK",
            onPress: () =>
              router.push({
                pathname: "VerificationScreen" as RelativePathString,
                params: { email, verification_code },
              }),
          },
        ]);
      } else {
        Alert.alert(
          "Σφάλμα Εγγραφής",
          data.message || "Παρουσιάστηκε κάποιο πρόβλημα."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Σφάλμα", "Προέκυψε σφάλμα κατά την εγγραφή.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Εγγραφή</Text>

        <TextInput
          style={styles.input}
          placeholder="Email*"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <TextInput
          ref={passwordRef}
          style={styles.input}
          placeholder="Κωδικός*"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
        />

        <TextInput
          ref={phoneRef}
          style={styles.input}
          placeholder="Κινητό τηλέφωνο*"
          placeholderTextColor="#aaa"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => lastNameRef.current?.focus()}
        />

        <TextInput
          ref={lastNameRef}
          style={styles.input}
          placeholder="Επώνυμο"
          placeholderTextColor="#aaa"
          value={lastName}
          onChangeText={setLastName}
          returnKeyType="next"
          onSubmitEditing={() => firstNameRef.current?.focus()}
        />

        <TextInput
          ref={firstNameRef}
          style={styles.input}
          placeholder="Όνομα"
          placeholderTextColor="#aaa"
          value={firstName}
          onChangeText={setFirstName}
          returnKeyType="next"
          onSubmitEditing={() => nomosRef.current?.focus()}
        />

        <TextInput
          ref={nomosRef}
          style={styles.input}
          placeholder="Νομός"
          placeholderTextColor="#aaa"
          value={nomos}
          onChangeText={setNomos}
          returnKeyType="next"
          onSubmitEditing={() => cityRef.current?.focus()}
        />

        <TextInput
          ref={cityRef}
          style={styles.input}
          placeholder="Πόλη"
          placeholderTextColor="#aaa"
          value={city}
          onChangeText={setCity}
          returnKeyType="next"
          onSubmitEditing={() => postalRef.current?.focus()}
        />

        <TextInput
          ref={postalRef}
          style={styles.input}
          placeholder="ΤΚ"
          placeholderTextColor="#aaa"
          value={postalCode}
          onChangeText={setPostalCode}
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => addressRef.current?.focus()}
        />

        <TextInput
          ref={addressRef}
          style={styles.input}
          placeholder="Διεύθυνση"
          placeholderTextColor="#aaa"
          value={address}
          onChangeText={setAddress}
          returnKeyType="done"
          onSubmitEditing={handleRegister}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Εγγραφή</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 20,
    backgroundColor: "#fff",
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

export default RegisterScreen;
