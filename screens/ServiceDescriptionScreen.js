// screens/ServiceDescriptionScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const cartFilePath = FileSystem.documentDirectory + "cart.txt"; // Path to store the cart

const colors = {
  background: "#1E0B32", // Dark Purple
  text: "#D0CDE1", // Light Grayish Purple
  cardBackground: "#3C1C64", // Slightly Lighter Purple
  button: "#B12A90", // Magenta
  buttonText: "#FFFFFF", // White
  placeholder: "#9B8CAD", // Muted Purple
};

const recommendations = [
  { id: "2a", name: "Prestige Banquet Hall", price: "€2000 per day", image: require("../assets/venue2.jpg") },
  { id: "3a", name: "Gourmet Catering Co.", price: "€1500", image: require("../assets/catering1.jpg") },
];

const ServiceDescriptionScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const [addedToCart, setAddedToCart] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  if (!service) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Service details not found.</Text>
      </View>
    );
  }

  // Function to load existing cart data
  const loadCart = async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(cartFilePath);
      if (fileExists.exists) {
        const data = await FileSystem.readAsStringAsync(cartFilePath);
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  };

  // Function to add a service to the cart
  const addToCart = async () => {
    try {
      const existingCart = await loadCart();
      const updatedCart = [...existingCart, service];
      await FileSystem.writeAsStringAsync(cartFilePath, JSON.stringify(updatedCart));
      setAddedToCart(true);
      setModalVisible(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: colors.cardBackground, padding: 20, borderRadius: 10, alignItems: "center", width: "80%" }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Success</Text>
            <Text style={{ color: colors.text, fontSize: 16, marginBottom: 20 }}>Service added to cart!</Text>
            <TouchableOpacity 
              style={{ backgroundColor: colors.button, padding: 10, borderRadius: 8, width: "80%", alignItems: "center" }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: colors.buttonText, fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Image source={service.image} style={{ width: "100%", height: 250 }} />
      <View style={{ padding: 20, backgroundColor: colors.cardBackground, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.text }}>{service.name}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 18, color: colors.text, marginBottom: 10 }}>{service.price}</Text>
        <Text style={{ fontSize: 16, color: colors.text, marginBottom: 20 }}>{service.description || "Premium quality service offering."}</Text>
        <TouchableOpacity 
          style={{ backgroundColor: colors.button, padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 20 }}
          onPress={addToCart}
        >
          <Text style={{ color: colors.buttonText, fontSize: 18, fontWeight: "bold" }}>{addedToCart ? "Added to Cart" : "Add to Bag"}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ backgroundColor: colors.inputBackground, padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 20 }}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={{ color: colors.text, fontSize: 16 }}>← Back to Exploration</Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text, marginBottom: 10 }}>You may also like</Text>
        {recommendations.map((rec) => (
          <TouchableOpacity key={rec.id} onPress={() => navigation.navigate("ServiceDescription", { service: rec })} style={{ flexDirection: "row", backgroundColor: colors.cardBackground, padding: 10, borderRadius: 8, marginBottom: 10 }}>
            <Image source={rec.image} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 10 }} />
            <View>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>{rec.name}</Text>
              <Text style={{ fontSize: 14, color: colors.text }}>{rec.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default ServiceDescriptionScreen;
