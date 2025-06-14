import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const ShowMap = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
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
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
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
