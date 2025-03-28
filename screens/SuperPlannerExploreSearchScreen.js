import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { debounce } from "lodash";

const colors = {
  background: "#1E0B32",
  inputBackground: "#3C1C64",
  button: "#B12A90",
  buttonText: "#FFFFFF",
  text: "#D0CDE1",
  placeholder: "#9B8CAD",
};

const categories = [
  {
    id: "1",
    name: "Venues",
    services: [
      { id: "1a", name: "Community Hall", price: "€500", availability: "Available", image: require("../assets/venue1.jpg") },
      { id: "1b", name: "Prestige Banquet Hall", price: "€2000", availability: "Unavailable", image: require("../assets/venue2.jpg") },
      { id: "1c", name: "Skyline Terrace", price: "€3000", availability: "Available", image: require("../assets/venue3.jpg") },
      { id: "1d", name: "Luxury Grand Ballroom", price: "€10000", availability: "Available", image: require("../assets/venue4.jpg") },
    ],
  },
  {
    id: "2",
    name: "Catering Services",
    services: [
      { id: "2a", name: "Budget Catering", price: "€300", availability: "Available", image: require("../assets/catering1.jpg") },
      { id: "2b", name: "Tasteful Bites Catering", price: "€1300", availability: "Available", image: require("../assets/catering2.jpg") },
      { id: "2c", name: "Vegan Delights", price: "€1400", availability: "Available", image: require("../assets/catering3.jpg") },
      { id: "2d", name: "Michelin Star Catering", price: "€5000", availability: "Unavailable", image: require("../assets/catering4.jpg") },
    ],
  },
  {
    id: "3",
    name: "Entertainment Providers",
    services: [
      { id: "3a", name: "Local DJ", price: "€150", availability: "Available", image: require("../assets/dj1.jpg") },
      { id: "3b", name: "DJ Royale", price: "€500", availability: "Available", image: require("../assets/dj2.jpg") },
      { id: "3c", name: "Live Band Symphony", price: "€1200", availability: "Unavailable", image: require("../assets/band1.jpg") },
      { id: "3d", name: "Celebrity Performer", price: "€15000", availability: "Unavailable", image: require("../assets/celebrity.jpg") },
    ],
  },
  {
    id: "4",
    name: "Photographers & Videographers",
    services: [
      { id: "4a", name: "Student Photographer", price: "€50", availability: "Available", image: require("../assets/photographer1.jpg") },
      { id: "4b", name: "Photographer Betty", price: "€110", availability: "Available", image: require("../assets/photographer2.jpg") },
      { id: "4c", name: "Cinematic Videography", price: "€700", availability: "Available", image: require("../assets/videographer1.jpg") },
      { id: "4d", name: "Luxury Wedding Filmmaking", price: "€5000", availability: "Unavailable", image: require("../assets/videographer2.jpg") },
    ],
  },
  {
    id: "5",
    name: "Transportation Services",
    services: [
      { id: "5a", name: "Standard Taxi", price: "€50", availability: "Available", image: require("../assets/taxi1.jpg") },
      { id: "5b", name: "Luxury Chauffeur", price: "€200", availability: "Available", image: require("../assets/transport1.jpg") },
      { id: "5c", name: "Classic Car Rentals", price: "€350", availability: "Available", image: require("../assets/transport2.jpg") },
      { id: "5d", name: "Private Jet Rental", price: "€25000", availability: "Unavailable", image: require("../assets/privatejet.jpg") },
    ],
  },
];

// Enrich services with unique IDs if missing
const enrichedCategories = categories.map((cat) => ({
  ...cat,
  services: cat.services.map((svc, idx) => {
    if (!svc.id) {
      return { ...svc, id: `${cat.id}-${idx}-${svc.name.replace(/\s+/g, "-")}` };
    }
    return svc;
  }),
}));

