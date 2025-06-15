import { Linking, Alert } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BackendLink } from "./Default";

async function sendEmergencyCall(service) {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required.");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    let coords = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };

    // Reverse geocode to get address
    let address = "";
    try {
      let geocode = await Location.reverseGeocodeAsync({
        latitude: coords.lat,
        longitude: coords.lng,
      });
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        address = [
          place.name,
          place.street,
          place.city,
          place.region,
          place.country,
        ]
          .filter(Boolean)
          .join(", ");
      }
    } catch (err) {
      // If geocoding fails, leave address blank
      address = "";
    }

    let token = await AsyncStorage.getItem("token");
    await axios.post(
      `${BackendLink}/emergency-call${token ? "" : "/anonymous"}`,
      {
        service,
        location: { ...coords, address },
      },
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
  } catch (err) {
    console.error("Failed to send emergency call:", err);
  }
}

export const HotlinesData = [
  {
    name: "Fire Service",
    cell: 911,
    image: require("../../assets/FireLogo.jpg"),
    onPress: async () => {
      await sendEmergencyCall("Fire Service");
      Linking.openURL("tel:911");
    },
    color: "#ff0000",
  },
  {
    name: "Police Service",
    cell: 999,
    image: require("../../assets/PoliceLogo.jpeg"),
    onPress: async () => {
      await sendEmergencyCall("Police Service");
      Linking.openURL("tel:999");
    },
    color: "#0000ff",
  },
  {
    name: "Ambulance Service",
    cell: 112,
    image: require("../../assets/GHSLogo.jpeg"),
    onPress: async () => {
      await sendEmergencyCall("Ambulance Service");
      Linking.openURL("tel:112");
    },
    color: "#00ff00",
  },
];
