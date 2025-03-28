import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Speech from "expo-speech";
import * as FileSystem from "expo-file-system";

// ------------------------------------------------------------------
// KEEPING ALL YOUR EXISTING DATA & LOGIC
// ------------------------------------------------------------------
const OPENAI_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual OpenAI API key

// Define cart file path for storing package data
const cartFilePath = FileSystem.documentDirectory + "cart.txt";

// Initial message with timestamp
const initialMessages = [
  {
    role: "assistant",
    content:
      "Hello! Let me help you plan your event. If you want a single-package (1 item per category), ask for multiple categories. If you only want 1 category, let me know and I'll show you all options from that category. What can I do for you today?",
    timestamp: new Date(),
  },
];

// Example categories
export const categories = [
  {
    id: "1",
    name: "Venues",
    services: [
      {
        id: "1a",
        name: "Community Hall",
        price: "€500",
        availability: "Available",
        image: require("../assets/venue1.jpg"),
      },
      {
        id: "1b",
        name: "Prestige Banquet Hall",
        price: "€2000",
        availability: "Unavailable",
        image: require("../assets/venue2.jpg"),
      },
      {
        id: "1c",
        name: "Skyline Terrace",
        price: "€3000",
        availability: "Available",
        image: require("../assets/venue3.jpg"),
      },
      {
        id: "1d",
        name: "Luxury Grand Ballroom",
        price: "€10000",
        availability: "Available",
        image: require("../assets/venue4.jpg"),
      },
    ],
  },
  {
    id: "2",
    name: "Catering Services",
    services: [
      {
        id: "2a",
        name: "Budget Catering",
        price: "€300",
        availability: "Available",
        image: require("../assets/catering1.jpg"),
      },
      {
        id: "2b",
        name: "Tasteful Bites Catering",
        price: "€1300",
        availability: "Available",
        image: require("../assets/catering2.jpg"),
      },
      {
        id: "2c",
        name: "Vegan Delights",
        price: "€1400",
        availability: "Available",
        image: require("../assets/catering3.jpg"),
      },
      {
        id: "2d",
        name: "Michelin Star Catering",
        price: "€5000",
        availability: "Unavailable",
        image: require("../assets/catering4.jpg"),
      },
    ],
  },
  {
    id: "3",
    name: "Entertainment Providers",
    services: [
      {
        id: "3a",
        name: "Local DJ",
        price: "€150",
        availability: "Available",
        image: require("../assets/dj1.jpg"),
      },
      {
        id: "3b",
        name: "DJ Royale",
        price: "€500",
        availability: "Available",
        image: require("../assets/dj2.jpg"),
      },
      {
        id: "3c",
        name: "Live Band Symphony",
        price: "€1200",
        availability: "Unavailable",
        image: require("../assets/band1.jpg"),
      },
      {
        id: "3d",
        name: "Celebrity Performer",
        price: "€15000",
        availability: "Unavailable",
        image: require("../assets/celebrity.jpg"),
      },
    ],
  },
  {
    id: "4",
    name: "Photographers & Videographers",
    services: [
      {
        id: "4a",
        name: "Student Photographer",
        price: "€50",
        availability: "Available",
        image: require("../assets/photographer1.jpg"),
      },
      {
        id: "4b",
        name: "Photographer Betty",
        price: "€110",
        availability: "Available",
        image: require("../assets/photographer2.jpg"),
      },
      {
        id: "4c",
        name: "Cinematic Videography",
        price: "€700",
        availability: "Available",
        image: require("../assets/videographer1.jpg"),
      },
      {
        id: "4d",
        name: "Luxury Wedding Filmmaking",
        price: "€5000",
        availability: "Unavailable",
        image: require("../assets/videographer2.jpg"),
      },
    ],
  },
  {
    id: "5",
    name: "Transportation Services",
    services: [
      {
        id: "5a",
        name: "Standard Taxi",
        price: "€50",
        availability: "Available",
        image: require("../assets/taxi1.jpg"),
      },
      {
        id: "5b",
        name: "Luxury Chauffeur",
        price: "€200",
        availability: "Available",
        image: require("../assets/transport1.jpg"),
      },
      {
        id: "5c",
        name: "Classic Car Rentals",
        price: "€350",
        availability: "Available",
        image: require("../assets/transport2.jpg"),
      },
      {
        id: "5d",
        name: "Private Jet Rental",
        price: "€25000",
        availability: "Unavailable",
        image: require("../assets/privatejet.jpg"),
      },
    ],
  },
];

