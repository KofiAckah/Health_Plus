import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { BackendLink } from "../Components/Default";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faHeart as faHeartSolid,
  faThumbsUp as faThumbsUpSolid,
  faFaceSmile as faFaceSmileSolid,
  faFaceFrownOpen as faFaceFrownOpenSolid,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart,
  faThumbsUp,
  faFaceSmile,
  faFaceFrownOpen,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Social = () => {
  const [issues, setIssues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({}); // { [issueId]: commentText }

  // Get userId from token (assuming you store userId in AsyncStorage)
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

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${BackendLink}/issue/`);
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchIssueData = async () => {
      try {
        const response = await axios.get(`${BackendLink}/issue/`);
        setIssues(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching issues data:", error);
        setLoading(false);
      }
    };

    fetchIssueData();
  }, []);

  const handleReaction = async (issueId, reactionType) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${BackendLink}/issue/${issueId}/react`,
        { reaction: reactionType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refetch all issues so you get the populated createdBy
      const response = await axios.get(`${BackendLink}/issue/`);
      setIssues(response.data);
    } catch (error) {
      console.error("Error reacting to issue:", error);
    }
  };

  const handleAddComment = async (issueId) => {
    const commentText = commentInputs[issueId];
    if (!commentText || !commentText.trim()) return;
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${BackendLink}/issue/${issueId}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refetch all issues to get updated comments
      const response = await axios.get(`${BackendLink}/issue/`);
      setIssues(response.data);
      setCommentInputs((prev) => ({ ...prev, [issueId]: "" }));
      Alert.alert("Success", "Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className=""
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-20">
          <View className="flex-row items-center justify-center mt-2 px-2">
            <Text className="text-2xl font-bold mx-auto">Feed</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Create Issue", "Feature coming soon!")
              }
              className="ml-4 p-2 bg-primary-100 rounded-lg"
            >
              <FontAwesomeIcon icon={faSquarePlus} size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            issues &&
            issues.map((issue) => {
              // Find the user's reaction for this issue
              const userReaction = issue.reactedUsers?.find(
                (ru) => ru.user === userId || ru.user?._id === userId
              )?.reaction;

              return (
                <View key={issue._id} className="mb-2">
                  <View className="p-4">
                    <View>
                      <View className="flex-row mb-2">
                        {issue.createdBy.profilePicture ? (
                          <Image
                            source={{ uri: issue.createdBy.profilePicture }}
                            className="w-12 h-12 rounded-full mr-2"
                          />
                        ) : (
                          <View className="w-12 h-12 rounded-full mr-2 border border-primary-100 flex items-center justify-center">
                            <FontAwesomeIcon
                              icon={faUser}
                              size={26}
                              color="#4a4a4a"
                            />
                          </View>
                        )}
                        <View className="flex flex-col justify-center">
                          <Text className="text-lg font-semibold">
                            {issue.createdBy
                              ? issue.createdBy.name
                              : "Unknown User"}
                          </Text>
                          <Text className="text-primary-100 text-sm">
                            {new Date(issue.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text className="text-lg font-semibold">{issue.title}</Text>
                    <Text className="text-primary-300 mt-1">
                      {issue.description}
                    </Text>
                  </View>
                  <View>
                    <Text
                      className="absolute right-1 px-2 py-1 rounded-b-lg z-10 "
                      style={{
                        backgroundColor:
                          issue.status === "Open"
                            ? "#ef4444" // red-500
                            : issue.status === "In Progress"
                            ? "#facc15" // yellow-400
                            : issue.status === "Resolved"
                            ? "#3b82f6" // blue-500
                            : issue.status === "Closed"
                            ? "#22c55e" // green-500
                            : "#e5e7eb", // gray-200 fallback
                        color:
                          issue.status === "In Progress"
                            ? "#92400e" // dark text for yellow
                            : "#fff", // white text for red/green
                      }}
                    >
                      {issue.status}
                    </Text>
                  </View>
                  <Image
                    source={{ uri: issue.issuePicture }}
                    className="w-full h-64 object-cover"
                  />
                  {/* Reaction Section */}
                  <View className="flex-row justify-between items-center px-4 pt-2 mx-4">
                    <TouchableOpacity
                      onPress={() => handleReaction(issue._id, "likes")}
                      className="p-2"
                    >
                      <View className="flex-row items-center">
                        <FontAwesomeIcon
                          icon={
                            userReaction === "likes"
                              ? faThumbsUpSolid
                              : faThumbsUp
                          }
                          size={20}
                          color="#49739c"
                        />
                        <Text className="ml-2 text-primary-100">
                          {issue.reactions.likes}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleReaction(issue._id, "loves")}
                      className="p-2"
                    >
                      <View className="flex-row items-center">
                        <FontAwesomeIcon
                          icon={
                            userReaction === "loves" ? faHeartSolid : faHeart
                          }
                          size={20}
                          color="#49739c"
                        />
                        <Text className="ml-2 text-primary-100">
                          {issue.reactions.loves}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleReaction(issue._id, "joys")}
                      className="p-2"
                    >
                      <View className="flex-row items-center">
                        <FontAwesomeIcon
                          icon={
                            userReaction === "joys"
                              ? faFaceSmileSolid
                              : faFaceSmile
                          }
                          size={20}
                          color="#49739c"
                        />
                        <Text className="ml-2 text-primary-100">
                          {issue.reactions.joys}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleReaction(issue._id, "sads")}
                      className="p-2 "
                    >
                      <View className="flex-row items-center">
                        <FontAwesomeIcon
                          icon={
                            userReaction === "sads"
                              ? faFaceFrownOpenSolid
                              : faFaceFrownOpen
                          }
                          size={20}
                          color="#49739c"
                        />
                        <Text className="ml-2 text-primary-100">
                          {issue.reactions.sads}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Comments Section */}
                  <View style={{ paddingHorizontal: 16 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <TextInput
                        placeholder="Add a comment..."
                        value={commentInputs[issue._id] || ""}
                        onChangeText={(text) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [issue._id]: text,
                          }))
                        }
                        className="flex-1 bg-secondary-200 rounded-lg pl-3 p-2 mr-2 placeholder:text-primary-100"
                      />
                      <TouchableOpacity
                        onPress={() => handleAddComment(issue._id)}
                        className="bg-primary-100 p-2 px-4 rounded-lg"
                        disabled={
                          !commentInputs[issue._id] ||
                          !commentInputs[issue._id].trim()
                        }
                      >
                        <FontAwesomeIcon
                          icon={faPaperPlane}
                          size={20}
                          color="#fff"
                          style={{
                            marginHorizontal: "auto",
                            marginVertical: "auto",
                            opacity:
                              !commentInputs[issue._id] ||
                              !commentInputs[issue._id].trim()
                                ? 0.5
                                : 1,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0071BD"
        translucent={false}
      />
    </SafeAreaView>
  );
};

export default Social;
