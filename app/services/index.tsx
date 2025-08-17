// ServicesScreen.tsx

// Εισαγωγές
import { useIP } from "@/context/IPContext";
import { getServiceImage } from "@/utils/serviceImages";
import { RelativePathString, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

// Τύπος για τις υπηρεσίες
type Service = {
  _id: string;
  car_wash_id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  vehicle_types: string[];
  created_at: string;
  available_locations?: number;
};

// Κάρτα εμφάνισης υπηρεσίας
type ServiceCardProps = {
  service: Service;
  onPress: (service: Service) => void;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => (
  <View style={styles.card}>
    <Image
      source={getServiceImage(service.name)}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <View style={styles.textContainer}>
      <Text style={styles.cardTitle}>{service.name}</Text>
      <Text style={styles.cardDescription}>{service.description}</Text>
      <View style={styles.metaContainer}>
        <Text style={styles.meta}>
          Τιμή: από {service.price}€ · Διάρκεια: από {service.duration}′ · Οχήματα:{" "}
          {service.vehicle_types.join(", ")}
        </Text>
        {service.available_locations && (
          <Text style={styles.locationsBadge}>
            📍 {service.available_locations} πλυντήρια
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={() => onPress(service)}>
        <Text style={styles.buttonText}>Κλείσε ραντεβού</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ServicesScreen: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { ip } = useIP();
  const router = useRouter();

  // 🔁 Φόρτωση υπηρεσιών από το backend
  useEffect(() => {
    console.log("🔄 Fetching distinct services from backend...");
    fetch(`http://${ip}:5000/api/services/distinct`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Service[]) => {
        console.log(`✅ Loaded ${data.length} services`);
        setServices(data);
      })
      .catch((err) => {
        console.error("❌ Error loading services:", err);
        setError("Δεν ήταν δυνατή η φόρτωση των υπηρεσιών.");
      })
      .finally(() => {
        console.log("🔚 Loading finished");
        setLoading(false);
      });
  }, [ip]);

  // 📍 Χειρισμός επιλογής υπηρεσίας
  const handleBook = (service: Service) => {
    console.log("📌 User selected service:", service.name);
    Alert.alert(
      "Κλείσιμο Ραντεβού",
      `Θέλετε να κλείσετε ραντεβού για την υπηρεσία "${service.name}";`,
      [
        { text: "Άκυρο", style: "cancel" },
        {
          text: "Ναι",
          onPress: () => {
            console.log("📅 Navigating to form for:", service.name);
            router.push("/multistepform" as RelativePathString);
          },
        },
      ]
    );
  };

  // ⏳ Εμφάνιση φόρτωσης
  if (loading) {
    console.log("⌛ Loading services...");
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ADFE" />
        <Text style={styles.loadingText}>Φορτώνω υπηρεσίες...</Text>
      </View>
    );
  }

  // ⚠️ Εμφάνιση σφάλματος
  if (error) {
    console.warn("⚠️ Error state active:", error);
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            console.log("🔁 Retry clicked");
            setLoading(true);
            setError("");
          }}
        >
          <Text style={styles.retryButtonText}>Δοκίμασε ξανά</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 📋 Εμφάνιση λίστας υπηρεσιών
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Υπηρεσίες</Text>
      <Text style={styles.subheader}>
        Διαθέσιμες υπηρεσίες σε {services.length} κατηγορίες
      </Text>

      {services.map((svc) => (
        <ServiceCard
          key={`${svc.name}-${svc.vehicle_types}`}
          service={svc}
          onPress={handleBook}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    color: "#ff5252",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#00ADFE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subheader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  textContainer: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    marginBottom: 12,
  },
  metaContainer: {
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  locationsBadge: {
    fontSize: 12,
    color: "#00ADFE",
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#00ADFE",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#00ADFE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServicesScreen;
