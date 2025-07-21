import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAT_STORAGE_KEY = "@health_plus_chat_history";

class ChatStorage {
  // Save chat messages to local storage
  async saveChatHistory(messages) {
    try {
      const jsonMessages = JSON.stringify(messages);
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, jsonMessages);
      console.log("Chat history saved successfully");
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  }

  // Load chat messages from local storage
  async loadChatHistory() {
    try {
      const jsonMessages = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (jsonMessages !== null) {
        const messages = JSON.parse(jsonMessages);
        console.log("Chat history loaded successfully");
        return messages;
      }
      return null;
    } catch (error) {
      console.error("Error loading chat history:", error);
      return null;
    }
  }

  // Clear chat history from local storage
  async clearChatHistory() {
    try {
      await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
      console.log("Chat history cleared successfully");
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  }

  // Add a single message to existing chat history
  async addMessageToHistory(newMessage) {
    try {
      const existingMessages = (await this.loadChatHistory()) || [];
      const updatedMessages = [...existingMessages, newMessage];
      await this.saveChatHistory(updatedMessages);
      return updatedMessages;
    } catch (error) {
      console.error("Error adding message to history:", error);
      return null;
    }
  }

  // Get chat statistics
  async getChatStats() {
    try {
      const messages = await this.loadChatHistory();
      if (!messages)
        return { totalMessages: 0, userMessages: 0, botMessages: 0 };

      const userMessages = messages.filter(
        (msg) => msg.sender === "user"
      ).length;
      const botMessages = messages.filter((msg) => msg.sender === "bot").length;

      return {
        totalMessages: messages.length,
        userMessages,
        botMessages,
        lastMessageDate:
          messages.length > 0
            ? new Date(messages[messages.length - 1].timestamp || Date.now())
            : null,
      };
    } catch (error) {
      console.error("Error getting chat stats:", error);
      return { totalMessages: 0, userMessages: 0, botMessages: 0 };
    }
  }
}

// Export singleton instance
export default new ChatStorage();
