// components/RegisterModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { ToastAndroid } from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

interface RegisterModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const router = useRouter();

  // ---- κοινά ----
  const [step, setStep] = useState<1|2>(1);

  // ---- βήμα 1: εγγραφή ----
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [nomos, setNomos] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");

  // ---- βήμα 2: επαλήθευση ----
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string|undefined>(undefined);
  const { login } = useAuth();

  // Αν έχεις στον server επιστροφή του κωδικού (μόνο για dev), τον αποθηκεύεις
  const handleRegister = async () => {
    try {
      const payload = {
        email,password,
        phone_number: phone,
        last_name: lastName,
        first_name: firstName,
        state: nomos,
        city,
        zip_code: postalCode,
        address,
      };
      const res = await fetch("http://10.10.20.47:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return Alert.alert("Σφάλμα εγγραφής", data.message||"Κάτι πήγε στραβά");
      }
      // επιτυχία
      setDevCode(data.verification_code);  // αν σου το στέλνει ο server
      setStep(2);
      // toast / alert με τον κωδικό (μόνο dev)
      if (Platform.OS==="android" && data.verification_code) {
        ToastAndroid.show(
          `Code: ${data.verification_code}`,
          ToastAndroid.LONG
        );
      } else if (data.verification_code) {
        Alert.alert("Verification code", data.verification_code);
      }
    } catch(e) {
      console.error(e);
      Alert.alert("Σφάλμα", "Σφάλμα δικτύου");
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch("http://10.10.20.47:5000/api/auth/verify", {
        method: "POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ email, verification_code: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        return Alert.alert("Σφάλμα επαλήθευσης", data.message||"Λάθος κωδικός");
      }
      login(data.user);
      // επιτυχής επαλήθευση
      Alert.alert("Επιτυχία", "Το email επαληθεύθηκε!", [
        { text:"OK", onPress: onSuccess }
      ]);
    } catch(e) {
      console.error(e);
      Alert.alert("Σφάλμα", "Σφάλμα δικτύου");
    }
  };

  const onBack = () => {
    if (step===2) {
      setStep(1);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onBack}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS==="ios"?"padding":undefined}
      >
        <View style={styles.modalContainer}>
          {step===1 ? (
            <>
              <Text style={styles.title}>Εγγραφή</Text>
              <TextInput
                style={styles.input}
                placeholder="Email*"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Κωδικός*"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Κινητό*"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Επώνυμο"
                value={lastName}
                onChangeText={setLastName}
              />
              <TextInput
                style={styles.input}
                placeholder="Όνομα"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder="Νομός"
                value={nomos}
                onChangeText={setNomos}
              />
              <TextInput
                style={styles.input}
                placeholder="Πόλη"
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={styles.input}
                placeholder="ΤΚ"
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Διεύθυνση"
                value={address}
                onChangeText={setAddress}
              />
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={[styles.button,styles.cancelButton]}
                  onPress={onBack}
                >
                  <Text style={styles.buttonText}>Άκυρο</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button,styles.submitButton]}
                  onPress={handleRegister}
                >
                  <Text style={styles.buttonText}>Επόμενο</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Επαλήθευση Email</Text>
              <Text style={styles.subheader}>
                Πληκτρολογήστε τον 6ψήφιο κωδικό στο
                <Text style={{fontWeight:"bold"}}> {email}</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Κωδικός επαλήθευσης"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
              />
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={[styles.button,styles.cancelButton]}
                  onPress={onBack}
                >
                  <Text style={styles.buttonText}>Πίσω</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button,styles.submitButton]}
                  onPress={handleVerify}
                >
                  <Text style={styles.buttonText}>Επαλήθευση</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  subheader: {
    textAlign: "center",
    marginBottom: 15,
    color: "#555",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex:1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#00ADFE",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RegisterModal;
