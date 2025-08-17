
// 1. Εισαγωγές βιβλιοθηκών και components
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Εισαγωγή components και context από την εφαρμογή
import MapComponent from "@/components/Map/MapComponent";
import Step3Schedule from "@/components/Step3Schedule";
import SummaryComponent from "@/components/SummaryComponent";
import { useGeocodeAddresses } from "@/hooks/useGeocodeAddresses";
import { useAuth } from "@/context/AuthContext";
import { useIP } from "@/context/IPContext";

// Debug log κατά την αρχική φόρτωση
console.log("🧭 Multiple step form loaded");

// Χάρτης εικόνων για κάθε τύπο οχήματος
const vehicleImageMap = {
  "Αυτοκίνητο": require("@/assets/formImages/carImg.png"),
  "VAN": require("@/assets/formImages/vanImg.png"),
  "SUV": require("@/assets/formImages/suvImg.jpg"),
  "Moto": require("@/assets/formImages/motoImg.jpg"),
};

// Component κάρτας υπηρεσίας
const ServiceCard = ({ service, onSelect }) => (
  <View style={styles.serviceCard}>
    <Text style={styles.servicePrice}>{service.price.toFixed(2)} €</Text>
    <Text style={styles.serviceTitle}>{service.name}</Text>
    <Text style={styles.serviceDescription}>{service.description}</Text>
    <TouchableOpacity style={styles.selectButton} onPress={onSelect}>
      <Text style={styles.selectButtonText}>Επιλογή</Text>
    </TouchableOpacity>
  </View>
);

// Component κάρτας πλυντηρίου (διεύθυνση)
const AddressCard = ({ service, onSelect }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{service.title}</Text>
    <Text style={styles.address}>{service.address}</Text>
    <Text style={styles.description}>{service.description}</Text>
    <TouchableOpacity style={styles.button} onPress={onSelect}>
      <Text style={styles.buttonText}>Επιλογή</Text>
    </TouchableOpacity>
  </View>
);

