// screens/ExploreSearchScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    { id: "1a", name: "Grand Royal Ballroom", price: "€2500 per day", description: "A luxurious ballroom for grand events.", image: require("../assets/venue1.jpg") },
    { id: "1b", name: "Prestige Banquet Hall", price: "€2000 per day", description: "Elegant venue perfect for banquets and receptions.", image: require("../assets/venue2.jpg") },
  ]},
  { id: "2", name: "Catering Services", services: [
    { id: "2a", name: "Gourmet Catering Co.", price: "€1500", description: "Premium catering service with diverse menu options.", image: require("../assets/catering1.jpg") },
  ]},
  { id: "3", name: "Entertainment Providers", services: [
    { id: "3a", name: "DJ Royale", price: "€500", description: "Professional DJ with an extensive playlist.", image: require("../assets/dj1.jpg") },
  ]},
  { id: "4", name: "Photographers & Videographers", services: [
    { id: "4a", name: "Photographer Mike", price: "€110", description: "Experienced photographer for high-quality event coverage.", image: require("../assets/photographer1.jpg") },
  ]},
  { id: "5", name: "Florists & Decorators", services: [
    { id: "5a", name: "Floral Creations", price: "€80", description: "Beautiful floral arrangements for all occasions.", image: require("../assets/florist1.jpg") },
  ]},
  { id: "6", name: "Transportation Services", services: [
    { id: "6a", name: "Luxury Chauffeur", price: "€200", description: "Luxury transportation service with professional chauffeurs.", image: require("../assets/transport1.jpg") },
  ]},
  { id: "7", name: "Event Furniture & Equipment Rentals", services: [
    { id: "7a", name: "Elite Event Rentals", price: "€500", description: "Premium furniture and equipment rentals for events.", image: require("../assets/furniture1.jpg") },
  ]},
];

const ExploreSearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);

  const handleSearch = (text) => {
    setSearch(text);
    if (text === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.map((category) => ({
        ...category,
        services: category.services.filter((service) =>
          service.name.toLowerCase().includes(text.toLowerCase())
        ),
      })).filter((category) => category.services.length > 0);
      setFilteredCategories(filtered);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      {/* Search Bar and Filter Button */}
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.inputBackground, padding: 12, borderRadius: 8, marginBottom: 15, marginTop:30 }}>
        <Ionicons name="search" size={20} color={colors.text} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search for services..."
          placeholderTextColor={colors.placeholder}
          value={search}
          onChangeText={handleSearch}
          style={{ flex: 1, color: colors.text }}
        />
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <Ionicons name="filter" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {/* Category Listings */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(category) => category.id}
        renderItem={({ item: category }) => (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>{category.name}</Text>
            <FlatList
              data={category.services}
              keyExtractor={(service) => service.id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ backgroundColor: colors.inputBackground, borderRadius: 8, marginBottom: 15, padding: 10, width: "48%" }}
                  onPress={() => navigation.navigate("ServiceDescription", { service: item })}
                >
                  <Image source={item.image} style={{ width: "100%", height: 120, borderRadius: 8 }} />
                  <Text style={{ color: colors.text, fontSize: 16, fontWeight: "bold", marginTop: 10 }}>{item.name}</Text>
                  <Text style={{ color: colors.text }}>{item.price}</Text>
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