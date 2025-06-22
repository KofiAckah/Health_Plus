import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faCamera,
  faUser,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BackendLink, Logo } from "../../Components/Default";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const EditProfile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${BackendLink}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        // Initialize tempDate with user's date of birth if available
        if (response.data.dateOfBirth) {
          setTempDate(new Date(response.data.dateOfBirth));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = () => {
    if (!userData) return;

    const updateProfile = async () => {
      setUpdating(true);
      try {
        const token = await AsyncStorage.getItem("token");
        await axios.put(`${BackendLink}/profile`, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Alert.alert("Success", "Profile updated!");
      } catch (error) {
        Alert.alert("Error", "Failed to update profile.");
        console.error("Error updating profile:", error);
      } finally {
        setUpdating(false);
      }
    };

    updateProfile();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTempDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setUserData({ ...userData, dateOfBirth: formattedDate });
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Select your date of birth";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!userData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#11D6CD" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-5 bg-secondary-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faChevronLeft} size={24} color="#f5f5f5" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-white">Edit Profile</Text>
        <TouchableOpacity onPress={handleUpdateProfile} disabled={updating}>
          <Text className="text-primary-200 font-bold text-lg">
            {updating ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Profile Image */}
          <View className="items-center mt-6 mb-2 relative">
            <View className="w-40 h-40 rounded-full border-4 border-secondary-100 bg-secondary-200 overflow-hidden items-center justify-center relative">
              {userData.profilePicture ? (
                <Image
                  source={
                    userData.profilePicture
                      ? { uri: userData.profilePicture }
                      : Logo
                  }
                  className="w-40 h-40"
                  resizeMode="cover"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} size={80} color="#b0b8c1" />
              )}
            </View>
            <TouchableOpacity
              className="absolute bottom-2 left-[62%] bg-primary-200 p-2 rounded-full z-10"
              onPress={() => Alert.alert("Profile picture change coming soon!")}
            >
              <FontAwesomeIcon icon={faCamera} size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="px-6 mt-2">
            <Text className="text-primary-100 text-base font-semibold mt-2 mb-1">
              Name
            </Text>
            <TextInput
              className="bg-secondary-200 rounded-lg px-4 py-3 mb-3 text-primary-300 "
              value={userData.name || ""}
              onChangeText={(v) => setUserData({ ...userData, name: v })}
              placeholder="Enter your name"
              placeholderTextColor="#b0b8c1"
            />

            <View>
              <Text className="text-primary-100 text-base font-semibold mb-1">
                Email
              </Text>
              <TextInput
                className="bg-secondary-200 rounded-lg px-4 py-3 mb-3 text-primary-300"
                value={userData.email || ""}
                editable={false}
                placeholder="Email"
                placeholderTextColor="#b0b8c1"
              />
              <View className="absolute right-4 top-11">
                <FontAwesomeIcon icon={faBan} size={17} color="#FF4D4D" />
              </View>
            </View>

            <Text className="text-primary-100 text-base font-semibold mb-1">
              Phone
            </Text>
            <TextInput
              className="bg-secondary-200 rounded-lg px-4 py-3 mb-3 text-primary-300"
              value={userData.phone || ""}
              onChangeText={(v) => setUserData({ ...userData, phone: v })}
              placeholder="Enter your phone"
              placeholderTextColor="#b0b8c1"
              keyboardType="phone-pad"
            />

            <Text className="text-primary-100 text-base font-semibold mb-1">
              Bio
            </Text>
            <TextInput
              className="bg-secondary-200 rounded-lg px-4 py-3 mb-3 text-primary-300"
              value={userData.bio || ""}
              onChangeText={(v) => setUserData({ ...userData, bio: v })}
              placeholder="Tell us about yourself"
              placeholderTextColor="#b0b8c1"
              multiline
              numberOfLines={3}
            />

            <Text className="text-primary-100 text-base font-semibold mb-1">
              Location
            </Text>
            <TextInput
              className="bg-secondary-200 rounded-lg px-4 py-3 mb-3 text-primary-300"
              value={userData.location || ""}
              onChangeText={(v) => setUserData({ ...userData, location: v })}
              placeholder="Enter your location"
              placeholderTextColor="#b0b8c1"
            />

            <Text className="text-primary-100 text-base font-semibold mb-1">
              Hometown
            </Text>
            <TextInput
              className="bg-secondary-200 rounded-lg px-4 py-3 mb-3 text-primary-300"
              value={userData.hometown || ""}
              onChangeText={(v) => setUserData({ ...userData, hometown: v })}
              placeholder="Enter your hometown"
              placeholderTextColor="#b0b8c1"
            />

            <Text className="text-primary-100 text-base font-semibold mb-1">
              Date of Birth
            </Text>
            <TouchableOpacity
              className="bg-secondary-200 rounded-lg px-4 py-3 mb-3"
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                className={`${
                  userData?.dateOfBirth
                    ? "text-primary-300"
                    : "text-secondary-100"
                }`}
              >
                {formatDisplayDate(userData?.dateOfBirth)}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            )}

            <Text className="text-primary-100 text-base font-semibold mb-1">
              Occupation
            </Text>
            <TextInput
              className="bg-secondary-200 rounded-lg px-4 py-3 mb-3 text-primary-300"
              value={userData.occupation || ""}
              onChangeText={(v) => setUserData({ ...userData, occupation: v })}
              placeholder="Enter your occupation"
              placeholderTextColor="#b0b8c1"
            />

            <Text className="text-primary-100 text-base font-semibold mb-1">
              Blood Group
            </Text>
            <View className="bg-secondary-200 rounded-lg mb-3">
              <Picker
                selectedValue={userData.bloodGroup || "Unknown"}
                onValueChange={(itemValue) =>
                  setUserData({ ...userData, bloodGroup: itemValue })
                }
                style={{
                  color: userData.bloodGroup ? "#1e293b" : "#b0b8c1",
                }}
              >
                <Picker.Item
                  label="Select your blood group"
                  value=""
                  color="#b0b8c1"
                />
                <Picker.Item label="A+" value="A+" />
                <Picker.Item label="A-" value="A-" />
                <Picker.Item label="B+" value="B+" />
                <Picker.Item label="B-" value="B-" />
                <Picker.Item label="AB+" value="AB+" />
                <Picker.Item label="AB-" value="AB-" />
                <Picker.Item label="O+" value="O+" />
                <Picker.Item label="O-" value="O-" />
                <Picker.Item label="Unknown" value="Unknown" />
              </Picker>
            </View>

            <Text className="text-primary-100 text-base font-semibold mb-1">
              Gender
            </Text>
            <View className="bg-secondary-200 rounded-lg mb-3">
              <Picker
                selectedValue={userData.gender || ""}
                onValueChange={(itemValue) =>
                  setUserData({ ...userData, gender: itemValue })
                }
                style={{
                  color: userData.gender ? "#1e293b" : "#b0b8c1",
                }}
              >
                <Picker.Item
                  label="Select your gender"
                  value=""
                  color="#b0b8c1"
                  disabled={true}
                />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item
                  label="Prefer not to say"
                  value="Prefer not to say"
                />
              </Picker>
            </View>
          </View>
          <View className="h-10" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;
