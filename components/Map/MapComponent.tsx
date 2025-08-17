import React from "react";
import { StyleSheet, Dimensions, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

// ✅ Τύπος για κάθε marker που θα εμφανίζεται στον χάρτη
export type MarkerType = {
  id: number; // μοναδικό αναγνωριστικό
  title: string; // τίτλος marker
  description: string; // περιγραφή marker
  coordinate: {
    latitude: number;
    longitude: number;
  };
};

type MapComponentProps = {
  markers: MarkerType[];
};

// 📍 Κύριο component που εμφανίζει τον χάρτη
const MapComponent: React.FC<MapComponentProps> = ({ markers }) => {
  // 🧭 Ορισμός αρχικής περιοχής (zoom και θέση)
  const initialRegion = {
    latitude: markers.length > 0 ? markers[0].coordinate.latitude : 37.9838, // default Αθήνα
    longitude: markers.length > 0 ? markers[0].coordinate.longitude : 23.7275,
    latitudeDelta: 0.05, // zoom level (όσο μικρότερο τόσο πιο κοντά)
    longitudeDelta: 0.05,
  };

  return (
    // 🗺️ Το MapView εμφανίζει τον χάρτη
    <MapView style={styles.map} initialRegion={initialRegion}>
      {/* 🔁 Για κάθε marker στο array, εμφάνιση Marker στο χάρτη */}
      {markers.map((marker) =>
        marker.coordinate ? (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ) : null // αν λείπει συντεταγμένη, παράλειψε τον marker
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width - 40, // προσαρμογή στο πλάτος της οθόνης με περιθώριο
    height: 300,
    borderRadius: 8,
  },
});

export default MapComponent;
