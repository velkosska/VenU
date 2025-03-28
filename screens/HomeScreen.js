// screens/HomeScreen.js
import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const colors = {
  background: "#1E0B32",          // Dark Purple
  inputBackground: "#3C1C64",       // Slightly Lighter Purple
  button: "#B12A90",              // Magenta (for headers, accents)
  buttonText: "#FFFFFF",          // White
  text: "#D0CDE1",                // Light Grayish Purple
};

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Header with Logo and Tagline */}
        <View style={styles.header}>
          <Text style={styles.tagline}>Plan, Book, and Celebrate!</Text>
        </View>
        <Text style={styles.welcome}>Welcome to VenU</Text>
        {/* Navigation Buttons */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate("EventDetails")}
          accessible
          accessibilityLabel="Create New Event"
        >
          <Ionicons name="calendar" size={24} color={colors.buttonText} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Create New Event</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate("ExploreSearch")}
          accessible
          accessibilityLabel="Explore Services"
        >
          <Ionicons name="search" size={24} color={colors.buttonText} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Explore Services</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate("Chatbot")}
          accessible
          accessibilityLabel="Chat with AI"
        >
          <Ionicons name="chatbubble-ellipses" size={24} color={colors.buttonText} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Chat with AI</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate("CheckoutScreen")}
          accessible
          accessibilityLabel="View Event"
        >
          <Ionicons name="cart-outline" size={24} color={colors.buttonText} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View Event</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  tagline: {
    color: colors.text,
    fontSize: 16,
    fontStyle: "italic",
  },
  welcome: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: colors.inputBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