const SuperPlannerExploreSearchScreen = ({ navigation, route }) => {
  const [search, setSearch] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");
  const [filteredCategories, setFilteredCategories] = useState(enrichedCategories);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = debounce((text) => setSearch(text), 300);

  useEffect(() => () => debouncedSearch.cancel(), []);

  useEffect(() => {
    setIsLoading(true);
    let updated = enrichedCategories;
    if (selectedFilterCategory !== "All") {
      updated = updated.filter((cat) => cat.name === selectedFilterCategory);
    }
    if (search.trim()) {
      updated = updated
        .map((cat) => ({
          ...cat,
          services: cat.services.filter((s) =>
            s.name.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((cat) => cat.services.length > 0);
    }
    if (onlyAvailable) {
      updated = updated
        .map((cat) => ({
          ...cat,
          services: cat.services.filter((s) => s.availability === "Available"),
        }))
        .filter((cat) => cat.services.length > 0);
    }
    setFilteredCategories(updated);
    setIsLoading(false);
  }, [search, selectedFilterCategory, onlyAvailable]);

  const toggleOnlyAvailable = () => {
    setFilterLoading(true);
    setTimeout(() => {
      setOnlyAvailable((prev) => !prev);
      setFilterLoading(false);
    }, 800);
  };

  const openServiceDescription = (svc) => {
    navigation.navigate("SuperPlannerEventDescriptionScreen", {
      service: svc,
      packageId: route.params?.packageId,
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.outerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("SuperPlannerDashboard")}
          accessibilityLabel="Go back to dashboard"
        >
          <Ionicons name="arrow-back" size={24} color={colors.buttonText} />
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.text} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search for services..."
              placeholderTextColor={colors.placeholder}
              value={search}
              onChangeText={(txt) => debouncedSearch(txt)}
              style={styles.searchInput}
              accessibilityLabel="Search services"
            />
            <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
              <Ionicons name="filter" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={toggleOnlyAvailable} activeOpacity={0.8} accessibilityLabel={onlyAvailable ? "Show all services" : "Show only available services"}>
            <LinearGradient colors={["#B12A90", "#8E1C6C"]} style={styles.availabilityButton}>
              {filterLoading ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
                <Text style={styles.availabilityButtonText}>
                  {onlyAvailable ? "Show All" : "Show Only Available"}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <Modal transparent visible={filterModalVisible} animationType="slide" onRequestClose={() => setFilterModalVisible(false)} accessibilityLabel="Filter modal">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filter by Category</Text>
                <TouchableOpacity onPress={() => { setSelectedFilterCategory("All"); setFilterModalVisible(false); }}>
                  <Text style={styles.modalItem}>All</Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                  <TouchableOpacity key={cat.id} onPress={() => { setSelectedFilterCategory(cat.name); setFilterModalVisible(false); }}>
                    <Text style={styles.modalItem}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Text style={styles.modalClose}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.button} style={styles.loadingIndicator} />
          ) : (
            <>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <View key={cat.id} style={styles.categoryBlock}>
                    <Text style={styles.categoryTitle}>{cat.name}</Text>
                    <View style={styles.cardRow}>
                      {cat.services.map((svc) => (
                        <TouchableOpacity
                          key={svc.id}
                          style={styles.card}
                          onPress={() => openServiceDescription(svc)}
                          accessibilityLabel={`View details for ${svc.name}`}
                        >
                          <Image source={svc.image} style={styles.cardImage} accessible={true} accessibilityLabel={`Image for ${svc.name}`} />
                          <Text style={styles.cardTitle}>{svc.name}</Text>
                          <Text style={styles.cardPrice}>{svc.price}</Text>
                          <Text style={[styles.availabilityText, { color: svc.availability === "Unavailable" ? "red" : "green" }]}>
                            {svc.availability}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No services found. Try adjusting your filters.</Text>
                </View>
              )}
            </>
          )}
          <View style={{ height: 80 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    minHeight: Platform.OS === "web" ? "100vh" : undefined,
  },
  outerContainer: {
    flex: 1,
    position: "relative",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    margin: 10,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    marginLeft: 5,
  },
  scrollArea: {
    flex: 1,
    ...(Platform.OS === "web" && { maxHeight: "calc(100vh - 60px)" }),
  },
  scrollContent: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
  },
  availabilityButton: {
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  availabilityButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 10,
  },
  modalClose: {
    color: colors.button,
    textAlign: "right",
    marginTop: 10,
    fontSize: 16,
  },
  categoryBlock: {
    marginBottom: 25,
  },
  categoryTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    width: Platform.OS === "web" ? "calc(33% - 10px)" : "48%",
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 5,
    resizeMode: "cover",
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  cardPrice: {
    color: colors.text,
    marginBottom: 3,
  },
  availabilityText: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyStateText: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  loadingIndicator: {
    marginTop: 50,
  },
});

export default SuperPlannerExploreSearchScreen;
