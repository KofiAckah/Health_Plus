import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faShieldAlt,
  faFire,
  faHeartPulse,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { BackendLink } from "../Components/Default";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";

const CallLog = () => {
  const navigation = useNavigation();
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      setRefreshing(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchCalls();
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  // Format time from timestamp using date-fns
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    // Format as "25/06/25 11:30am"
    return format(date, "MM/dd/yy h:mma").toLowerCase();
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
        return "#eab308"; // yellow
      case "resolved":
        return "#22c55e"; // green
      case "pending":
        return "#ef4444"; // red
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

  // Render each emergency call item
  const renderCallItem = ({ item: call }) => (
    <View
      key={call._id}
      className="flex-row items-center py-5 border-b border-gray-100"
    >
      <View className="bg-gray-100 rounded-lg p-4 mr-3">
        <FontAwesomeIcon
          icon={getServiceIcon(call.service)}
          size={24}
          color="#000"
        />
      </View>

      <View className="flex-1">
        <Text className="text-lg font-semibold">
          {call.service?.replace(" Service", "")}
        </Text>
        <View className="flex-row items-center mr-2">
          <Text className="text-xs text-gray-500">
            {formatTime(call.timestamp)}
          </Text>
          <Text className="text-xs text-gray-500 mx-1 ml-2">•</Text>
          <Text className="text-xs text-gray-500 flex-1 line-clamp-1">
            {call.location?.address}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="items-end"
        onPress={() => {
          setSelectedCall(call);
          setModalVisible(true);
        }}
      >
        <Text
          className="w-16 p-1 rounded-lg text-center text-white"
          style={{
            backgroundColor: getStatusColor(call.statusByUser),
          }}
        >
          {getStatusLabel(call.statusByUser)}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Empty list component
  const EmptyListComponent = () => (
    <Text className="text-center text-gray-500 py-6">
      No emergency calls found
    </Text>
  );

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

      <FlatList
        data={displayCalls}
        renderItem={renderCallItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 64 }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={EmptyListComponent}
        showsVerticalScrollIndicator={false}
      />

      {/* Status Change Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/65">
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
                  className={`p-4 rounded-xl flex-row justify-between items-center mb-4 ${
                    selectedCall?.statusByUser === status
                      ? "bg-primary-200"
                      : "bg-secondary-200"
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
