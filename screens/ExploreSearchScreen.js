// screens/ExploreSearchScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from "react-native";

const colors = {
  background: "#1E0B32", // Dark Purple
  inputBackground: "#3C1C64", // Slightly Lighter Purple
  button: "#B12A90", // Magenta
  buttonText: "#FFFFFF", // White
  text: "#D0CDE1", // Light Grayish Purple
  placeholder: "#9B8CAD", // Muted Purple
};

const categories = [
  { id: "1", name: "Venues", services: [
    { id: "1a", name: "Grand Royal Ballroom", price: "€2500 per day", image: require("../assets/venue1.jpg") },
    { id: "1b", name: "Prestige Banquet Hall", price: "€2000 per day", image: require("../assets/venue2.jpg") },
  ]},
  { id: "2", name: "Catering Services", services: [
    { id: "2a", name: "Gourmet Catering Co.", price: "€1500", image: require("../assets/catering1.jpg") },
  ]},
  { id: "3", name: "Entertainment Providers", services: [
    { id: "3a", name: "DJ Royale", price: "€500", image: require("../assets/dj1.jpg") },
  ]},
  { id: "4", name: "Photographers & Videographers", services: [
    { id: "4a", name: "Photographer Mike", price: "€110", image: require("../assets/photographer1.jpg") },
  ]},
  { id: "5", name: "Florists & Decorators", services: [
    { id: "5a", name: "Floral Creations", price: "€80", image: require("../assets/florist1.jpg") },
  ]},
  { id: "6", name: "Transportation Services", services: [
    { id: "6a", name: "Luxury Chauffeur", price: "€200", image: require("../assets/transport1.jpg") },
  ]},
  { id: "7", name: "Event Furniture & Equipment Rentals", services: [
    { id: "7a", name: "Elite Event Rentals", price: "€500", image: require("../assets/furniture1.jpg") },
  ]},
];

const ExploreSearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      <TextInput
        placeholder="Search for services..."
        placeholderTextColor={colors.placeholder}
        value={search}
        onChangeText={setSearch}
        style={{ padding: 12, backgroundColor: colors.inputBackground, color: colors.text, borderRadius: 8, marginBottom: 20 }}
      />
      
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>{item.name}</Text>
            <FlatList
              data={item.services}
              keyExtractor={(service) => service.id}
              horizontal
              renderItem={({ item: service }) => (
                <TouchableOpacity
                  style={{ backgroundColor: colors.inputBackground, borderRadius: 8, marginRight: 15, padding: 10, width: 200 }}
                  onPress={() => navigation.navigate("VenueDescription", { venue: service })}
                >
                  <Image source={service.image} style={{ width: "100%", height: 120, borderRadius: 8 }} />
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: "bold", marginTop: 10 }}>{service.name}</Text>
                  <Text style={{ color: colors.text }}>{service.price}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      />
    </View>
  );
};

export default ExploreSearchScreen;
