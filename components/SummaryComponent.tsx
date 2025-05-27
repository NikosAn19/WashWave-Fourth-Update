// components/SummaryComponent.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import { RelativePathString, useRouter } from "expo-router";

type SummaryProps = {
  vehicle: { label: string };
  service: { service_id: string; title: string; price: string };
  address: string;
  schedule: { date: string; time: string };
  carWash: { _id: string } | null;
  autoSaveOnMount?: boolean;
};

const SummaryComponent: React.FC<SummaryProps> = ({
  vehicle,
  service,
  address,
  schedule,
  carWash,
}) => {
  const { isLoggedIn, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [reservationDone, setReservationDone] = useState(false);

  const router = useRouter();

  // μόλις reservationDone γίνει true, αποθηκεύουμε στη βάση
  useEffect(() => {
    if (!reservationDone || !user) return;
    if (isLoggedIn) {
      console.log("user is logged in");
    }

    const saveReservation = async () => {
      try {
        const res = await fetch("http://10.10.20.47:5000/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_email: user.email,
            vehicle_type: vehicle.label,
            service_id: service.service_id,
            car_wash_id: carWash?._id,
            reserved_at: `${schedule.date}T${schedule.time}:00`,
          }),
        });
        if (!res.ok) throw new Error("Network response was not ok");
        // setReservationDone(false);

        console.log("Reservation saved successfully");
      } catch (err) {
        console.error("Error saving reservation:", err);
        Alert.alert(
          "Σφάλμα",
          "Η κράτηση ολοκληρώθηκε τοπικά, αλλά δεν αποθηκεύτηκε στο ιστορικό."
        );
      }
    };

    saveReservation();
  }, [reservationDone, user]);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>Σύνοψη</Text>

        <View style={styles.summaryItem}>
          <Text style={styles.itemTitle}>Τύπος Οχήματος</Text>
          <Text style={styles.itemValue}>{vehicle.label}</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.itemTitle}>Υπηρεσία</Text>
          <Text style={styles.itemValue}>{service.title}</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.itemTitle}>Κόστος</Text>
          <Text style={styles.itemCost}>{service.price} €</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.itemTitle}>Διεύθυνση & Ώρα</Text>
          <Text style={styles.itemValue}>
            {address}
            {"\n"}
            {schedule.date} - {schedule.time}
          </Text>
        </View>
      </View>

      {isLoggedIn && !reservationDone && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setReservationDone(true)}
        >
          <Text style={styles.confirmButtonText}>Επιβεβαίωση Κράτησης</Text>
        </TouchableOpacity>
      )}
      {isLoggedIn && reservationDone && (
        <View style={styles.confirmationContainer}>
          <FontAwesome name="check-circle" size={54} color="#00ADFE" />
          <Text style={styles.confirmationText}>
            Η κράτησή σας έχει ολοκληρωθεί!
          </Text>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => {
              setReservationDone(false);
              router.push("/multistepform" as RelativePathString); // αν η διαδρομή σου είναι άλλαξε ανάλογα
            }}
          >
            <Text style={styles.newButtonText}>Κάντε Νέα Κράτηση</Text>
          </TouchableOpacity>
        </View>
      )}
      {!isLoggedIn && !reservationDone && (
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>Για να ολοκληρώσετε τη κράτηση:</Text>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => setShowLoginModal(true)}
            >
              <Text style={styles.authButtonText}>Σύνδεση</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authButton, styles.registerButton]}
              onPress={() => setShowRegisterModal(true)}
            >
              <Text style={styles.authButtonText}>Εγγραφή</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* LoginModal και RegisterModal εκτελούν το onSuccess() όταν τελειώσουν με επιτυχία */}
      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          // setReservationDone(true);
        }}
      />
      <RegisterModal
        visible={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          setShowRegisterModal(false);
          // setReservationDone(true);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#222",
  },
  summaryItem: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888",
  },
  itemValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 5,
  },
  itemCost: {
    fontSize: 18,
    fontWeight: "600",
    color: "#00ADFE",
    marginTop: 5,
  },
  confirmationContainer: {
    alignItems: "center",
    padding: 5,
  },
  confirmationText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00ADFE",
    textAlign: "center",
    marginTop: 10,
  },
  promptContainer: {
    alignItems: "center",
    padding: 20,
  },
  promptText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  authButton: {
    backgroundColor: "#00ADFE",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  registerButton: {
    backgroundColor: "#0A74DA",
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#00ADFE",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  newButton: {
    marginTop: 20,
    backgroundColor: "#00ADFE",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  newButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default SummaryComponent;
