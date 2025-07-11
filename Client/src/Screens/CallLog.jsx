import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Modal,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faShieldAlt,
  faFire,
  faHeartPulse,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { BackendLink } from "../Components/Default";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const CallLog = () => {
  const navigation = useNavigation();
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch user's call logs
  const fetchCalls = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BackendLink}/emergency-call/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCalls(response.data);
    } catch (error) {
      console.error("Error fetching call logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  // Format time from timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get icon for service type
  const getServiceIcon = (service) => {
    switch (service) {
      case "Police Service":
        return faShieldAlt;
      case "Fire Service":
        return faFire;
      case "Ambulance Service":
        return faHeartPulse;
      default:
        return faShieldAlt;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#22c55e"; // green
      case "resolved":
        return "#22c55e"; // green
      case "pending":
        return "#eab308"; // yellow
      default:
        return "#9ca3af"; // gray
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "resolved":
        return "Resolved";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  // Update call status
  const updateCallStatus = async (callId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${BackendLink}/emergency-call/${callId}/status/user`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the call in local state
      setCalls((prevCalls) =>
        prevCalls.map((call) =>
          call._id === callId ? { ...call, statusByUser: newStatus } : call
        )
      );

      Alert.alert("Success", "Call status updated successfully");
    } catch (error) {
      console.error("Error updating call status:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.msg || "Failed to update call status"
      );
    } finally {
      setUpdatingStatus(false);
      setModalVisible(false);
    }
  };

  const displayCalls = calls.length > 0 ? calls : [];

  if (loading && calls.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-gray-500">Loading call logs...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3">
        <Text className="text-xl font-bold flex-1 text-center">Call Log</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchCalls} />
        }
      >
        <View className="px-4">
          {displayCalls.length === 0 ? (
            <Text className="text-center text-gray-500 py-6">
              No emergency calls found
            </Text>
          ) : (
            displayCalls.map((call) => (
              <TouchableOpacity
                key={call._id}
                className="flex-row items-center py-5 border-b border-gray-100"
                onPress={() => {
                  setSelectedCall(call);
                  setModalVisible(true);
                }}
              >
                <View className="bg-gray-100 rounded-lg p-4 mr-3">
                  <FontAwesomeIcon
                    icon={getServiceIcon(call.service)}
                    size={24}
                    color="#000"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-medium">
                    {call.service?.replace(" Service", "")}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-sm text-gray-500">
                      {formatTime(call.timestamp)}
                    </Text>
                    <Text className="text-sm text-gray-500 mx-1">•</Text>
                    <Text className="text-sm text-gray-500 flex-1 line-clamp-1">
                      {call.location?.address}
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: getStatusColor(call.statusByUser),
                      marginBottom: 4,
                    }}
                  />
                  <Text className="text-xs text-gray-500">
                    {getStatusLabel(call.statusByUser)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Status Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-10">
            <Text className="text-xl font-bold mb-4 text-center">
              Update Call Status
            </Text>
            <Text className="text-center mb-6 text-gray-600">
              {selectedCall?.service} • {formatTime(selectedCall?.timestamp)}
            </Text>

            <View className="space-y-3">
              {["pending", "active", "resolved"].map((status) => (
                <TouchableOpacity
                  key={status}
                  className={`p-4 rounded-xl flex-row justify-between items-center ${
                    selectedCall?.statusByUser === status
                      ? "bg-secondary-200"
                      : "bg-gray-100"
                  }`}
                  onPress={() => updateCallStatus(selectedCall?._id, status)}
                  disabled={updatingStatus}
                >
                  <Text
                    className={`text-lg ${
                      selectedCall?.statusByUser === status
                        ? "font-bold text-primary-300"
                        : "font-medium"
                    }`}
                  >
                    {getStatusLabel(status)}
                  </Text>
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: getStatusColor(status),
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              className="mt-6 p-4 bg-gray-200 rounded-xl"
              onPress={() => setModalVisible(false)}
              disabled={updatingStatus}
            >
              <Text className="text-center font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CallLog;
