import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title }) => {
  const navigation = useNavigation();
  return (
    <View>
      <View className="flex-row items-center justify-between p-5 bg-secondary-100 relative">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faChevronLeft} size={24} color="#f5f5f5" />
        </TouchableOpacity>
        <View className="absolute left-0 right-0 items-center">
          <Text className="text-xl font-semibold text-white">{title}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
