import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackendLink } from "../../Components/Default";

const Help = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${BackendLink}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Pre-fill name and email from user profile
          setFormData((prev) => ({
            ...prev,
            name: response.data.name || "",
            email: response.data.email || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // If fetching fails, continue with empty form
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setSubmitting(true);
    try {
      // Send data to backend
      const response = await axios.post(`${BackendLink}/help/requests`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (response.status === 201) {
        Alert.alert(
          "Success",
          "Your message has been sent successfully. We'll get back to you soon!",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset only subject and message, keep name and email
                setFormData((prev) => ({
                  ...prev,
                  subject: "",
                  message: "",
                }));
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error submitting help request:", error);

      let errorMessage = "Failed to send message. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your internet connection.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading indicator while fetching user data
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-5 bg-secondary-100 relative">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faChevronLeft} size={24} color="#f5f5f5" />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 items-center">
            <Text className="text-xl font-semibold text-white">Help</Text>
          </View>
        </View>

        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#11D6CD" />
          <Text className="mt-4 text-gray-600">
            Loading your information...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-5 bg-secondary-100 relative">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faChevronLeft} size={24} color="#f5f5f5" />
        </TouchableOpacity>
        <View className="absolute left-0 right-0 items-center">
          <Text className="text-xl font-semibold text-white">Help</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="px-6 pt-6">
            {/* Help Text */}
            <Text className="text-lg text-gray-700 mb-6 text-center">
              Need assistance? Send us a message and we'll help you out!
            </Text>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-primary-300 text-base font-semibold mb-2">
                Name
              </Text>
              <TextInput
                className="bg-secondary-200 rounded-lg px-4 py-4 text-primary-300 text-lg"
                placeholder="Name"
                placeholderTextColor="#b0b8c1"
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                editable={!submitting}
              />
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-primary-300 text-base font-semibold mb-2">
                Email
              </Text>
              <TextInput
                className="bg-secondary-200 rounded-lg px-4 py-4 text-primary-300 text-lg"
                placeholder="Email"
                placeholderTextColor="#b0b8c1"
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!submitting}
              />
            </View>

            {/* Subject Input */}
            <View className="mb-4">
              <Text className="text-primary-300 text-base font-semibold mb-2">
                Subject
              </Text>
              <TextInput
                className="bg-secondary-200 rounded-lg px-4 py-4 text-primary-300 text-lg"
                placeholder="Subject"
                placeholderTextColor="#b0b8c1"
                value={formData.subject}
                onChangeText={(value) => handleInputChange("subject", value)}
                editable={!submitting}
              />
            </View>

            {/* Message Input */}
            <View className="mb-8">
              <Text className="text-primary-300 text-base font-semibold mb-2">
                Message
              </Text>
              <TextInput
                className="bg-secondary-200 rounded-lg px-4 py-4 text-primary-300 text-lg h-40"
                placeholder="Message"
                placeholderTextColor="#b0b8c1"
                value={formData.message}
                onChangeText={(value) => handleInputChange("message", value)}
                multiline
                numberOfLines={6}
                style={{ textAlignVertical: "top" }}
                editable={!submitting}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`rounded-lg py-4 ${
                submitting ? "bg-gray-400" : "bg-primary-300"
              }`}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {submitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>

            {/* Additional Help Information */}
            <View className="mt-8 p-4 bg-secondary-200 rounded-lg">
              <Text className="text-primary-300 font-semibold text-lg mb-2">
                Other Ways to Get Help:
              </Text>
              <Text className="text-primary-100 mb-2">
                • Emergency: Call 911 for immediate assistance
              </Text>
              <Text className="text-primary-100 mb-2">
                • Support: Call (555) 123-HELP
              </Text>
              <Text className="text-primary-100">
                • Email: support@healthplus.com
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Help;
