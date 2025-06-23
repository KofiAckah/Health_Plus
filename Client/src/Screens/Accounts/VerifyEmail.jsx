import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { BackendLink } from "../../Components/Default";

const CODE_LENGTH = 6;
const OTP_EXPIRE_SECONDS = 10 * 60;
const RESEND_WAIT_SECONDS = 30;

const VerifyEmail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || "";
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_EXPIRE_SECONDS);
  const [resendTimer, setResendTimer] = useState(RESEND_WAIT_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  // Start OTP timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Start resend timer
  useEffect(() => {
    if (canResend || resendTimer === 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    if (resendTimer === 1) setCanResend(true);
    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  // Request OTP on mount
  useEffect(() => {
    requestOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestOtp = async () => {
    try {
      await axios.post(`${BackendLink}/account/request-otp`, { email });
      setTimer(OTP_EXPIRE_SECONDS);
      setResendTimer(RESEND_WAIT_SECONDS);
      setCanResend(false);
      setCode(Array(CODE_LENGTH).fill(""));
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.msg || "Failed to request OTP"
      );
    }
  };

  const handleChange = (text, idx) => {
    if (!/^\d*$/.test(text)) return; // Only allow digits
    const newCode = [...code];
    newCode[idx] = text.slice(-1);
    setCode(newCode);
    if (text && idx < CODE_LENGTH - 1) {
      inputs.current[idx + 1].focus();
    }
    if (!text && idx > 0) {
      inputs.current[idx - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const otp = code.join("");
    if (otp.length < CODE_LENGTH) {
      Alert.alert("Error", "Please enter the 6-digit code.");
      return;
    }
    if (timer === 0) {
      Alert.alert("Error", "OTP has expired. Please resend code.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BackendLink}/account/verify-otp`, {
        email,
        OTP: Number(otp),
      });
      Alert.alert("Success", "Email verified! You can now log in.", [
        {
          text: "OK",
          onPress: () =>
            navigation.reset({ index: 0, routes: [{ name: "Login" }] }),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        error?.response?.data?.msg || "Invalid code"
      );
    } finally {
      setLoading(false);
    }
  };

  // Format timer
  const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
  const seconds = String(timer % 60).padStart(2, "0");

  // Format resend timer
  const resendSeconds = String(resendTimer).padStart(2, "0");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 px-6 pt-10">
          {/* Header with close button */}
          <View className="flex-row justify-end">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesomeIcon icon={faTimes} size={28} color="#222" />
            </TouchableOpacity>
          </View>
          {/* Title and instructions */}
          <Text className="text-2xl font-bold mt-8 mb-2">
            Verify your email
          </Text>
          <Text className="text-base text-gray-700 mb-8">
            Please enter the 6-digit verification code sent to your email
            address. <Text className="font-semibold">{email}*</Text>
          </Text>
          {/* Timer */}
          <View className="flex-row justify-center mb-8 space-x-6">
            <View className="bg-gray-100 rounded-xl w-28 h-16 items-center justify-center">
              <Text className="text-3xl font-bold">{minutes}</Text>
              <Text className="text-gray-500 mt-1">Minutes</Text>
            </View>
            <View className="bg-gray-100 rounded-xl w-28 h-16 items-center justify-center ml-4">
              <Text className="text-3xl font-bold">{seconds}</Text>
              <Text className="text-gray-500 mt-1">Seconds</Text>
            </View>
          </View>
          {/* Code input boxes */}
          <View className="flex-row justify-between mb-10">
            {code.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(ref) => (inputs.current[idx] = ref)}
                value={digit}
                onChangeText={(text) => handleChange(text, idx)}
                keyboardType="number-pad"
                maxLength={1}
                className="border-b-2 border-gray-300 text-2xl text-center mx-1 w-12 h-14"
                autoFocus={idx === 0}
                returnKeyType="next"
                blurOnSubmit={false}
                editable={timer > 0}
              />
            ))}
          </View>
        </View>
        {/* Submit button at the bottom */}
        <View className="absolute bottom-20 left-0 right-0 px-6">
          <TouchableOpacity
            className={`py-4 rounded-xl ${
              timer === 0 ? "bg-gray-200" : "bg-secondary-400"
            }`}
            onPress={handleSubmit}
            disabled={loading || timer === 0}
          >
            <Text
              className={`text-center text-lg font-semibold ${
                timer === 0 ? "text-gray-400" : "text-white"
              }`}
            >
              {loading ? "Verifying..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Resend code */}
        <View className="absolute bottom-8 left-0 right-0 px-6 items-center">
          {canResend ? (
            <TouchableOpacity onPress={requestOtp}>
              <Text className="text-secondary-400 font-semibold">
                Resend code
              </Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-gray-400">
              Resend code in 00:{resendSeconds}
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default VerifyEmail;
