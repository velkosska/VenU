// screens/RoleSelectionScreen.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const colors = {
  background: "#1E0B32", // Dark Purple
  buttonOrganizer: "#3C1C64", // Slightly Lighter Purple
  buttonProvider: "#B12A90", // Magenta
  buttonText: "#FFFFFF", // White
  text: "#D0CDE1", // Light Grayish Purple
};

const RoleSelectionScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.text, marginBottom: 30 }}>Select Your Role</Text>
      
      <TouchableOpacity 
        style={{ backgroundColor: colors.buttonOrganizer, padding: 15, borderRadius: 8, width: "80%", alignItems: "center", marginBottom: 15 }}
        onPress={() => navigation.navigate("EventDetails")}
      >
        <Text style={{ color: colors.buttonText, fontSize: 18, fontWeight: "bold" }}>Event Organizer</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ backgroundColor: colors.buttonProvider, padding: 15, borderRadius: 8, width: "80%", alignItems: "center" }}
        onPress={() => navigation.navigate("ServiceProviderDashboard")}
      >
        <Text style={{ color: colors.buttonText, fontSize: 18, fontWeight: "bold" }}>Service Provider</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoleSelectionScreen;
