// ServicesScreen.tsx
import React, { useEffect, useState } from "react";
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

type Service = {
  _id: string;
  car_wash_id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  vehicle_type: string;
  created_at: string;
};

type ServiceCardProps = {
  service: Service;
  onPress: (service: Service) => void;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => (
  <View style={styles.card}>
    <Image
      source={require("@/assets/services/redcarwash.jpg")}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <View style={styles.textContainer}>
      <Text style={styles.cardTitle}>{service.name}</Text>
      <Text style={styles.cardDescription}>{service.description}</Text>
      <Text style={styles.meta}>
        Τιμή: {service.price}€ · Διάρκεια: {service.duration}′ · Όχημα:{" "}
        {service.vehicle_type}
      </Text>
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

  useEffect(() => {
    fetch("http://10.10.20.47:5000/api/services")
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Service[]) => {
        setServices(data);
      })
      .catch((err) => {
        console.error("Error loading services:", err);
        setError("Δεν ήταν δυνατή η φόρτωση των υπηρεσιών.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBook = (service: Service) => {
    Alert.alert(
      "Κλείσιμο Ραντεβού",
      `Θέλετε να κλείσετε ραντεβού για την υπηρεσία "${service.name}";`
    );
    // εδώ μπορείς να προωθήσεις στο booking flow
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ADFE" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Υπηρεσίες</Text>
      {services.map((svc) => (
        <ServiceCard key={svc._id} service={svc} onPress={handleBook} />
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
  errorText: {
    color: "red",
    fontSize: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  textContainer: {
    padding: 15,
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
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    color: "#777",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#00ADFE",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServicesScreen;
