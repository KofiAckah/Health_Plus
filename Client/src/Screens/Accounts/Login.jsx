import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { Logo, CompanyName } from "../../Components/Default";

const Login = () => {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-secondary-600">
      <View className="bg-white rounded-b-[70px] pt-16 pb-24">
        <View className="flex flex-row w-full justify-center items-center mb-14">
          <Image source={Logo} className="w-20 h-20" />
          <Text className="text-3xl ml-5 font-semibold">{CompanyName}</Text>
        </View>
        <View className="mx-5">
          <Text className="text-2xl font-bold uppercase mb-4">Login</Text>
          <View className="mt-5">
            <Text className="text-gray-600 text-lg font-semibold">Email</Text>
            <View className="flex flex-row items-center border-b border-secondary-600 py-2">
              <FontAwesomeIcon icon={faUser} size={20} color="#F06A37" />
              <TextInput
                placeholder="Enter your email"
                className="flex-1 ml-2"
                keyboardType="email-address"
              />
            </View>
          </View>
          <View className="mt-5">
            <Text className="text-gray-600 text-lg font-semibold">
              Password
            </Text>
            <View className="flex flex-row items-center border-b border-secondary-600 py-2">
              <FontAwesomeIcon icon={faLock} size={20} color="#F06A37" />
              <TextInput
                placeholder="Enter your password"
                secureTextEntry
                className="flex-1 ml-2"
              />
            </View>
          </View>
        </View>
      </View>
      <View className="flex justify-center items-center mb-10">
        <TouchableOpacity
          className="bg-white p-3 rounded-xl mt-14 mb-7 mx-auto w-[80%]"
          onPress={() => navigation.navigate("Home")}
        >
          <Text className="text-secondary-600 text-center text-lg font-semibold">
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          className="mb-5"
        >
          <Text className="text-white text-lg font-semibold">
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <Text className="text-primary-400">Don't have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          className="ml-1"
        >
          <Text className="text-white font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
      <StatusBar barStyle="light-content" backgroundColor={"#F06A37"} />
    </ScrollView>
  );
};

export default Login;
