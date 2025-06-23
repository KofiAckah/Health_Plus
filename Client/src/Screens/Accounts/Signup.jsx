import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { Logo, CompanyName, BackendLink } from "../../Components/Default";

const Signup = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${BackendLink}/account/signup`, {
        name,
        email,
        password,
        confirmPassword,
      });
      Alert.alert(
        "Success",
        "Account created! Please check your email for verification.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("VerifyEmail", { email }),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Sign Up Failed",
        error?.response?.data?.msg || "Could not create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary-100">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1 bg-secondary-100"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="bg-white rounded-b-[70px] pt-7 pb-20">
            <View className="flex flex-row w-full justify-center items-center mb-14">
              <Image source={Logo} className="w-20 h-20" />
              <Text className="text-3xl ml-5 font-semibold">{CompanyName}</Text>
            </View>
            <View className="mx-5">
              <Text className="text-2xl font-bold uppercase mb-4">Sign Up</Text>
              <View className="mt-2">
                <Text className="text-gray-600 text-lg font-semibold">
                  Name
                </Text>
                <View className="flex flex-row items-center border-b border-secondary-300 py-2">
                  <FontAwesomeIcon icon={faUser} size={20} color="#259FB7" />
                  <TextInput
                    placeholder="Enter your name"
                    className="flex-1 ml-2"
                    value={name}
                    onChangeText={setName}
                    editable={!loading}
                  />
                </View>
              </View>
              <View className="mt-5">
                <Text className="text-gray-600 text-lg font-semibold">
                  Email
                </Text>
                <View className="flex flex-row items-center border-b border-secondary-300 py-2">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    size={20}
                    color="#259FB7"
                  />
                  <TextInput
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    className="flex-1 ml-2"
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
              <View className="mt-5">
                <Text className="text-gray-600 text-lg font-semibold">
                  Confirm Password
                </Text>
                <View className="flex flex-row items-center border-b border-secondary-300 py-2">
                  <FontAwesomeIcon icon={faLock} size={20} color="#259FB7" />
                  <TextInput
                    placeholder="Confirm your password"
                    secureTextEntry
                    className="flex-1 ml-2"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!loading}
                  />
                </View>
              </View>
            </View>
          </View>
          <View className="flex justify-center items-center mb-10">
            <TouchableOpacity
              className="bg-white p-3 rounded-xl mt-14 mb-7 mx-auto w-[80%]"
              onPress={handleSignup}
              disabled={loading}
            >
              <Text className="text-secondary-100 text-center text-lg font-semibold">
                {loading ? "Signing up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>
            <Text className="text-black">Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              className="ml-1"
              disabled={loading}
            >
              <Text className="text-white font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;
