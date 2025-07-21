import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import ConfigService from "../Services/ConfigService";

const ShowMap = ({
  showLocations = { police: false, fire: false, hospital: false },
}) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [places, setPlaces] = useState({
    police: [],
    fire: [],
    hospital: [],
  });
  const [loading, setLoading] = useState({
    police: false,
    fire: false,
    hospital: false,
  });

  // Get Google Maps API key from backend
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const key = await ConfigService.getGoogleMapsApiKey();
        setApiKey(key);
      } catch (error) {
        console.error("Failed to fetch Google Maps API key:", error);
      }
    };
    fetchApiKey();
  }, []);

  // Get current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Reverse geocode to get address
      try {
        let geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (geocode && geocode.length > 0) {
          const place = geocode[0];
          const placeName = [
            place.name,
            place.street,
            place.city,
            place.region,
            place.country,
          ]
            .filter(Boolean)
            .join(", ");
          setAddress(placeName);
        }
      } catch (err) {
        setAddress("");
      }
    })();
  }, []);

  // Effect to load places when showLocations changes and API key is available
  useEffect(() => {
    if (location && apiKey) {
      if (showLocations.police && places.police.length === 0) {
        findNearbyPlaces("police");
      }
      if (showLocations.fire && places.fire.length === 0) {
        findNearbyPlaces("fire_station");
      }
      if (showLocations.hospital && places.hospital.length === 0) {
        findNearbyPlaces("hospital");
      }
    }
  }, [location, showLocations, apiKey]);

  // Search for nearby places by type
  const findNearbyPlaces = async (type) => {
    if (!location || !apiKey) return;

    const typeKey = type === "fire_station" ? "fire" : type;

    setLoading((prev) => ({ ...prev, [typeKey]: true }));

    try {
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      const radius = 10000; // 10km radius

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.status === "OK") {
        setPlaces((prev) => ({
          ...prev,
          [typeKey]: result.results.map((place) => ({
            id: place.place_id,
            name: place.name,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            vicinity: place.vicinity,
          })),
        }));
      } else {
        console.error(`Error fetching ${type}:`, result.status);
        if (result.error_message) {
          console.error("API Error:", result.error_message);
        }
      }
    } catch (error) {
      console.error(`Error finding ${type}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [typeKey]: false }));
    }
  };

  // Pin colors based on place type
  const getPinColor = (type) => {
    switch (type) {
      case "police":
        return "#023e8a";
      case "fire":
        return "#ff0000";
      case "hospital":
        return "#228B22";
      default:
        return "#ff8c00";
    }
  };

  // Don't render map until we have API key
  if (!apiKey) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map configuration...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        height: 350,
        borderRadius: 16,
        overflow: "hidden",
        marginHorizontal: 16,
        marginBottom: 16,
      }}
    >
      {location ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
          showsCompass={true}
          provider={PROVIDER_GOOGLE}
          zoomControlEnabled={true}
        >
          {/* Current location marker */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={address || "Your Location"}
            description="You are here"
            pinColor="#ff8c00"
          />

          {/* Police station markers */}
          {showLocations.police &&
            places.police.map((place) => (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
                description={place.vicinity}
                pinColor={getPinColor("police")}
              />
            ))}

          {/* Fire station markers */}
          {showLocations.fire &&
            places.fire.map((place) => (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
                description={place.vicinity}
                pinColor={getPinColor("fire")}
              />
            ))}

          {/* Hospital markers */}
          {showLocations.hospital &&
            places.hospital.map((place) => (
              <Marker
                key={place.id}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
                description={place.vicinity}
                pinColor={getPinColor("hospital")}
              />
            ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>{errorMsg || "Loading map..."}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShowMap;
