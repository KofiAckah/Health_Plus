import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChartBar,
  faMessage,
  faRobot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import ChatStorage from "../Services/ChatStorage";

const ChatStats = ({ visible = false, onClose }) => {
  const [stats, setStats] = useState({
    totalMessages: 0,
    userMessages: 0,
    botMessages: 0,
    lastMessageDate: null,
  });

  useEffect(() => {
    if (visible) {
      loadStats();
    }
  }, [visible]);

  const loadStats = async () => {
    try {
      const chatStats = await ChatStorage.getChatStats();
      setStats(chatStats);
    } catch (error) {
      console.error("Error loading chat stats:", error);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <FontAwesomeIcon icon={faChartBar} size={24} color="#007AFF" />
          <Text style={styles.title}>Chat Statistics</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesomeIcon icon={faMessage} size={20} color="#666" />
            <Text style={styles.statLabel}>Total Messages</Text>
            <Text style={styles.statValue}>{stats.totalMessages}</Text>
          </View>

          <View style={styles.statItem}>
            <FontAwesomeIcon icon={faUser} size={20} color="#007AFF" />
            <Text style={styles.statLabel}>Your Messages</Text>
            <Text style={styles.statValue}>{stats.userMessages}</Text>
          </View>

          <View style={styles.statItem}>
            <FontAwesomeIcon icon={faRobot} size={20} color="#ff6b6b" />
            <Text style={styles.statLabel}>AI Messages</Text>
            <Text style={styles.statValue}>{stats.botMessages}</Text>
          </View>

          {stats.lastMessageDate && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Last Message</Text>
              <Text style={styles.statValue}>
                {stats.lastMessageDate.toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 300,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#333",
  },
  statsContainer: {
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statLabel: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChatStats;
