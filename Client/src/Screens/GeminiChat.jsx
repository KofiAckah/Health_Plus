import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
  StyleSheet,
} from "react-native";
import { useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const ai = new GoogleGenAI({
  apiKey: "YOUR_API_KEY_HERE", // Replace with your actual API key
});

const BOT_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"; // Example bot avatar

const GeminiChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I assist you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef();

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = {
      id: Date.now(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: input,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: response.text || "Sorry, I couldn't get a response.",
          sender: "bot",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "Sorry, something went wrong.",
          sender: "bot",
        },
      ]);
    } finally {
      setSending(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }) => {
    if (item.sender === "bot") {
      return (
        <View style={styles.botRow}>
          <Image
            source={{ uri: BOT_AVATAR }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.botBubble}>
            <Text style={styles.botText}>{item.text}</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{item.text}</Text>
        </View>
        <View style={styles.userAvatar}>
          <FontAwesomeIcon icon={faUser} size={32} color="#222" />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="flex-1">
          {/* Header */}
          <View className="py-6">
            <Text className="text-center text-2xl font-bold">Chat</Text>
          </View>
          {/* Chat messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
          {/* Input box */}
          <View className="px-4 pb-6 pt-2 bg-white">
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#f3f4f6",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <TextInput
                className="flex-1 text-base"
                style={{ minHeight: 40 }}
                placeholder="Type a message..."
                value={input}
                onChangeText={setInput}
                editable={!sending}
                onSubmitEditing={handleSend}
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={sending || !input.trim()}
                style={{
                  marginLeft: 8,
                  backgroundColor: "#379eff",
                  borderRadius: 12,
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  opacity: sending || !input.trim() ? 0.5 : 1,
                }}
              >
                <Text className="text-white font-semibold text-base">Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  botRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 18,
  },
  botBubble: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 12,
    marginLeft: 8,
    maxWidth: "75%",
  },
  botText: {
    color: "#222",
    fontSize: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e5e7eb",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 18,
  },
  userBubble: {
    backgroundColor: "#379eff",
    borderRadius: 16,
    padding: 12,
    maxWidth: "75%",
  },
  userText: {
    color: "#fff",
    fontSize: 16,
  },
  userAvatar: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export default GeminiChat;
