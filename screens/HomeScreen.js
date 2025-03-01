import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ExploreSearchScreen from "./ExploreSearchScreen";
import CheckoutScreen from "./CheckoutScreen";

const colors = {
  background: "#1E0B32",
  inputBackground: "#3C1C64",
  button: "#B12A90",
  buttonText: "#FFFFFF",
  text: "#D0CDE1",
  placeholder: "#9B8CAD",
};

const HomeScreen = ({ navigation }) => {
  const [activeScreen, setActiveScreen] = useState("Explore");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {activeScreen === "Explore" ? <ExploreSearchScreen navigation={navigation} /> : <CheckoutScreen navigation={navigation} />}
      <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 15, paddingHorizontal: 15, backgroundColor: colors.inputBackground }}>
        <TouchableOpacity 
          onPress={() => setActiveScreen("Explore")} 
          style={{ flex: 1, alignItems: "center", borderRadius: 8 }}
        > 
          <Text style={{ color: activeScreen === "Explore" ? colors.button : colors.text, fontSize: 16, fontWeight: "bold" }}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveScreen("Checkout")} 
          style={{ flex: 1, alignItems: "center", borderRadius: 8 }}
        > 
          <Text style={{ color: activeScreen === "Checkout" ? colors.button : colors.text, fontSize: 16, fontWeight: "bold" }}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
