// screens/ServiceProviderDashboard.js
import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Modal, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const colors = {
  background: "#1E0B32",
  button: "#B12A90",
  buttonText: "#FFFFFF",
  text: "#D0CDE1",
  inputBackground: "#3C1C64",
  border: "#B12A90",
};

const mockServices = [
  { id: "s1", name: "Prestige Banquet Hall", price: "€2000", description: "Elegant venue perfect for banquets and receptions.", image: require("../assets/venue2.jpg") },
  { id: "s2", name: "Gourmet Catering Co.", price: "€1500", description: "Premium catering service with diverse menu options.", image: require("../assets/catering1.jpg") },
  { id: "s3", name: "DJ Royale", price: "€500", description: "Professional DJ with an extensive playlist.", image: require("../assets/dj1.jpg") },
];

const mockBookings = [
  { id: "b1", serviceName: "Prestige Banquet Hall", customer: "John Doe", date: "2025-04-15" },
  { id: "b2", serviceName: "Gourmet Catering Co.", customer: "Jane Smith", date: "2025-05-20" },
];

const ServiceProviderDashboard = ({ navigation }) => {
  const [services, setServices] = useState(mockServices);
  const [bookings] = useState(mockBookings);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");

  const addService = () => {
    if (newServiceName && newServicePrice && newServiceDescription) {
      const newService = {
        id: `s${services.length + 1}`,
        name: newServiceName,
        price: newServicePrice,
        description: newServiceDescription,
        image: require("../assets/venue1.jpg"), // Using a default image for demonstration
      };
      setServices([...services, newService]);
      setNewServiceName("");
      setNewServicePrice("");
      setNewServiceDescription("");
      setAddModalVisible(false);
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Back Arrow */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate("RoleSelection")}
          accessible
          accessibilityLabel="Go back to role selection"
        >
          <Ionicons name="arrow-back" size={28} color={colors.buttonText} />
        </TouchableOpacity>

        <Text style={styles.header}>Service Provider Dashboard</Text>

        {/* Manage Services Section */}
        <Text style={styles.sectionTitle}>Manage Services</Text>
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.servicePrice}>{item.price}</Text>
              <Text style={styles.serviceDescription}>{item.description}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color={colors.buttonText} />
          <Text style={styles.addButtonText}>Add Service</Text>
        </TouchableOpacity>

        {/* Manage Bookings Section */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Manage Bookings</Text>
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              <Text style={styles.bookingText}>
                <Text style={styles.bold}>Service:</Text> {item.serviceName}
              </Text>
              <Text style={styles.bookingText}>
                <Text style={styles.bold}>Customer:</Text> {item.customer}
              </Text>
              <Text style={styles.bookingText}>
                <Text style={styles.bold}>Date:</Text> {item.date}
              </Text>
            </View>
          )}
        />

        {/* Modal for Adding Service */}
        <Modal
          transparent
          visible={addModalVisible}
          animationType="slide"
          onRequestClose={() => setAddModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add New Service</Text>
              <TextInput
                placeholder="Service Name"
                placeholderTextColor={colors.text}
                style={styles.modalInput}
                value={newServiceName}
                onChangeText={setNewServiceName}
              />
              <TextInput
                placeholder="Price"
                placeholderTextColor={colors.text}
                style={styles.modalInput}
                value={newServicePrice}
                onChangeText={setNewServicePrice}
              />
              <TextInput
                placeholder="Description"
                placeholderTextColor={colors.text}
                style={[styles.modalInput, { height: 80 }]}
                value={newServiceDescription}
                onChangeText={setNewServiceDescription}
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={addService}>
                  <Text style={styles.modalButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.inputBackground }]}
                  onPress={() => setAddModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    backgroundColor: colors.background,
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginVertical: 10,
  },
  card: {
    backgroundColor: colors.inputBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  serviceName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  servicePrice: {
    color: colors.text,
    fontSize: 16,
    marginVertical: 5,
  },
  serviceDescription: {
    color: colors.text,
    fontSize: 14,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.button,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  bookingCard: {
    backgroundColor: colors.inputBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  bookingText: {
    color: colors.text,
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: colors.inputBackground,
    color: colors.text,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  modalButton: {
    backgroundColor: colors.button,
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  modalButtonText: {
    color: colors.buttonText,
    fontSize: 16,
  },
});

export default ServiceProviderDashboard;
