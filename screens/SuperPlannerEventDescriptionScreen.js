import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const PACKAGES_FILE = FileSystem.documentDirectory + "packages.txt";
const LOCALSTORAGE_KEY = "packages.txt";

const colors = {
  background: "#1E0B32",
  cardBackground: "#3C1C64",
  button: "#B12A90",
  buttonText: "#FFFFFF",
  text: "#D0CDE1",
};

const SuperPlannerEventDescriptionScreen = ({ route, navigation }) => {
  const { service, packageId } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadPackage();
    }, [packageId])
  );

  // Load the packages array, then find the package by id
  const loadPackage = async () => {
    if (!packageId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      let allPackages;
      if (Platform.OS === "web") {
        const data = localStorage.getItem(LOCALSTORAGE_KEY);
        allPackages = data ? JSON.parse(data) : [];
      } else {
        const fileInfo = await FileSystem.getInfoAsync(PACKAGES_FILE);
        allPackages = fileInfo.exists ? JSON.parse(await FileSystem.readAsStringAsync(PACKAGES_FILE)) : [];
      }
      const pkg = allPackages.find((p) => String(p.id) === String(packageId));
      if (!pkg) {
        Alert.alert("Error", "Package not found.");
      }
      setPackageData(pkg);
    } catch (error) {
      console.error("Error loading package:", error);
      Alert.alert("Error", "Failed to load package");
    } finally {
      setIsLoading(false);
    }
  };

  // Save the updated packages array after modifying one package
  const saveAllPackages = async (updatedPackages) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedPackages));
      } else {
        await FileSystem.writeAsStringAsync(PACKAGES_FILE, JSON.stringify(updatedPackages));
      }
    } catch (error) {
      console.error("Error saving packages:", error);
      Alert.alert("Error", "Failed to save package");
    }
  };

  // Add the service to the package
  const addToPackage = async () => {
    if (!service) {
      Alert.alert("Error", "No service data provided.");
      return;
    }
    if (!packageId || !packageData) {
      Alert.alert("Error", "Package not loaded or missing packageId.");
      return;
    }
    if (service.availability === "Unavailable") {
      Alert.alert("Service unavailable", "This service is currently unavailable.");
      return;
    }
    if (packageData.services?.some((s) => s.id === service.id)) {
      Alert.alert("Service already added", "This service is already in your package.");
      return;
    }
    try {
      // Load the full packages array
      let allPackages;
      if (Platform.OS === "web") {
        const data = localStorage.getItem(LOCALSTORAGE_KEY);
        allPackages = data ? JSON.parse(data) : [];
      } else {
        const fileInfo = await FileSystem.getInfoAsync(PACKAGES_FILE);
        allPackages = fileInfo.exists ? JSON.parse(await FileSystem.readAsStringAsync(PACKAGES_FILE)) : [];
      }
      // Update the target package
      const updatedPackages = allPackages.map((p) => {
        if (String(p.id) === String(packageId)) {
          return { ...p, services: [...(p.services || []), service] };
        }
        return p;
      });
      await saveAllPackages(updatedPackages);
      setModalVisible(true);
      loadPackage(); // Refresh local state
    } catch (error) {
      console.error("Error adding to package:", error);
      Alert.alert("Error", "Failed to add service to package.");
    }
  };

  if (!service) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.centered}>
          <Text style={styles.notFound}>Service details not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.outerContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.button} style={styles.loadingIndicator} />
        ) : (
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {modalVisible && (
              <Modal
                transparent
                visible
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Success</Text>
                    <Text style={styles.modalMessage}>Service successfully added to package!</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                      <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            )}
            <View style={styles.centeredContainer}>
              <Image source={service.image} style={styles.topImage} />
              <View style={styles.content}>
                <View style={styles.headerRow}>
                  <Text style={styles.name}>{service.name}</Text>
                  <TouchableOpacity>
                    <Ionicons name="heart-outline" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.price}>{service.price}</Text>
                <Text style={styles.description}>
                  {service.description || "Premium quality service offering."}
                </Text>
                <Text style={styles.availability}>
                  Availability:{" "}
                  <Text style={{ fontWeight: "bold", color: service.availability === "Unavailable" ? "red" : "green" }}>
                    {service.availability}
                  </Text>
                </Text>
                <TouchableOpacity
                  style={[styles.addButton, service.availability === "Unavailable" && styles.disabledButton]}
                  onPress={addToPackage}
                  disabled={service.availability === "Unavailable"}
                >
                  <Text style={styles.addButtonText}>Add to Package</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.navigate("SuperPlannerExploreSearchScreen", { packageId })}
                >
                  <Text style={styles.backButtonText}>← Back to Exploration</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === "web" && { minHeight: "100vh" }),
  },
  outerContainer: {
    flex: 1,
    position: "relative",
  },
  scrollArea: {
    flex: 1,
    ...(Platform.OS === "web" && { maxHeight: "calc(100vh - 0px)" }),
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  loadingIndicator: {
    marginTop: 50,
  },
  centeredContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 20,
    marginBottom: 40,
  },
  topImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 20,
  },
  content: {
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  price: {
    fontSize: 20,
    color: colors.text,
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  availability: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: colors.button,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  addButtonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.button,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  backButtonText: {
    color: colors.text,
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: colors.cardBackground,
    padding: 30,
    borderRadius: 10,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: colors.button,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  notFound: {
    color: colors.text,
    fontSize: 18,
  },
});

export default SuperPlannerEventDescriptionScreen;
