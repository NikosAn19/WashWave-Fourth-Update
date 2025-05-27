// app/AccountDetails/index.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import { RelativePathString, useRouter } from "expo-router";

const AccountDetailsScreen: React.FC = () => {
  const router = useRouter();

  // Το email του χρήστη – σε πραγματική εφαρμογή, πιθανώς αυτό θα προέρχεται από το authentication context
  const userEmail = "nikosandreadis19a@gmail.com";

  // States για τα προσωπικά στοιχεία του χρήστη
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");

  const lastNameRef = useRef<TextInput>(null);
  const firstNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const zipRef = useRef<TextInput>(null);

  // Αποκτάμε τα προσωπικά δεδομένα του χρήστη από το API
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `http://10.10.20.47:5000/api/user/profile?email=${encodeURIComponent(
          userEmail
        )}`
      );
      const data = await response.json();
      if (response.ok) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setPhoneNumber(data.phone_number);
        setAddress(data.address);
        setCity(data.city);
        setStateName(data.state);
        setZipCode(data.zip_code);
      } else {
        Alert.alert(
          "Σφάλμα",
          data.message ||
            "Δεν ήταν δυνατή η φόρτωση των στοιχείων του λογαριασμού."
        );
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      Alert.alert(
        "Σφάλμα",
        "Παρουσιάστηκε σφάλμα κατά τη φόρτωση των στοιχείων."
      );
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Ενημέρωση των δεδομένων του χρήστη μέσω PUT request
  const handleSaveChanges = async () => {
    const payload = {
      email, // Χρησιμοποιούμε το email ως μοναδικό αναγνωριστικό
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      address,
      city,
      state: stateName,
      zip_code: zipCode,
    };

    try {
      const response = await fetch("http://10.10.20.47:5000/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Αποθήκευση", "Οι αλλαγές αποθηκεύτηκαν επιτυχώς!", [
          {
            text: "OK",
            onPress: () => router.push("/menu" as RelativePathString),
          },
        ]);
      } else {
        Alert.alert("Σφάλμα", data.message || "Η αποθήκευση απέτυχε.");
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert(
        "Σφάλμα",
        "Παρουσιάστηκε σφάλμα κατά την ενημέρωση των στοιχείων."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 60}
    >
      <SafeAreaView style={styles.flex}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Στοιχεία Λογαριασμού</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Όνομα</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Όνομα"
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current?.focus()}
          />

          <Text style={styles.label}>Επώνυμο</Text>
          <TextInput
            ref={lastNameRef}
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Επώνυμο"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={email}
            editable={false}
          />

          <Text style={styles.label}>Κινητό Τηλέφωνο</Text>
          <TextInput
            ref={phoneRef}
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Κινητό Τηλέφωνο"
            keyboardType="phone-pad"
            returnKeyType="next"
            onSubmitEditing={() => addressRef.current?.focus()}
          />

          <Text style={styles.label}>Διεύθυνση</Text>
          <TextInput
            ref={addressRef}
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Διεύθυνση"
            returnKeyType="next"
            onSubmitEditing={() => cityRef.current?.focus()}
          />

          <Text style={styles.label}>Πόλη</Text>
          <TextInput
            ref={cityRef}
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Πόλη"
            returnKeyType="next"
            onSubmitEditing={() => stateRef.current?.focus()}
          />

          <Text style={styles.label}>Νομός</Text>
          <TextInput
            ref={stateRef}
            style={styles.input}
            value={stateName}
            onChangeText={setStateName}
            placeholder="Νομός"
            returnKeyType="next"
            onSubmitEditing={() => zipRef.current?.focus()}
          />

          <Text style={styles.label}>ΤΚ</Text>
          <TextInput
            ref={zipRef}
            style={styles.input}
            value={zipCode}
            onChangeText={setZipCode}
            placeholder="ΤΚ"
            keyboardType="numeric"
            returnKeyType="done"
          />

          {/* Παίζουμε λίγο “bottom padding” ώστε να μη μπλοκάρεται από το κουμπί */}
          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Σταθερό κουμπί στην κάτω άκρη */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>Αποθήκευση Αλλαγών</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#eee",
    color: "#888",
  },
  button: {
    backgroundColor: "#00ADFE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default AccountDetailsScreen;
