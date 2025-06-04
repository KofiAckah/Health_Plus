import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { BackendLink } from "../Components/Default";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ImageViewer from "../Components/ImageViewer";
import AddComment from "../Components/AddComment";
import ReactToIssue from "../Components/ReactToIssue";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const Social = () => {
  const navigation = useNavigation();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Decode JWT to get userId
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        setUserId(payload.id);
      }
    };
    getUserId();
  }, []);

  const fetchIssues = useCallback(async () => {
    try {
      const response = await axios.get(`${BackendLink}/issue/`);
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchIssues();
  }, [fetchIssues]);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchIssues();
  };

  const renderItem = ({ item: issue }) => {
    const userReaction = issue.reactedUsers?.find(
      (ru) => ru.user === userId || ru.user?._id === userId
    )?.reaction;

    return (
      <View key={issue._id} className="mb-2 bg-gray-50 pb-2">
        <TouchableOpacity
          className="p-4"
          onPress={() =>
            navigation.navigate("IssueDetails", { issueId: issue._id })
          }
          activeOpacity={0.9}
        >
          <View>
            <View className="flex-row mb-2">
              {issue.createdBy.profilePicture ? (
                <Image
                  source={{ uri: issue.createdBy.profilePicture }}
                  className="w-12 h-12 rounded-full mr-2"
                />
              ) : (
                <View className="w-12 h-12 rounded-full mr-2 border border-primary-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} size={26} color="#4a4a4a" />
                </View>
              )}
              <View className="flex flex-col justify-center">
                <Text className="text-lg font-semibold ">
                  {issue.createdBy ? issue.createdBy.name : "Unknown User"}
                </Text>
                <Text className="text-primary-100 text-sm">
                  {formatDistanceToNow(new Date(issue.createdAt), {
                    addsuffix: true,
                  })}
                </Text>
              </View>
            </View>
          </View>
          <Text className="text-lg font-semibold">{issue.title}</Text>
          <Text className="text-primary-300 mt-1 line-clamp-3">
            {issue.description}
          </Text>
        </TouchableOpacity>
        <View>
          <Text
            className="absolute right-1 px-2 py-1 rounded-b-lg z-10 "
            style={{
              backgroundColor:
                issue.status === "Open"
                  ? "#ef4444"
                  : issue.status === "In Progress"
                  ? "#facc15"
                  : issue.status === "Resolved"
                  ? "#3b82f6"
                  : issue.status === "Closed"
                  ? "#22c55e"
                  : "#e5e7eb",
              color: issue.status === "In Progress" ? "#92400e" : "#fff",
            }}
          >
            {issue.status}
          </Text>
        </View>
        <Image
          source={{ uri: issue.issuePicture }}
          className="w-full h-64 object-cover"
          onTouchEnd={() => {
            setSelectedImage(issue.issuePicture);
            setViewerVisible(true);
          }}
        />
        {/* Reaction Section */}
        <ReactToIssue issue={issue} userId={userId} onReacted={fetchIssues} />
        {/* Comments Section */}
        <View className="px-4">
          <AddComment issueId={issue._id} onCommentAdded={fetchIssues} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mb-20">
        <View className="flex-row items-center justify-center mt-2 mb-2 px-2">
          <Text className="text-2xl font-bold mx-auto">Feed</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("PostIssue")}
            className="ml-4 p-2 bg-primary-100 rounded-lg"
          >
            <FontAwesomeIcon icon={faSquarePlus} size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={issues}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={
            loading ? (
              <Text className="text-center mt-8">Loading...</Text>
            ) : (
              <Text className="text-center mt-8">No issues found.</Text>
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#49739c"]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
      <ImageViewer
        visible={viewerVisible}
        imageUrl={selectedImage}
        onClose={() => setViewerVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Social;
