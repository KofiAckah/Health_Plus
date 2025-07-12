import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { BackendLink, Logo, CompanyName } from "../Components/Default";
import { LinearGradient } from "expo-linear-gradient";
import { HotlinesData } from "../Components/HotLines";
import ShowMap from "../Components/ShowMap";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faFire,
  faHeartPulse,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";

const Emergency = () => {
  const navigation = useNavigation();
  const [showLocations, setShowLocations] = useState({
    police: false,
    fire: false,
    hospital: false,
  });

  // Toggle location types
  const toggleLocationType = (type) => {
    setShowLocations((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <View className="flex-1 flex-row items-center justify-start m-4">
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
                  className="w-20 h-20 absolute right-0 opacity-40"
                />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Find Nearby Services Section */}
        <View className="px-4 mb-3">
          <Text className="text-xl font-bold mb-3">Find Nearby Services</Text>
          <View className="flex-row justify-between">
            {/* Police Button */}
            <TouchableOpacity
              className={`px-4 py-3 rounded-xl flex-1 mx-1 flex-row items-center justify-center ${
                showLocations.police ? "bg-blue-700" : "bg-secondary-200"
              }`}
              onPress={() => toggleLocationType("police")}
            >
              <FontAwesomeIcon
                icon={faShieldAlt}
                size={18}
                color={showLocations.police ? "#fff" : "#023e8a"}
                style={{ marginRight: 5 }}
              />
              <Text
                className={`font-semibold ${
                  showLocations.police ? "text-white" : "text-primary-300"
                }`}
              >
                Police
              </Text>
            </TouchableOpacity>

            {/* Fire Station Button */}
            <TouchableOpacity
              className={`px-4 py-3 rounded-xl flex-1 mx-1 flex-row items-center justify-center ${
                showLocations.fire ? "bg-red-600" : "bg-secondary-200"
              }`}
              onPress={() => toggleLocationType("fire")}
            >
              <FontAwesomeIcon
                icon={faFire}
                size={18}
                color={showLocations.fire ? "#fff" : "#023e8a"}
                style={{ marginRight: 5 }}
              />
              <Text
                className={`font-semibold ${
                  showLocations.fire ? "text-white" : "text-primary-300"
                }`}
              >
                Fire
              </Text>
            </TouchableOpacity>

            {/* Hospital Button */}
            <TouchableOpacity
              className={`px-4 py-3 rounded-xl flex-1 mx-1 flex-row items-center justify-center ${
                showLocations.hospital ? "bg-green-700" : "bg-secondary-200"
              }`}
              onPress={() => toggleLocationType("hospital")}
            >
              <FontAwesomeIcon
                icon={faHeartPulse}
                size={18}
                color={showLocations.hospital ? "#fff" : "#023e8a"}
                style={{ marginRight: 5 }}
              />
              <Text
                className={`font-semibold ${
                  showLocations.hospital ? "text-white" : "text-primary-300"
                }`}
              >
                Hospital
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Section */}
        <ShowMap showLocations={showLocations} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Emergency;
