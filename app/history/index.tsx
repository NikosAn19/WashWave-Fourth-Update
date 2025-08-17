// BookingHistoryScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useIP } from "@/context/IPContext";

// Ορισμός τύπου για κάθε κράτηση
interface Reservation {
  reservation_id: string;
  reserved_at: string;
  vehicle_type: string;
  car_wash_name: string;
  service: {
    name: string;
    price: number;
  };
}

const BookingHistoryScreen: React.FC = () => {
  const { user } = useAuth(); // Ανάκτηση στοιχείων χρήστη
  const { ip } = useIP(); // Απόκτηση IP backend από context
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Αν δεν έχει γίνει login ή δεν υπάρχει email, δεν κάνουμε fetch
    if (!user?.email) return;

    const fetchHistory = async () => {
      try {
        console.log("📡 Αίτημα για ιστορικό κρατήσεων με email:", user.email);

        const res = await fetch(
          `http://${ip}:5000/api/history?email=${encodeURIComponent(user.email)}`
        );

        if (!res.ok) throw new Error(`Server returned status: ${res.status}`);
        const data: Reservation[] = await res.json();

        console.log("✅ Ελήφθησαν κρατήσεις:", data.length);
        setReservations(data);
      } catch (err) {
        console.error("❗ Σφάλμα κατά την ανάκτηση ιστορικού:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, ip]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ADFE" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Ιστορικό Κρατήσεων</Text>

      {reservations.length === 0 ? (
        <Text style={styles.emptyText}>Δεν υπάρχουν προηγούμενες κρατήσεις.</Text>
      ) : (
        reservations.map((r) => (
          <View key={r.reservation_id} style={styles.card}>
            <Text style={styles.cardItemTitle}>Ημερομηνία & Ώρα Κράτησης</Text>
            <Text style={styles.cardItemValue}>
              {new Date(r.reserved_at).toLocaleString()}
            </Text>

            <Text style={styles.cardItemTitle}>Τύπος Οχήματος</Text>
            <Text style={styles.cardItemValue}>{r.vehicle_type}</Text>

            <Text style={styles.cardItemTitle}>Επιλεγμένη Υπηρεσία</Text>
            <Text style={styles.cardItemValue}>{r.service.name}</Text>

            <Text style={styles.cardItemTitle}>Κόστος</Text>
            <Text style={styles.cardItemValue}>{r.service.price} €</Text>

            <Text style={styles.cardItemTitle}>Πλυντήριο</Text>
            <Text style={styles.cardItemValue}>{r.car_wash_name}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

// Στυλ για την εμφάνιση του ιστορικού
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    fontSize: 16,
    marginTop: 40,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 5,
  },
  cardItemValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
});

export default BookingHistoryScreen;
