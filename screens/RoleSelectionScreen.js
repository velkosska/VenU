import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const colors = {
  background: "#1E0B32",         // Dark Purple
  buttonOrganizer: "#3C1C64",      // Slightly Lighter Purple
  buttonProvider: "#B12A90",       // Magenta
  buttonSuperPlanner: "#6A0DAD",   // A distinct color for SuperPlanner (you can change it)
  buttonText: "#FFFFFF",           // White
  text: "#D0CDE1",                // Light Grayish Purple
};

const RoleSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      
      <TouchableOpacity 
        style={styles.organizerButton}
        onPress={() => navigation.navigate("EventDetails")}
        accessible
        accessibilityLabel="Select Event Organizer role"
      >
        <Ionicons name="calendar" size={32} color={colors.buttonText} style={styles.icon} />
        <Text style={styles.buttonText}>Event Organizer</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.providerButton}
        onPress={() => navigation.navigate("ServiceProviderDashboard")}
        accessible
        accessibilityLabel="Select Service Provider role"
      >
        <Ionicons name="musical-notes" size={32} color={colors.buttonText} style={styles.icon} />
        <Text style={styles.buttonText}>Service Provider</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.superPlannerButton}
        onPress={() => navigation.navigate("SuperPlannerDashboard")}
        accessible
        accessibilityLabel="Select SuperPlanner role"
      >
        <Ionicons name="stats-chart" size={32} color={colors.buttonText} style={styles.icon} />
        <Text style={styles.buttonText}>SuperPlanner</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 40,
  },
  organizerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.buttonOrganizer,
    padding: 15,
    borderRadius: 8,
    width: "80%",
    justifyContent: "center",
    marginBottom: 20,
  },
  providerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.buttonProvider,
    padding: 15,
    borderRadius: 8,
    width: "80%",
    justifyContent: "center",
    marginBottom: 20,
  },
  superPlannerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.buttonSuperPlanner,
    padding: 15,
    borderRadius: 8,
    width: "80%",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
});

export default RoleSelectionScreen;
