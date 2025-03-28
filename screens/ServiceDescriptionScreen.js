import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

// Path to store the cart
const cartFilePath = FileSystem.documentDirectory + "cart.txt";

const colors = {
  background: "#1E0B32",     // Dark Purple
  text: "#D0CDE1",           // Light Grayish Purple
  cardBackground: "#3C1C64", // Slightly Lighter Purple
  button: "#B12A90",         // Magenta
  buttonText: "#FFFFFF",     // White
  placeholder: "#9B8CAD",    // Muted Purple
};

// Example recommendations
const recommendations = [
  {
    id: "2a",
    name: "Prestige Banquet Hall",
    price: "€2000 per day",
    image: require("../assets/venue2.jpg"),
  },
  {
    id: "3a",
    name: "Gourmet Catering Co.",
    price: "€1500",
    image: require("../assets/catering1.jpg"),
  },
];

const ServiceDescriptionScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const [addedToCart, setAddedToCart] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  if (!service) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.centered}>
          <Text style={styles.notFound}>Service details not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Load existing cart data
  const loadCart = async () => {
    try {
      let data;
      if (Platform.OS === "web") {
        data = localStorage.getItem("cart");
      } else {
        const fileExists = await FileSystem.getInfoAsync(cartFilePath);
        if (fileExists.exists) {
          data = await FileSystem.readAsStringAsync(cartFilePath);
        }
      }
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  };

  // Add service to cart
  const addToCart = async () => {
    if (service.availability === "Unavailable") return;
    try {
      const existingCart = await loadCart();
      const updatedCart = [...existingCart, service];
      if (Platform.OS === "web") {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } else {
        await FileSystem.writeAsStringAsync(cartFilePath, JSON.stringify(updatedCart));
      }
      setAddedToCart(true);
      setModalVisible(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.outerContainer}>
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
        >
          {modalVisible && (
            <Modal transparent visible animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Success</Text>
                  <Text style={styles.modalMessage}>Service added to cart!</Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <View style={styles.centeredContainer}>
            <Image source={service.image} style={styles.topImage} />
            <View style={styles.content}>
              <View style={styles.headerRow}>
                <Text style={styles.name}>{service.name}</Text>
                <TouchableOpacity>
                  <Ionicons name="heart-outline" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <Text style={styles.price}>{service.price}</Text>
              <Text style={styles.description}>
                {service.description || "Premium quality service offering."}
              </Text>
              <Text style={styles.availability}>
                Availability:{" "}
                <Text
                  style={{
                    fontWeight: "bold",
                    color:
                      service.availability === "Unavailable" ? "red" : "green",
                  }}
                >
                  {service.availability}
                </Text>
              </Text>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  service.availability === "Unavailable" && styles.disabledButton,
                ]}
                onPress={service.availability === "Unavailable" ? null : addToCart}
                disabled={service.availability === "Unavailable"}
              >
                <Text style={styles.addButtonText}>
                  {service.availability === "Unavailable"
                    ? "Unavailable"
                    : addedToCart
                    ? "Added to Cart"
                    : "Add to Bag"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("ExploreSearch")}
              >
                <Text style={styles.backButtonText}>← Back to Exploration</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recommendations}>
              <Text style={styles.sectionTitle}>You may also like</Text>
              {recommendations.map((rec) => (
                <TouchableOpacity
                  key={rec.id}
                  onPress={() =>
                    navigation.navigate("ServiceDescription", { service: rec })
                  }
                  style={styles.recCard}
                >
                  <Image source={rec.image} style={styles.recImage} />
                  <View style={styles.recInfo}>
                    <Text style={styles.recName}>{rec.name}</Text>
                    <Text style={styles.recPrice}>{rec.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ height: 80 }} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === "web" && { minHeight: "100vh" }),
  },
  outerContainer: {
    flex: 1,
    position: "relative",
  },
  scrollArea: {
    flex: 1,
    ...(Platform.OS === "web" && { maxHeight: "calc(100vh - 0px)" }),
  },
  scrollContent: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFound: {
    color: colors.text,
    fontSize: 18,
  },
  centeredContainer: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    backgroundColor: colors.background,
  },
  topImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    marginBottom: 20,
  },
  content: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  price: {
    fontSize: 20,
    color: colors.text,
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
  },
  availability: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: colors.button,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  addButtonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.button,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
  },
  recommendations: {
    marginTop: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  recCard: {
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2D1650",
  },
  recImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "cover",
  },
  recInfo: {
    flex: 1,
  },
  recName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  recPrice: {
    fontSize: 14,
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: colors.cardBackground,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: colors.button,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: colors.buttonText,
    fontSize: 16,
  },
});

export default ServiceDescriptionScreen;
