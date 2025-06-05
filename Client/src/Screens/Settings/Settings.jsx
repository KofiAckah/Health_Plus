import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SettingsData } from "../../Components/SettingData"; // <-- Correct import

const Settings = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Header */}
        <View>
          <View className="flex-row items-center justify-between p-5 bg-secondary-100 relative">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon icon={faChevronLeft} size={24} color="#f5f5f5" />
            </TouchableOpacity>
            <View className="absolute left-0 right-0 items-center">
              <Text className="text-xl font-semibold text-white">Settings</Text>
            </View>
          </View>
        </View>
        {/* Settings Options */}
        <View className="mt-4">
          {SettingsData.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center p-3 mb-2 bg-secondary-200 pl-5"
              onPress={() => item.onPress(navigation)}
            >
              <FontAwesomeIcon icon={item.icon} size={24} color="#259FB7" />
              <View className="ml-7">
                <Text className=" text-lg font-semibold">{item.name}</Text>
                <Text className=" text-primary-400">{item.info}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