// Κυρίως component φόρμας
const MultiStepFormScreen = () => {
  // Hooks context
  const { isLoggedIn } = useAuth();
  const { ip } = useIP();

  // States για κάθε βήμα
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [schedule, setSchedule] = useState({ date: null, time: null });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedCarWash, setSelectedCarWash] = useState(null);
  const [carWashes, setCarWashes] = useState([]);
  const [services, setServices] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loadingVehicleTypes, setLoadingVehicleTypes] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);

  const scrollRef = useRef(null); // Scroll για επιστροφή σε συγκεκριμένα σημεία
  const insets = useSafeAreaInsets(); // Safe padding top

  // Δημιουργία αντιστοίχισης index → τύπος οχήματος
  const vehicleTypeMapping = {};
  vehicleTypes.forEach((type, index) => {
    vehicleTypeMapping[index + 1] = type;
  });

  // 📡 Βήμα 1: Φόρτωση τύπων οχημάτων
  useEffect(() => {
    fetch(`http://${ip}:5000/api/services/vehicle-types`)
      .then((res) => res.json())
      .then((data) => setVehicleTypes(data))
      .catch((err) => console.error("❌ Error fetching vehicle types:", err))
      .finally(() => setLoadingVehicleTypes(false));
  }, [ip]);

  // 📡 Βήμα 2: Φόρτωση υπηρεσιών για επιλεγμένο όχημα
  useEffect(() => {
    if (!selectedVehicle) return;
    setLoadingServices(true);
    const vehicleType = vehicleTypeMapping[selectedVehicle];
    fetch(`http://${ip}:5000/api/services/by-vehicle/${vehicleType}`)
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("❌ Failed to load services:", err))
      .finally(() => setLoadingServices(false));
  }, [selectedVehicle, ip]);

  // 📡 Βήμα 3: Φόρτωση πλυντηρίων για την υπηρεσία + όχημα
  useEffect(() => {
    if (!selectedService || !selectedVehicle) return;
    const vehicleType = vehicleTypeMapping[selectedVehicle];
    fetch(
      `http://${ip}:5000/api/carwashes?service_name=${encodeURIComponent(
        selectedService.title
      )}&vehicle_type=${encodeURIComponent(vehicleType)}`
    )
      .then((res) => res.json())
      .then((data) => setCarWashes(data))
      .catch((err) => console.error("❌ Failed to load car washes:", err));
  }, [selectedService, selectedVehicle, ip]);

  // 📍 Γεωκωδικοποίηση διευθύνσεων πλυντηρίων για τον χάρτη
  const carwashAddresses = useMemo(() => {
    return carWashes.map((cw, idx) => ({
      id: idx,
      title: cw.name,
      address: cw.address,
      description: cw.address,
    }));
  }, [carWashes]);

  const markers = useGeocodeAddresses(carwashAddresses); // Προετοιμασία markers για χάρτη

  // 🔁 Επιλογή οχήματος (επαναφορά κατάστασης)
  const handleVehicleSelect = (id) => {
    setSelectedVehicle(id);
    setSelectedService(null);
    setSelectedAddress(null);
    setSelectedCarWash(null);
    setSchedule({ date: null, time: null });
    setCurrentStep(1);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 300, animated: true });
    }, 300);
  };

  // Επιλογή υπηρεσίας → επόμενο βήμα
  const handleServiceSelect = (svc) => {
    setSelectedService(svc);
    setCurrentStep((prev) => prev + 1);
  };

  // ⬅️ Πίσω σε προηγούμενο βήμα
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) setSelectedService(null);
      else if (currentStep === 3) {
        setSelectedAddress(null);
        setSelectedCarWash(null);
      } else if (currentStep === 4) {
        setSchedule({ date: null, time: null });
      }
    }
  };

  // 🧩 Return component
  return (
    <SafeAreaView style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>

        {/* 👣 Ενδείξεις Βημάτων */}
        <View style={styles.stepIndicatorContainer}>
          {["Υπηρεσία", "Πλυντήριο", "Ημερομηνία", "Κράτηση"].map((label, index) => {
            const stepIndex = index + 1;
            const isActive = currentStep === stepIndex;
            const isCompleted = currentStep > stepIndex;

            return (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.stepItem}
                  disabled={stepIndex >= currentStep}
                  onPress={() => setCurrentStep(stepIndex)}
                >
                  <View style={[
                    styles.stepCircle,
                    isCompleted && styles.completedStep,
                    isActive && styles.activeStep,
                  ]}>
                    <Text style={styles.stepText}>{stepIndex}</Text>
                  </View>
                  <Text style={[
                    styles.stepLabel,
                    isCompleted && styles.completedLabel,
                    isActive && styles.activeLabel,
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
                {index < 3 && <View style={styles.stepLine} />}
              </React.Fragment>
            );
          })}
        </View>

        {/* 🧾 Βήμα 1: Επιλογή οχήματος + υπηρεσίας */}
        {currentStep === 1 && (
          <>
            <Text style={styles.sectionHeader}>Επιλογή τύπου οχήματος</Text>
            {loadingVehicleTypes ? (
              <Text>Φορτώνω τύπους οχήματος…</Text>
            ) : (
              <View style={styles.vehicleCardsContainer}>
                {vehicleTypes.map((vehicleType, idx) => (
                  <TouchableOpacity
                    key={vehicleType}
                    style={styles.vehicleCard}
                    onPress={() => handleVehicleSelect(idx + 1)}
                  >
                    <Image
                      source={vehicleImageMap[vehicleType]}
                      style={styles.vehicleImage}
                    />
                    <Text style={styles.vehicleLabel}>{vehicleType}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedVehicle && (
              <View style={styles.servicesContainer}>
                <Text style={styles.servicesHeader}>Δείτε τις Υπηρεσίες</Text>
                {loadingServices ? (
                  <Text>Φορτώνω υπηρεσίες…</Text>
                ) : (
                  services.map((service) => (
                    <ServiceCard
                      key={service._id}
                      service={service}
                      onSelect={() =>
                        handleServiceSelect({
                          service_id: service._id,
                          car_wash_id: service.car_wash_id,
                          title: service.name,
                          price: service.price.toString(),
                        })
                      }
                    />
                  ))
                )}
              </View>
            )}
          </>
        )}

        {/* 🧼 Βήμα 2: Επιλογή πλυντηρίου + Χάρτης */}
        {currentStep === 2 && (
          <>
            <Text style={styles.sectionHeader}>Επιλέξτε πλυντήριο</Text>
            <MapComponent markers={markers} />
            {carWashes.map((cw) => (
              <AddressCard
                key={cw._id}
                service={{
                  title: cw.name,
                  address: cw.address,
                  description: cw.name,
                }}
                onSelect={() => {
                  setSelectedAddress(cw.address);
                  setSelectedCarWash(cw);
                  setCurrentStep(3);
                }}
              />
            ))}
          </>
        )}

        {/* 🕒 Βήμα 3: Επιλογή Ημερομηνίας/Ώρας */}
        {currentStep === 3 && (
          <Step3Schedule
            onNextStep={() => setCurrentStep(4)}
            onScheduleChange={(date, time) => setSchedule({ date, time })}
            selectedCarWashId={selectedCarWash?._id || null}
            ip={ip}
          />
        )}

        {/* 📋 Βήμα 4: Σύνοψη κράτησης */}
        {currentStep === 4 && (
          <SummaryComponent
            autoSaveOnMount={isLoggedIn}
            vehicle={vehicleTypes[selectedVehicle - 1] || null}
            service={selectedService}
            schedule={schedule}
            address={selectedAddress}
            carWash={selectedCarWash}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// styles are unchanged...
const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20 },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  vehicleCardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

vehicleCard: {
  width: 130, 
  height: 110, 
  margin: 10,
  borderRadius: 12,
  backgroundColor: "#eee",
  alignItems: "center",
  justifyContent: "center",
  padding: 12,
  elevation: 2,
},
vehicleImage: {
  marginTop: 0,
  width: 130, 
  height: 90, 
  borderRadius: 10, 
  resizeMode: "contain",
},
vehicleLabel: {
  marginTop: 3,
  fontSize: 12, 
  textAlign: "center",
  fontWeight: "600",
},

  servicesContainer: { marginTop: 20 },
  servicesHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  serviceCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  serviceTitle: { fontSize: 18, fontWeight: "bold" },
  serviceDescription: { marginTop: 5, fontSize: 14, color: "#666" },
  servicePrice: { fontSize: 16, fontWeight: "bold", color: "#00ADFE" },
  selectButton: {
    backgroundColor: "#00ADFE",
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  selectButtonText: { color: "#fff", textAlign: "center" },
  card: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
    borderRadius: 8,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  address: { fontSize: 14, color: "#444" },
  description: { fontSize: 12, color: "#777" },
  button: {
    marginTop: 10,
    backgroundColor: "#00ADFE",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", textAlign: "center" },

stepIndicatorContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 30,
  flexWrap: "nowrap",
},
stepItem: {
  alignItems: "center",
  width: 70,
},
stepCircle: {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: "#ccc",
  justifyContent: "center",
  alignItems: "center",
},
stepText: {
  color: "#fff",
  fontWeight: "bold",
},
stepLabel: {
  fontSize: 10,
  textAlign: "center",
  marginTop: 4,
  color: "#999",
},
activeStep: {
  backgroundColor: "#00ADFE",
},
completedStep: {
  backgroundColor: "#00C851",
},
activeLabel: {
  color: "#00ADFE",
  fontWeight: "bold",
},
completedLabel: {
  color: "#00C851",
},
stepLine: {
  height: 2,
  backgroundColor: "#ccc",
  flex: 1,
  marginHorizontal: 4,
},

});

export default MultiStepFormScreen;
