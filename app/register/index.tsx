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
import { useIP } from "@/context/IPContext";

const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const { ip } = useIP();

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

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // refs για αυτόματο focus
  const passwordRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const firstNameRef = useRef<TextInput>(null);
  const nomosRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const postalRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Το email είναι υποχρεωτικό";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Παρακαλώ εισάγετε έγκυρο email";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Ο κωδικός είναι υποχρεωτικός";
    } else if (password.length < 6) {
      newErrors.password = "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες";
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = "Το τηλέφωνο είναι υποχρεωτικό";
    } else if (!/^[0-9]{10}$/.test(phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Παρακαλώ εισάγετε έγκυρο τηλέφωνο (10 ψηφία)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join("\n");
      Alert.alert("Σφάλματα Φόρμας", errorMessages);
      return false;
    }

    return true;
  };

  // Handle input focus για auto-scroll
  const handleInputFocus = (inputPosition: number) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: inputPosition * 80, // Περίπου 80px per input
        animated: true,
      });
    }, 100);
  };

  const handleRegister = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    const payload = {
      email: email.trim(),
      password,
      phone_number: phone.trim(),
      last_name: lastName.trim() || undefined,
      first_name: firstName.trim() || undefined,
      state: nomos.trim() || undefined,
      city: city.trim() || undefined,
      zip_code: postalCode.trim() || undefined,
      address: address.trim() || undefined,
    };

    try {
      const response = await fetch(`http://${ip}:5000/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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

  // Helper function για error styling
  const getInputStyle = (fieldName: string) => [
    styles.input,
    errors[fieldName] && styles.inputError,
  ];

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.title}>Εγγραφή</Text>
        <Text style={styles.subtitle}>Τα πεδία με * είναι υποχρεωτικά</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={getInputStyle("email")}
            placeholder="Email*"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            onFocus={() => handleInputFocus(0)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={passwordRef}
            style={getInputStyle("password")}
            placeholder="Κωδικός*"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            onFocus={() => handleInputFocus(1)}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={phoneRef}
            style={getInputStyle("phone")}
            placeholder="Κινητό τηλέφωνο*"
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) {
                setErrors((prev) => ({ ...prev, phone: "" }));
              }
            }}
            keyboardType="phone-pad"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current?.focus()}
            onFocus={() => handleInputFocus(2)}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={lastNameRef}
            style={styles.input}
            placeholder="Επώνυμο"
            placeholderTextColor="#aaa"
            value={lastName}
            onChangeText={setLastName}
            returnKeyType="next"
            onSubmitEditing={() => firstNameRef.current?.focus()}
            onFocus={() => handleInputFocus(3)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={firstNameRef}
            style={styles.input}
            placeholder="Όνομα"
            placeholderTextColor="#aaa"
            value={firstName}
            onChangeText={setFirstName}
            returnKeyType="next"
            onSubmitEditing={() => nomosRef.current?.focus()}
            onFocus={() => handleInputFocus(4)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={nomosRef}
            style={styles.input}
            placeholder="Νομός"
            placeholderTextColor="#aaa"
            value={nomos}
            onChangeText={setNomos}
            returnKeyType="next"
            onSubmitEditing={() => cityRef.current?.focus()}
            onFocus={() => handleInputFocus(5)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={cityRef}
            style={styles.input}
            placeholder="Πόλη"
            placeholderTextColor="#aaa"
            value={city}
            onChangeText={setCity}
            returnKeyType="next"
            onSubmitEditing={() => postalRef.current?.focus()}
            onFocus={() => handleInputFocus(6)}
          />
        </View>

        <View style={styles.inputContainer}>
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
            onFocus={() => handleInputFocus(7)}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={addressRef}
            style={styles.input}
            placeholder="Διεύθυνση"
            placeholderTextColor="#aaa"
            value={address}
            onChangeText={setAddress}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            onFocus={() => handleInputFocus(8)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Εγγραφή</Text>
        </TouchableOpacity>

        {/* Extra space για keyboard */}
        <View style={styles.extraSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ff5252",
    borderWidth: 2,
  },
  errorText: {
    color: "#ff5252",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: "#00ADFE",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#00ADFE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  extraSpace: {
    height: 100, // Extra space για keyboard
  },
});

export default RegisterScreen;
