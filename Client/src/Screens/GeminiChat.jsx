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
  Alert,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";
import ConfigService from "../Services/ConfigService";
import ChatStorage from "../Services/ChatStorage";
import Markdown from "react-native-markdown-display";

const BOT_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [ai, setAi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const flatListRef = useRef();

  // Load chat history on component mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setLoadingHistory(true);
        const savedMessages = await ChatStorage.loadChatHistory();

        if (savedMessages && savedMessages.length > 0) {
          setMessages(savedMessages);
          console.log(`Loaded ${savedMessages.length} messages from history`);
        } else {
          // Set default welcome message if no history exists
          const welcomeMessage = {
            id: 1,
            text: "Hello! How can I assist you today?",
            sender: "bot",
            isMarkdown: false,
            timestamp: Date.now(),
          };
          setMessages([welcomeMessage]);
          await ChatStorage.saveChatHistory([welcomeMessage]);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
        // Fallback to default message
        setMessages([
          {
            id: 1,
            text: "Hello! How can I assist you today?",
            sender: "bot",
            isMarkdown: false,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, []);

  // Initialize Gemini AI with API key from backend
  useEffect(() => {
    const initializeAI = async () => {
      try {
        const apiKey = await ConfigService.getGeminiApiKey();

        if (apiKey) {
          const geminiAI = new GoogleGenerativeAI(apiKey);
          setAi(geminiAI);
          console.log("AI initialized successfully");
        } else {
          console.error("No Gemini API key available");
          const errorMessage = {
            id: Date.now(),
            text: "Sorry, AI service is currently unavailable. Please check your configuration.",
            sender: "bot",
            timestamp: Date.now(),
          };

          setMessages((prev) => {
            const newMessages = [...prev, errorMessage];
            ChatStorage.saveChatHistory(newMessages);
            return newMessages;
          });
        }
      } catch (error) {
        console.error("Failed to initialize AI:", error);
        const errorMessage = {
          id: Date.now(),
          text: "Sorry, there was an error initializing the AI service.",
          sender: "bot",
          timestamp: Date.now(),
        };

        setMessages((prev) => {
          const newMessages = [...prev, errorMessage];
          ChatStorage.saveChatHistory(newMessages);
          return newMessages;
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only initialize AI after chat history is loaded
    if (!loadingHistory) {
      initializeAI();
    }
  }, [loadingHistory]);

  // Save messages to storage whenever messages state changes
  useEffect(() => {
    if (messages.length > 0 && !loadingHistory) {
      ChatStorage.saveChatHistory(messages);
    }
  }, [messages, loadingHistory]);

  const handleSend = async () => {
    if (!input.trim() || !ai) return;

    const userMsg = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      const botMsg = {
        id: Date.now() + 1,
        text: text || "Sorry, I couldn't get a response.",
        sender: "bot",
        isMarkdown: true,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Gemini API Error:", err);
      const errorMsg = {
        id: Date.now() + 2,
        text: "Sorry, something went wrong. Please try again.",
        sender: "bot",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to clear all chat history? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await ChatStorage.clearChatHistory();
              const welcomeMessage = {
                id: Date.now(),
                text: "Hello! How can I assist you today?",
                sender: "bot",
                isMarkdown: false,
                timestamp: Date.now(),
              };
              setMessages([welcomeMessage]);
              Alert.alert("Success", "Chat history cleared successfully");
            } catch (error) {
              console.error("Error clearing chat history:", error);
              Alert.alert("Error", "Failed to clear chat history");
            }
          },
        },
      ]
    );
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
            {item.isMarkdown ? (
              <Markdown style={markdownStyles}>{item.text}</Markdown>
            ) : (
              <Text style={styles.botText}>{item.text}</Text>
            )}
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

  // Show loading screen while initializing
  if (isLoading || loadingHistory) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {loadingHistory
              ? "Loading chat history..."
              : "Initializing AI service..."}
          </Text>
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
          {/* Header with Clear Button */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI Chat</Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearHistory}
            >
              <FontAwesomeIcon icon={faTrash} size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>

          {/* Chat messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            style={styles.chatList}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListEmptyComponent={() => (
              <Text style={{ textAlign: "center", marginTop: 50 }}>
                No messages yet
              </Text>
            )}
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

// Markdown styles for formatted responses
const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    color: "#222",
    lineHeight: 24,
  },
  heading1: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
    marginTop: 16,
  },
  heading2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 10,
    marginTop: 14,
  },
  heading3: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    marginTop: 12,
  },
  paragraph: {
    fontSize: 16,
    color: "#222",
    marginBottom: 12,
    lineHeight: 22,
  },
  strong: {
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  em: {
    fontStyle: "italic",
    color: "#333",
  },
  code_inline: {
    backgroundColor: "#f1f5f9",
    color: "#e11d48",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  code_block: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    overflow: "hidden",
  },
  fence: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    overflow: "hidden",
  },
  pre: {
    color: "#e2e8f0",
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    lineHeight: 20,
  },
  list_item: {
    fontSize: 16,
    color: "#222",
    marginBottom: 6,
    lineHeight: 22,
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  blockquote: {
    backgroundColor: "#f8fafc",
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
    paddingLeft: 16,
    paddingVertical: 12,
    marginVertical: 8,
    fontStyle: "italic",
  },
  table: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    marginVertical: 8,
    overflow: "hidden",
  },
  thead: {
    backgroundColor: "#f1f5f9",
  },
  tbody: {
    backgroundColor: "#ffffff",
  },
  th: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  td: {
    fontSize: 14,
    color: "#374151",
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  link: {
    color: "#3b82f6",
    textDecorationLine: "underline",
  },
  hr: {
    backgroundColor: "#e2e8f0",
    height: 1,
    marginVertical: 16,
  },
});

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
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  clearButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
  },
  chatList: {
    flex: 1,
    paddingTop: 10,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  botRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  botBubble: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 16,
    marginLeft: 8,
    maxWidth: "85%",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  botText: {
    color: "#1a1a1a",
    fontSize: 16,
    lineHeight: 22,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e5e7eb",
    marginTop: 4,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 18,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 16,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userText: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 22,
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
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default GeminiChat;
