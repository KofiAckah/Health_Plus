import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { Logo, CompanyName, BackendLink } from "../../Components/Default";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BackendLink}/account/login`, {
        email,
        password,
      });
      await AsyncStorage.setItem("token", response.data.token);
      navigation.reset({
        index: 0,
        routes: [{ name: "BottomTab" }],
      });
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error?.response?.data?.msg || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-secondary-100"
      keyboardShouldPersistTaps="handled"
    >
      <View className="bg-white rounded-b-[70px] pt-16 pb-24">
        <View className="flex flex-row w-full justify-center items-center mb-14">
          <Image source={Logo} className="w-20 h-20" />
          <Text className="text-3xl ml-5 font-semibold">{CompanyName}</Text>
        </View>
        <View className="mx-5">
          <Text className="text-2xl font-bold uppercase mb-4">Login</Text>
          <View className="mt-5">
            <Text className="text-gray-600 text-lg font-semibold">Email</Text>
            <View className="flex flex-row items-center border-b border-secondary-300 py-2">
              <FontAwesomeIcon icon={faUser} size={20} color="#259FB7" />
              <TextInput
                placeholder="Enter your email"
                className="flex-1 ml-2"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>
          </View>
          <View className="mt-5">
            <Text className="text-gray-600 text-lg font-semibold">
              Password
            </Text>
            <View className="flex flex-row items-center border-b border-secondary-300 py-2">
              <FontAwesomeIcon icon={faLock} size={20} color="#259FB7" />
              <TextInput
                placeholder="Enter your password"
                secureTextEntry
                className="flex-1 ml-2"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>
          </View>
        </View>
      </View>
      <View className="flex justify-center items-center mb-10">
        <TouchableOpacity
          className="bg-white p-3 rounded-xl mt-14 mb-7 mx-auto w-[80%]"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-secondary-100 text-center text-lg font-semibold">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgetPassword")}
          className="mb-5"
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <Text className="text-primary-200">Don't have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          className="ml-1"
          disabled={loading}
        >
          <Text className="text-white font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
      <StatusBar barStyle="light-content" backgroundColor={"#0071BD"} />
    </ScrollView>
  );
};

export default Login;