const categoryKeywords = {
  Venues: ["venue", "venues"],
  "Catering Services": ["catering", "food"],
  "Entertainment Providers": ["entertainment", "dj", "band"],
  "Photographers & Videographers": ["photographer", "videographer", "photo", "video"],
  "Transportation Services": ["transport", "chauffeur", "car", "taxi", "bus"],
};

// ------------------------------------------------------------------
// HELPER FUNCTIONS (SAME LOGIC)
// ------------------------------------------------------------------
const parseBudgetFromQuery = (text) => {
  const match = text.match(/(\d[\d.]*)/);
  if (match) {
    const numeric = parseInt(match[1].replace(/\./g, ""));
    return isNaN(numeric) ? null : numeric;
  }
  return null;
};

const getAllCategoriesFromQuery = (query) => {
  const lowerQuery = query.toLowerCase();
  let matchedCategories = [];
  for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
    for (let keyword of keywords) {
      if (lowerQuery.includes(keyword)) {
        const catObj = categories.find((cat) => cat.name === categoryName);
        if (catObj && !matchedCategories.includes(catObj)) {
          matchedCategories.push(catObj);
        }
      }
    }
  }
  return matchedCategories;
};

const getNumericPrice = (priceString) => {
  const match = priceString.replace(/[^\d]/g, "");
  return parseInt(match, 10) || 0;
};

const createServiceListMessage = (services, introText = "Here are some options:", isPackage = false) => {
  return {
    role: "assistant",
    type: "serviceList",
    data: services,
    content: introText,
    isPackage: isPackage,
  };
};

const getSingleBestItem = (category, budget = null) => {
  const availableServices = category.services.filter(
    (s) => s.availability.toLowerCase() === "available"
  );
  const budgetFiltered = budget
    ? availableServices.filter((s) => getNumericPrice(s.price) <= budget)
    : availableServices;
  if (!budgetFiltered.length) return null;
  let sorted = budgetFiltered.sort(
    (a, b) => getNumericPrice(b.price) - getNumericPrice(a.price)
  );
  return sorted[0];
};

const getAllItemsInCategory = (category, budget = null) => {
  let available = category.services.filter(
    (s) => s.availability.toLowerCase() === "available"
  );
  if (budget) {
    available = available.filter((s) => getNumericPrice(s.price) <= budget);
  }
  return available;
};

const getOptimalPackageForCategories = (categoryList, budget) => {
  let packages = [];
  const count = categoryList.length;

  const combine = (index, currentCombination, currentTotal) => {
    if (index === count) {
      packages.push({ combination: currentCombination, total: currentTotal });
      return;
    }
    const cat = categoryList[index];
    const items = getAllItemsInCategory(cat, null).filter(
      (item) => getNumericPrice(item.price) <= budget
    );
    for (let item of items) {
      const price = getNumericPrice(item.price);
      if (currentTotal + price <= budget) {
        combine(index + 1, currentCombination.concat(item), currentTotal + price);
      }
    }
  };

  combine(0, [], 0);
  if (packages.length === 0) return [];
  const validPackages = packages.filter((pkg) => pkg.total >= 0.8 * budget);
  let bestPackage;
  if (validPackages.length > 0) {
    bestPackage = validPackages.reduce((prev, curr) =>
      curr.total > prev.total ? curr : prev
    );
  } else {
    bestPackage = packages.reduce((prev, curr) =>
      curr.total > prev.total ? curr : prev
    );
  }
  return bestPackage.combination;
};

