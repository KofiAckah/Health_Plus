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
import { useState, useRef, useEffect } from "react";
// Use the main package import, not the /web path
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import ConfigService from "../Services/ConfigService";

const BOT_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";

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
  const [ai, setAi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef();

  // Initialize Gemini AI with API key from backend
  useEffect(() => {
    const initializeAI = async () => {
      try {
        const apiKey = await ConfigService.getGeminiApiKey();
        console.log("Received API key:", apiKey ? "Yes" : "No"); // Debug log

        if (apiKey) {
          // Use GoogleGenerativeAI constructor
          const geminiAI = new GoogleGenerativeAI(apiKey);
          setAi(geminiAI);
          console.log("AI initialized successfully"); // Debug log
        } else {
          console.error("No Gemini API key available");
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: "Sorry, AI service is currently unavailable. Please check your configuration.",
              sender: "bot",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to initialize AI:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: "Sorry, there was an error initializing the AI service.",
            sender: "bot",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAI();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !ai) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: text || "Sorry, I couldn't get a response.",
          sender: "bot",
        },
      ]);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "Sorry, something went wrong. Please try again.",
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

  // Show loading screen while initializing AI
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing AI service...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.mainContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI Chat</Text>
          </View>

          {/* Chat messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            style={styles.chatList}
            contentContainerStyle={styles.chatContent}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {/* Input box */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                value={input}
                onChangeText={setInput}
                editable={!sending && !!ai}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                multiline={false}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={sending || !input.trim() || !ai}
                style={[
                  styles.sendButton,
                  {
                    opacity: sending || !input.trim() || !ai ? 0.5 : 1,
                  },
                ]}
              >
                <Text style={styles.sendButtonText}>
                  {sending ? "Sending..." : "Send"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardView: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
  header: {
    paddingVertical: 24,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  chatList: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
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
  inputContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: "#ffffff",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#379eff",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default GeminiChat;
