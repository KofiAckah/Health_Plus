import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const IssueDetails = ({ route, navigation }) => {
  const { issue } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="p-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: "#0071BD", marginBottom: 10 }}>
              {"< Back"}
            </Text>
          </TouchableOpacity>
          <Image
            source={{ uri: issue.issuePicture }}
            className="w-full h-64 rounded-2xl mb-4"
            style={{ resizeMode: "cover" }}
          />
          <View className="flex-row items-center mb-4">
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
            <View>
              <Text className="text-lg font-semibold">
                {issue.createdBy?.name || "Unknown User"}
              </Text>
              <Text className="text-primary-100 text-sm">
                {new Date(issue.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-bold mb-2">{issue.title}</Text>
          <Text className="text-base text-primary-300 mb-4">
            {issue.description}
          </Text>
          <Text
            className="px-3 py-1 rounded-lg self-start mb-4"
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
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            {issue.status}
          </Text>
          {/* You can add reactions, comments, etc. here if needed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IssueDetails;