// ------------------------------------------------------------------
// CHATBOT SCREEN COMPONENT
// ------------------------------------------------------------------
const ChatbotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef(null);

  // Add a message with a timestamp
  const addMessage = (message) => {
    setMessages((prev) => [...prev, { ...message, timestamp: new Date() }]);
  };

  // Clear conversation
  const clearConversation = () => setMessages(initialMessages);

  // Voice: read out the last bot message
  const handleVoice = () => {
    const botMsgs = messages.filter((m) => m.role === "assistant");
    if (botMsgs.length) {
      const lastMessage = botMsgs[botMsgs.length - 1].content;
      Speech.speak(lastMessage);
    }
  };

  // Updated: Checkout AI-generated package using localStorage on web
  const handleCheckoutPackage = async (packageData) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("cart", JSON.stringify(packageData));
      } else {
        await FileSystem.writeAsStringAsync(cartFilePath, JSON.stringify(packageData));
      }
      navigation.navigate("CheckoutScreen");
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  // Send user message
  const sendMessage = async () => {
    if (!input.trim()) return;
    addMessage({ role: "user", content: input });
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const budget = parseBudgetFromQuery(currentInput);
      const matchedCategories = getAllCategoriesFromQuery(currentInput);

      // CASE A: 1 Category matched => show all items
      if (matchedCategories.length === 1) {
        const category = matchedCategories[0];
        const items = getAllItemsInCategory(category, budget);
        if (items.length > 0) {
          addMessage(
            createServiceListMessage(
              items,
              `Here are all available services in ${category.name}${
                budget ? ` under €${budget}` : ""
              }:` 
            )
          );
        } else {
          addMessage({
            role: "assistant",
            content: `No available services found for ${category.name}${
              budget ? ` under €${budget}` : ""
            }.`,
          });
        }
        setIsTyping(false);
        return;
      }

      // CASE B: Multiple categories => 1-item-per-category package
      if (matchedCategories.length > 1) {
        let packageItems = [];
        if (budget) {
          packageItems = getOptimalPackageForCategories(matchedCategories, budget);
        } else {
          matchedCategories.forEach((cat) => {
            const bestItem = getSingleBestItem(cat, budget);
            if (bestItem) packageItems.push(bestItem);
          });
        }
        if (packageItems.length > 0) {
          addMessage(
            createServiceListMessage(
              packageItems,
              `Here’s a 1-item-per-category package${
                budget ? ` under €${budget}` : ""
              }:`, 
              true
            )
          );
        } else {
          addMessage({
            role: "assistant",
            content: `Sorry, I couldn't find any available items under these categories${
              budget ? ` within your €${budget}` : ""
            }.`,
          });
        }
        setIsTyping(false);
        return;
      }

      // CASE C: No categories matched
      if (matchedCategories.length === 0) {
        if (budget) {
          let packageItems = getOptimalPackageForCategories(categories, budget);
          if (packageItems.length > 0) {
            addMessage(
              createServiceListMessage(
                packageItems,
                `Based on your budget of €${budget}, here is a single-item package from all our categories:`,
                true
              )
            );
            setIsTyping(false);
            return;
          } else {
            addMessage({
              role: "assistant",
              content: `Sorry, I couldn't find any services under €${budget}.`,
            });
            setIsTyping(false);
            return;
          }
        } else {
          let premiumItems = [];
          categories.forEach((cat) => {
            const bestItem = getSingleBestItem(cat, null);
            if (bestItem) premiumItems.push(bestItem);
          });
          if (premiumItems.length > 0) {
            addMessage(
              createServiceListMessage(
                premiumItems,
                "Here are our top picks from all categories:",
                true
              )
            );
            setIsTyping(false);
            return;
          }
          // Fallback to OpenAI if no items were found
          const newMessages = [...messages, { role: "user", content: currentInput }];
          const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: newMessages,
            },
            {
              headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );
          const reply = response.data.choices[0].message.content;
          addMessage({ role: "assistant", content: reply });
          setIsTyping(false);
          return;
        }
      }
    } catch (error) {
      console.error("Chatbot Error:", error);
      addMessage({
        role: "assistant",
        content: "I'm having trouble connecting right now—please try again later.",
      });
      setIsTyping(false);
    }
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Render quick replies for each category + "Reset"
  const renderQuickReplies = () => {
    const quickReplies = [...categories.map((c) => c.name), "Reset"];
    return (
      <View style={styles.quickRepliesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRepliesContent}
        >
          {quickReplies.map((reply) => (
            <TouchableOpacity
              key={reply}
              style={styles.quickReplyButton}
              onPress={() => {
                if (reply === "Reset") {
                  clearConversation();
                } else {
                  setInput(reply);
                }
              }}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render a service list (with optional checkout)
  const renderServiceList = (message) => (
    <View>
      <View style={styles.serviceList}>
        {message.data.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            onPress={() => navigation.navigate("ServiceDescription", { service })}
          >
            <Image source={service.image} style={styles.serviceCardImage} />
            <Text style={styles.serviceCardTitle}>{service.name}</Text>
            <Text style={styles.serviceCardPrice}>{service.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {message.isPackage && (
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => handleCheckoutPackage(message.data)}
        >
          <Text style={styles.checkoutButtonText}>Checkout Package</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render all messages with timestamps
  const renderMessages = () => {
    return messages.map((msg, index) => {
      const timeString = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";
      if (msg.type === "serviceList") {
        return (
          <View key={index} style={styles.messageContainer}>
            <Text style={styles.botMessage}>{msg.content}</Text>
            {renderServiceList(msg)}
            <Text style={styles.timestamp}>{timeString}</Text>
          </View>
        );
      }
      return (
        <View
          key={index}
          style={[
            styles.messageContainer,
            {
              alignSelf: msg.role === "assistant" ? "flex-start" : "flex-end",
              backgroundColor: msg.role === "assistant" ? "#3C1C64" : "#B12A90",
            },
          ]}
        >
          <Text style={styles.messageText}>{msg.content}</Text>
          <Text style={styles.timestamp}>{timeString}</Text>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.outerContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.centeredContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>VenU Bot</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={handleVoice} style={styles.headerButton}>
                <Ionicons name="volume-high" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={clearConversation} style={styles.headerButton}>
                <Ionicons name="trash" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesScrollContent}
            ref={scrollViewRef}
          >
            {renderMessages()}
            {isTyping && <Text style={styles.typingIndicator}>Finding Available Services...</Text>}
          </ScrollView>
          {renderQuickReplies()}
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Type your message..."
              placeholderTextColor="#9B8CAD"
              value={input}
              onChangeText={setInput}
              style={styles.input}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Ionicons name="send" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#1E0B32",
    minHeight: Platform.OS === "web" ? "100vh" : undefined,
  },
  outerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 900,
    backgroundColor: "#1E0B32",
    position: "relative",
  },
  header: {
    height: 60,
    backgroundColor: "#3C1C64",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
  },
  messagesScroll: {
    position: "absolute",
    top: 60,
    bottom: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  messagesScrollContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    maxWidth: "75%",
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  botMessage: {
    color: "#FFFFFF",
    fontSize: 16,
    backgroundColor: "#3C1C64",
    padding: 10,
    borderRadius: 8,
  },
  timestamp: {
    color: "#AAA",
    fontSize: 10,
    marginTop: 5,
    textAlign: "right",
  },
  typingIndicator: {
    color: "#AAA",
    fontStyle: "italic",
    marginTop: 5,
  },
  quickRepliesContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 60,
    backgroundColor: "#1E0B32",
    borderTopWidth: 1,
    borderTopColor: "#3C1C64",
    paddingVertical: 10,
    paddingHorizontal: 10,
    zIndex: 9,
  },
  quickRepliesContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickReplyButton: {
    backgroundColor: "#B12A90",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  quickReplyText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  serviceList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceCard: {
    backgroundColor: "#3C1C64",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    width: "48%",
  },
  serviceCardImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  serviceCardTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
    marginVertical: 5,
  },
  serviceCardPrice: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  checkoutButton: {
    backgroundColor: "#B12A90",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#3C1C64",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    zIndex: 10,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B12A90",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    padding: 5,
  },
});

export default ChatbotScreen;
