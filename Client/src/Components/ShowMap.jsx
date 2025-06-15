import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const ShowMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState("");

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

  return (
    <View
      style={{
        height: 300,
        borderRadius: 16,
        overflow: "hidden",
        marginHorizontal: 16,
        marginBottom: 16,
        // borderColor: "#f00",
        // borderWidth: 1,
      }}
    >
      {location ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
          showsCompass={true}
          provider={MapView.PROVIDER_GOOGLE}
          zoomControlEnabled={true}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={address || "Your Location"}
          />
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
