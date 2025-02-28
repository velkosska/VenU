// screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const colors = {
  background: "#1E0B32", // Dark Purple
  inputBackground: "#3C1C64", // Slightly Lighter Purple
  button: "#B12A90", // Magenta
  buttonText: "#FFFFFF", // White
  text: "#D0CDE1", // Light Grayish Purple
  placeholder: "#9B8CAD" // Muted Purple
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.text, marginBottom: 30 }}>Welcome Back</Text>
      
      <TextInput 
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
        style={{ width: "80%", padding: 12, backgroundColor: colors.inputBackground, color: colors.text, borderRadius: 8, marginBottom: 15 }}
      />
      
      <TextInput 
        placeholder="Password"
        placeholderTextColor={colors.placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ width: "80%", padding: 12, backgroundColor: colors.inputBackground, color: colors.text, borderRadius: 8, marginBottom: 20 }}
      />
      
      <TouchableOpacity 
        style={{ backgroundColor: colors.button, padding: 15, borderRadius: 8, width: "80%", alignItems: "center" }}
        onPress={() => navigation.navigate("RoleSelection")}
      >
        <Text style={{ color: colors.buttonText, fontSize: 18, fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;