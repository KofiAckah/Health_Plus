import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { BackendLink, Logo, CompanyName } from "../Components/Default";
import { LinearGradient } from "expo-linear-gradient";
import { HotlinesData } from "../Components/HotLines";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const Emergency = () => {
  const navigation = useNavigation();
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
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 flex-row items-center justify-start m-4 ">
        <Image source={Logo} className="w-12 h-12" />
        <Text className="ml-4 text-xl font-bold">{CompanyName}</Text>
      </View>

      <View className="flex-1 items-center justify-center bg-white p-4">
        {HotlinesData.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className="w-full rounded-3xl h-20 overflow-hidden mb-4"
          >
            <LinearGradient
              colors={[item.color, "#000"]}
              className="w-full h-20 rounded-lg relative"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="flex-1 justify-center ml-8">
                <Text className="text-lg text-white">Call {item.name}</Text>
                <Text className="text-lg font-bold text-white">
                  {item.cell}
                </Text>
              </View>
              <Image
                source={item.image}
                className="w-24 h-24 mb-2 absolute top-0 right-0 bottom-0 m-auto opacity-40"
              />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
      {/* Map Section */}
      <View
        style={{
          height: 300,
          borderRadius: 16,
          overflow: "hidden",
          marginHorizontal: 16,
          marginBottom: 16,
          borderColor: "#f00",
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Emergency;
