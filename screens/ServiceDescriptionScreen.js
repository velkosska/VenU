// screens/ServiceDescriptionScreen.js
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

  if (!service) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Service details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Image */}
      <Image source={service.image} style={{ width: "100%", height: 250 }} />
      
      <View style={{ padding: 20, backgroundColor: colors.cardBackground, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 }}>
        {/* Title & Price */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: colors.text }}>{service.name}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 18, color: colors.text, marginBottom: 10 }}>{service.price}</Text>

        {/* Long Description */}
        <Text style={{ fontSize: 16, color: colors.text, marginBottom: 20 }}>
          {service.description || "This is a premium service offering excellent quality and reliability. It provides a memorable experience with a spacious setup, modern aesthetics, and top-tier customer service. The venue includes customizable seating arrangements, professional lighting, and catering options tailored to your needs. Ideal for weddings, corporate events, and exclusive celebrations."}
        </Text>

        {/* Space Selection */}
        <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text, marginBottom: 10 }}>Space Selection</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 15 }}>
          <TouchableOpacity style={{ backgroundColor: colors.button, padding: 8, borderRadius: 8, marginRight: 8, marginBottom: 8 }}>
            <Text style={{ color: colors.buttonText }}>ENTIRE VENUE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: colors.button, padding: 8, borderRadius: 8, marginRight: 8, marginBottom: 8 }}>
            <Text style={{ color: colors.buttonText }}>MAIN HALL</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: colors.button, padding: 8, borderRadius: 8, marginBottom: 8 }}>
            <Text style={{ color: colors.buttonText }}>GARDEN TERRACE</Text>
          </TouchableOpacity>
        </View>
        
        {/* Inquiry Button */}
        <Text style={{ fontSize: 14, color: colors.text, marginBottom: 5 }}>Any Questions?</Text>
        <TouchableOpacity style={{ backgroundColor: colors.text, padding: 10, borderRadius: 8, alignItems: "center", marginBottom: 15, width: "50%" }}>
          <Text style={{ color: colors.background, fontSize: 16, fontWeight: "bold" }}>Reach Out</Text>
        </TouchableOpacity>
        
        {/* Add to Cart */}
        <TouchableOpacity 
          style={{ backgroundColor: colors.button, padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 20 }}
          onPress={() => setAddedToCart(true)}
        >
          <Text style={{ color: colors.buttonText, fontSize: 18, fontWeight: "bold" }}>{addedToCart ? "Added to Cart ✅" : "Add to Bag"}</Text>
        </TouchableOpacity>
        
        {/* Back to Exploration */}
        <TouchableOpacity 
          style={{ backgroundColor: colors.inputBackground, padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 20 }}
          onPress={() => navigation.navigate("ExploreSearch")}
        >
          <Text style={{ color: colors.text, fontSize: 16 }}>← Back to Exploration</Text>
        </TouchableOpacity>
      </View>

      {/* Recommended Services */}
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
