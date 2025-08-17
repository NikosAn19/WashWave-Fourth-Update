// AccountDetailsScreen.tsx - με λογική scroll & focus όπως το RegisterScreen

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";

import { RelativePathString, useRouter } from "expo-router";
import { useIP } from "../../context/IPContext";
import { useAuth } from "../../context/AuthContext";

// Component input φόρμας
const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  inputRef,
  keyboardType,
  returnKeyType = "next",
  onSubmitEditing,
  onFocus,
  style,
}: any) => (
  <View style={{ marginBottom: 15 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      ref={inputRef}
      style={[styles.input, style]}
      value={value}
      editable={editable}
      onChangeText={onChangeText}
      placeholder={placeholder || label}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      onFocus={onFocus}
    />
  </View>
);

const AccountDetailsScreen: React.FC = () => {
  const { ip } = useIP();
  const { user } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [loading, setLoading] = useState(true);

  // refs για inputs
  const lastNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const zipRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleInputFocus = (inputIndex: number) => {
    const scrollToY = inputIndex * 80;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: scrollToY, animated: true });
    }, 100);
  };

  const fetchUserProfile = async () => {
    if (!user?.email || !ip) {
      Alert.alert("Σφάλμα", "Λείπει email ή IP");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const url = `http://${ip}:5000/api/user/profile?email=${encodeURIComponent(user.email)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setEmail(data.email || "");
        setPhoneNumber(data.phone_number || "");
        setAddress(data.address || "");
        setCity(data.city || "");
        setStateName(data.state || "");
        setZipCode(data.zip_code || "");
      } else {
        Alert.alert("Σφάλμα", data.message || "Αποτυχία φόρτωσης");
      }
    } catch (error) {
      Alert.alert("Σφάλμα", "Αποτυχία φόρτωσης στοιχείων");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    const userload = {
      email,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone_number: phoneNumber.trim(),
      address: address.trim(),
      city: city.trim(),
      state: stateName.trim(),
      zip_code: zipCode.trim(),
    };

    try {
      const response = await fetch(`http://${ip}:5000/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userload),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Αποθήκευση", "Οι αλλαγές αποθηκεύτηκαν.", [
          {
            text: "OK",
            onPress: () => router.push("/menu" as RelativePathString),
          },
        ]);
      } else {
        Alert.alert("Σφάλμα", data.message || "Αποτυχία αποθήκευσης");
      }
    } catch (error) {
      Alert.alert("Σφάλμα", "Αποτυχία αποθήκευσης στοιχείων");
    }
  };

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (user?.email && ip && !fetchedRef.current) {
      fetchUserProfile();
      fetchedRef.current = true;
    }
  }, [user?.email, ip]);

  if (loading) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ADFE" />
          <Text style={styles.loadingText}>Φόρτωση λογαριασμού...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.header}>Στοιχεία Λογαριασμού</Text>
            {user?.email && (
              <Text style={styles.userEmailText}>Λογαριασμός: {user.email}</Text>
            )}

            <FormInput label="Όνομα" value={firstName} onChangeText={setFirstName} onSubmitEditing={() => lastNameRef.current?.focus()} onFocus={() => handleInputFocus(0)} />
            <FormInput label="Επώνυμο" value={lastName} onChangeText={setLastName} inputRef={lastNameRef} onSubmitEditing={() => phoneRef.current?.focus()} onFocus={() => handleInputFocus(1)} />
            <FormInput label="Email" value={email} editable={false} style={styles.disabledInput} onFocus={() => handleInputFocus(2)} />
            <FormInput label="Κινητό" value={phoneNumber} onChangeText={setPhoneNumber} inputRef={phoneRef} keyboardType="phone-pad" onSubmitEditing={() => addressRef.current?.focus()} onFocus={() => handleInputFocus(3)} />
            <FormInput label="Διεύθυνση" value={address} onChangeText={setAddress} inputRef={addressRef} onSubmitEditing={() => cityRef.current?.focus()} onFocus={() => handleInputFocus(4)} />
            <FormInput label="Πόλη" value={city} onChangeText={setCity} inputRef={cityRef} onSubmitEditing={() => stateRef.current?.focus()} onFocus={() => handleInputFocus(5)} />
            <FormInput label="Νομός" value={stateName} onChangeText={setStateName} inputRef={stateRef} onSubmitEditing={() => zipRef.current?.focus()} onFocus={() => handleInputFocus(6)} />
            <FormInput label="ΤΚ" value={zipCode} onChangeText={setZipCode} inputRef={zipRef} keyboardType="numeric" returnKeyType="done" onSubmitEditing={handleSaveChanges} onFocus={() => handleInputFocus(7)} />

            <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
              <Text style={styles.buttonText}>Αποθήκευση Αλλαγών</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 5,
  },
  userEmailText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
    fontWeight: "600",
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#888",
  },
  button: {
    backgroundColor: "#00ADFE",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AccountDetailsScreen;
