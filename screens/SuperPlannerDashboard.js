import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";

const LOCALSTORAGE_KEY = "packages.txt";

const colors = {
  background: "#1E0B32",
  inputBackground: "#3C1C64",
  button: "#B12A90",
  buttonText: "#FFFFFF",
  text: "#D0CDE1",
  placeholder: "#9B8CAD",
};

export default function SuperPlannerDashboard({ navigation }) {
  // Hero fields
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  // Packages
  const [packages, setPackages] = useState([]);
  const [currentTab, setCurrentTab] = useState("packages");
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadPackages();
    }, [])
  );

  // Load packages from storage
  const loadPackages = async () => {
    try {
      setIsLoading(true);
      let parsed = [];
      if (Platform.OS === "web") {
        const data = localStorage.getItem(LOCALSTORAGE_KEY);
        parsed = data ? JSON.parse(data) : [];
      } else {
        const fileUri = FileSystem.documentDirectory + LOCALSTORAGE_KEY;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
          const content = await FileSystem.readAsStringAsync(fileUri);
          parsed = JSON.parse(content);
        }
      }
      setPackages(parsed);
    } catch (error) {
      console.error("Error loading packages:", error);
      Alert.alert("Error", "Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  };

  // Save packages to storage
  const savePackages = async (updated) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updated));
      } else {
        await FileSystem.writeAsStringAsync(
          FileSystem.documentDirectory + LOCALSTORAGE_KEY,
          JSON.stringify(updated)
        );
      }
    } catch (error) {
      console.error("Error saving packages:", error);
      Alert.alert("Error", "Failed to save packages");
    }
  };

  // Create new package from hero "Search" fields
  const handleSearch = async () => {
    if (!location.trim()) {
      Alert.alert("Please enter a location");
      return;
    }
    const newPkgId = Date.now().toString();
    const newPkg = {
      id: newPkgId,
      title: eventTitle.trim() || "Untitled Event",
      description: `Where: ${location}, When: ${eventDate}, Size: ${guests}\n\n${eventDescription}`,
      services: [],
      affiliateLink: `https://example.com/package/${newPkgId}`,
      views: 0,
      profit: 0,
    };

    try {
      const updated = [newPkg, ...packages];
      await savePackages(updated);
      setPackages(updated);

      // Clear hero fields
      setLocation("");
      setEventDate("");
      setGuests("");
      setEventTitle("");
      setEventDescription("");

      // Navigate to Explore
      navigation.navigate("SuperPlannerExploreSearchScreen", { packageId: newPkgId });
    } catch (error) {
      console.error("Error creating package:", error);
      Alert.alert("Error", "Failed to create package");
    }
  };

  // Edit modal logic
  const openEditModal = (pkg) => {
    setCurrentEditId(pkg.id);
    setEditTitle(pkg.title);
    setEditDescription(pkg.description);
    setEditModalVisible(true);
  };

  const saveEditedPackage = async () => {
    if (!editTitle.trim()) {
      Alert.alert("Please enter a package title");
      return;
    }
    try {
      const updatedPackages = packages.map((pkg) => {
        if (String(pkg.id) === String(currentEditId)) {
          return { ...pkg, title: editTitle.trim(), description: editDescription.trim() };
        }
        return pkg;
      });
      await savePackages(updatedPackages);
      setPackages(updatedPackages);
      setEditModalVisible(false);
      Alert.alert("Success", "Package updated successfully");
    } catch (error) {
      console.error("Error editing package:", error);
      Alert.alert("Error", "Failed to update package");
    }
  };

  // Render each package
  const renderPackageItem = ({ item }) => (
    <View style={styles.packageCard}>
      {/* Title/Description/Edit in a column, centered */}
      <View style={styles.titleRow}>
        <Text style={styles.packageTitle}>{item.title}</Text>
        <Text style={styles.packageDesc}>{item.description}</Text>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* HORIZONTAL SCROLL for item.services */}
      {item.services && item.services.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.servicesScrollWrapper}
          contentContainerStyle={styles.servicesScroll}
        >
          {item.services.map((service) => (
            <View key={service.id} style={styles.serviceItem}>
              <Image source={service.image} style={styles.serviceImage} />
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text
                style={[
                  styles.serviceAvailability,
                  { color: service.availability === "Unavailable" ? "red" : "green" },
                ]}
              >
                {service.availability}
              </Text>
              <Text style={styles.servicePrice}>{service.price}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyServices}>
          <Text style={styles.emptyServicesText}>No services added yet</Text>
        </View>
      )}

      <View style={styles.copyButtonContainer}>
        <TouchableOpacity style={styles.copyButton} onPress={() => {/* copy link code */}}>
          <Text style={styles.copyButtonText}>Copy Link</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.copyButton, { marginLeft: 10 }]}
          onPress={() => navigation.navigate("PackageDetailScreen", { packageId: item.id })}
        >
          <Text style={styles.copyButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.copyButton, { marginLeft: 10, backgroundColor: "#444" }]}
          onPress={() =>
            navigation.navigate("SuperPlannerExploreSearchScreen", { packageId: item.id })
          }
        >
          <Text style={styles.copyButtonText}>Add Items</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Simple analytics
  const totalViews = packages.reduce((acc, pkg) => acc + pkg.views, 0);
  const totalProfit = packages.reduce((acc, pkg) => acc + pkg.profit, 0);
  const mostPopular = packages.reduce(
    (prev, curr) => (curr.views > prev.views ? curr : prev),
    { views: 0, title: "None" }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {/* TAB NAV */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, currentTab === "packages" && styles.activeTab]}
              onPress={() => setCurrentTab("packages")}
            >
              <Text style={styles.tabText}>My Packages</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, currentTab === "analytics" && styles.activeTab]}
              onPress={() => setCurrentTab("analytics")}
            >
              <Text style={styles.tabText}>Analytics</Text>
            </TouchableOpacity>
          </View>

          {/* HERO SECTION */}
          <View style={styles.heroContainer}>
            <Text style={styles.heroTitle}>Your perfect planned event</Text>
            <Text style={styles.heroSubtitle}>
              Your perfect event planned in less than 5 minutes. All in one place.
            </Text>
            <View style={styles.searchRow}>
              <View style={styles.heroInputBox}>
                <Text style={styles.heroInputLabel}>Where</Text>
                <TextInput
                  style={styles.heroInput}
                  placeholder="Search Venues"
                  placeholderTextColor={colors.placeholder}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              <View style={styles.heroInputBox}>
                <Text style={styles.heroInputLabel}>When</Text>
                <TextInput
                  style={styles.heroInput}
                  placeholder="Select Date"
                  placeholderTextColor={colors.placeholder}
                  value={eventDate}
                  onChangeText={setEventDate}
                />
              </View>
              <View style={styles.heroInputBox}>
                <Text style={styles.heroInputLabel}>Size</Text>
                <TextInput
                  style={styles.heroInput}
                  placeholder="Nr. of Guests"
                  placeholderTextColor={colors.placeholder}
                  value={guests}
                  onChangeText={setGuests}
                />
              </View>
              <TouchableOpacity style={styles.heroSearchButton} onPress={handleSearch}>
                <Text style={styles.heroSearchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.optionalTitle}>Title & Description (Optional)</Text>
            <View style={styles.optionalRow}>
              <TextInput
                style={[styles.heroInput, { marginRight: 15 }]}
                placeholder="Event Title"
                placeholderTextColor={colors.placeholder}
                value={eventTitle}
                onChangeText={setEventTitle}
              />
              <TextInput
                style={[styles.heroInput]}
                placeholder="Event Description"
                placeholderTextColor={colors.placeholder}
                value={eventDescription}
                onChangeText={setEventDescription}
              />
            </View>
          </View>

          {/* CONTENT SECTION */}
          <View style={styles.contentContainer}>
            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={colors.button}
                style={styles.loadingIndicator}
              />
            ) : currentTab === "packages" ? (
              packages.length > 0 ? (
                <FlatList
                  data={packages}
                  renderItem={renderPackageItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.packagesList}
                  scrollEnabled={false}
                  {...(Platform.OS === "web" && {
                    getItemLayout: (data, index) => ({
                      length: 300,
                      offset: 300 * index,
                      index,
                    }),
                    initialNumToRender: 10,
                    maxToRenderPerBatch: 10,
                    windowSize: 15,
                  })}
                />
              ) : (
                <Text style={styles.emptyText}>No packages created yet</Text>
              )
            ) : (
              <View style={styles.analyticsContainer}>
                <Text style={styles.subHeader}>Analytics</Text>
                <Text style={styles.analyticsText}>Total Views: {totalViews}</Text>
                <Text style={styles.analyticsText}>Total Profit: €{totalProfit}</Text>
                <Text style={styles.analyticsText}>
                  Most Popular Package: {mostPopular.title} ({mostPopular.views} views)
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* EDIT MODAL */}
      <Modal
        transparent
        animationType="fade"
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Package</Text>
            <TextInput
              style={[styles.heroInput, { marginBottom: 10 }]}
              placeholder="Package Title"
              placeholderTextColor={colors.placeholder}
              value={editTitle}
              onChangeText={setEditTitle}
            />
            <TextInput
              style={[styles.heroInput, { height: 60, marginBottom: 10 }]}
              placeholder="Package Description"
              placeholderTextColor={colors.placeholder}
              multiline
              value={editDescription}
              onChangeText={setEditDescription}
            />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[styles.heroSearchButton, { marginRight: 10 }]}
                onPress={saveEditedPackage}
              >
                <Text style={styles.heroSearchButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroSearchButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.heroSearchButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContainer: {
    flex: 1,
    ...Platform.select({
      web: {
        minHeight: "100vh",
      },
    }),
  },
  scrollView: {
    flex: 1,
    ...Platform.select({
      web: {
        maxHeight: "calc(100vh - 60px)",
      },
    }),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: colors.inputBackground,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: colors.button,
  },
  tabText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  heroContainer: {
    padding: 20,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
    maxWidth: 600,
  },
  searchRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  heroInputBox: {
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  heroInputLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
    textAlign: "center",
  },
  heroInput: {
    backgroundColor: colors.inputBackground,
    padding: 12,
    borderRadius: 8,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.button,
    textAlign: "center",
    width: 140,
  },
  heroSearchButton: {
    backgroundColor: colors.button,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  heroSearchButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  optionalTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  optionalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    ...Platform.select({
      web: {
        maxWidth: 800,
        marginHorizontal: "auto",
        width: "100%",
      },
    }),
  },
  packagesList: {
    width: "100%",
  },
  packageCard: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center", // Center all card contents horizontally
    ...Platform.select({
      web: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
      default: {
        elevation: 3,
      },
    }),
  },
  // Switched to column to center Title, Description, and Edit
  titleRow: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  packageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
    textAlign: "center",
  },
  packageDesc: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  editText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  // Horizontal scroll, centered
  servicesScrollWrapper: {
    width: "100%",
    marginBottom: 10,
  },
  servicesScroll: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  serviceItem: {
    width: 130,
    alignItems: "center",
    marginRight: 20,
  },
  serviceImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: "cover",
  },
  serviceName: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 2,
  },
  serviceAvailability: {
    fontSize: 14,
    marginBottom: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
  servicePrice: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
  copyButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  copyButton: {
    backgroundColor: colors.button,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
  },
  copyButtonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
  analyticsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  subHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
    marginVertical: 10,
    textAlign: "center",
  },
  analyticsText: {
    fontSize: 18,
    color: colors.text,
    marginVertical: 5,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: colors.inputBackground,
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
  loadingIndicator: {
    marginVertical: 40,
  },
  emptyText: {
    color: colors.text,
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
  },
  emptyServices: {
    padding: 20,
    alignItems: "center",
  },
  emptyServicesText: {
    color: colors.text,
    fontSize: 16,
  },
});
