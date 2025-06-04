import { useState, useEffect, useCallback } from "react";
import { BackendLink } from "../../Components/Default";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  FlatList,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import AddComment from "../../Components/AddComment";
import ReactToIssue from "../../Components/ReactToIssue";
import ImageViewer from "../../Components/ImageViewer";

const IssueDetails = ({ route, navigation }) => {
  const { issueId } = route.params;
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
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
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        setUserId(payload.id);
      }
    };
    getUserId();
  }, []);

  const fetchIssueDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${BackendLink}/issue/${issueId}`);
      setIssue(response.data);
    } catch (error) {
      console.error("Error fetching issue details:", error);
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    fetchIssueDetails();
  }, [fetchIssueDetails]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchIssueDetails();
    setRefreshing(false);
  }, [fetchIssueDetails]);

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setViewerVisible(true);
  };
  const handleViewerClose = () => {
    setViewerVisible(false);
    setSelectedImage(null);
  };
  const formatDate = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (loading || !issue) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View className="flex-row items-center p-4 relative">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faChevronLeft} size={22} color="#222" />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 items-center">
            <Text className="font-bold text-2xl">News Feed</Text>
          </View>
        </View>

        {/* User Info */}
        <View className="flex-row items-center px-4 mb-2">
          {issue.createdBy?.profilePicture ? (
            <Image
              source={{ uri: issue.createdBy.profilePicture }}
              className="w-12 h-12 rounded-full mr-3"
            />
          ) : (
            <View className="w-12 h-12 rounded-full bg-gray-100 mr-3 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} size={26} color="#4a4a4a" />
            </View>
          )}
          <View>
            <Text className="font-bold text-lg">
              {issue.createdBy?.name || "Unknown User"}
            </Text>
            <Text className="text-primary-100 text-sm">
              {formatDate(issue.createdAt)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text className="font-bold text-2xl px-4 mt-2">{issue.title}</Text>

        {/* Description */}
        <Text className=" text-gray-700 px-4 mt-2">{issue.description}</Text>

        {/* Image */}
        {issue.issuePicture && (
          <TouchableOpacity
            onPress={() => handleImagePress(issue.issuePicture)}
            className="mt-4 items-center"
          >
            <Image
              source={{ uri: issue.issuePicture }}
              className="w-full h-64"
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {/* Reaction Section */}
        <ReactToIssue
          issue={issue}
          userId={userId}
          onReacted={fetchIssueDetails}
        />

        {/* Comments Count */}
        <View className="flex-row items-center px-4 mt-4">
          <Text className="text-primary-100 font-bold">
            Comments {issue.comments?.length || 0}
          </Text>
        </View>

        {/* Comments List */}
        <View className="px-4 mt-2">
          {issue.comments && issue.comments.length > 0 ? (
            <FlatList
              data={issue.comments.slice().reverse()} // newest first
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                <View className="flex-row mb-4 items-center">
                  {item.user?.profilePicture ? (
                    <Image
                      source={{ uri: item.user.profilePicture }}
                      className="w-9 h-9 rounded-full mr-3"
                    />
                  ) : (
                    <View className="w-9 h-9 rounded-full bg-gray-100 mr-3 flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faUser}
                        size={18}
                        color="#4a4a4a"
                      />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="font-bold ">
                      {item.user?.name || "User"}
                      <Text className="text-primary-100 ml-1 font-normal text-sm">
                        {"  "}
                        {item.createdAt ? formatDate(item.createdAt) : ""}
                      </Text>
                    </Text>
                    <Text className="text-gray-700">{item.text}</Text>
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          ) : (
            <Text className="text-gray-500 text-center mt-2">
              Be the first to comment!
            </Text>
          )}
        </View>

        {/* Add Comment */}
        <View className="px-4 mt-4 mb-6">
          <AddComment issueId={issue._id} onCommentAdded={fetchIssueDetails} />
        </View>

        {/* Image Viewer Modal */}
        <ImageViewer
          visible={viewerVisible}
          imageUrl={selectedImage}
          onClose={handleViewerClose}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default IssueDetails;
