import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export type AddressData = {
  id: number;
  title: string;
  description: string;
  address: string;
};

export type MarkerType = {
  id: number;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  } | null;
};

export function useGeocodeAddresses(addresses: AddressData[]): MarkerType[] {
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  useEffect(() => {
    (async () => {
      // Ζητάμε permission για το location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Χρησιμοποιούμε Promise.all για να επεξεργαστούμε όλες τις διευθύνσεις ταυτόχρονα
      const results: MarkerType[] = await Promise.all(
        addresses.map(async (item) => {
          try {
            const geocodeResults = await Location.geocodeAsync(item.address);
            if (geocodeResults.length > 0) {
              return {
                id: item.id,
                title: item.title,
                description: item.description,
                coordinate: {
                  latitude: geocodeResults[0].latitude,
                  longitude: geocodeResults[0].longitude,
                },
              };
            } else {
              console.error(`No geocoding results for address: ${item.address}`);
              return {
                id: item.id,
                title: item.title,
                description: item.description,
                coordinate: null,
              };
            }
          } catch (error) {
            console.error("Error geocoding address", item.address, error);
            return {
              id: item.id,
              title: item.title,
              description: item.description,
              coordinate: null,
            };
          }
        })
      );
      setMarkers(results);
    })();
  }, [addresses]);

  return markers;
}
