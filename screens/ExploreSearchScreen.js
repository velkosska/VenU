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

const colors = {
  background: "#1E0B32",      // Dark Purple
  inputBackground: "#3C1C64", // Slightly Lighter Purple
  button: "#B12A90",         // Magenta
  buttonText: "#FFFFFF",     // White
  text: "#D0CDE1",           // Light Grayish Purple
  placeholder: "#9B8CAD",    // Muted Purple
};

const categories = [
  // same data as before
  {
    id: "1",
    name: "Venues",
    services: [
      {
        id: "1a",
        name: "Community Hall",
        price: "€500",
        availability: "Available",
        image: require("../assets/venue1.jpg"),
      },
      {
        id: "1b",
        name: "Prestige Banquet Hall",
        price: "€2000",
        availability: "Unavailable",
        image: require("../assets/venue2.jpg"),
      },
      {
        id: "1c",
        name: "Skyline Terrace",
        price: "€3000",
        availability: "Available",
        image: require("../assets/venue3.jpg"),
      },
      {
        id: "1d",
        name: "Luxury Grand Ballroom",
        price: "€10000",
        availability: "Available",
        image: require("../assets/venue4.jpg"),
      },
    ],
  },
  {
    id: "2",
    name: "Catering Services",
    services: [
      {
        id: "2a",
        name: "Budget Catering",
        price: "€300",
        availability: "Available",
        image: require("../assets/catering1.jpg"),
      },
      {
        id: "2b",
        name: "Tasteful Bites Catering",
        price: "€1300",
        availability: "Available",
        image: require("../assets/catering2.jpg"),
      },
      {
        id: "2c",
        name: "Vegan Delights",
        price: "€1400",
        availability: "Available",
        image: require("../assets/catering3.jpg"),
      },
      {
        id: "2d",
        name: "Michelin Star Catering",
        price: "€5000",
        availability: "Unavailable",
        image: require("../assets/catering4.jpg"),
      },
    ],
  },
  {
    id: "3",
    name: "Entertainment Providers",
    services: [
      {
        id: "3a",
        name: "Local DJ",
        price: "€150",
        availability: "Available",
        image: require("../assets/dj1.jpg"),
      },
      {
        id: "3b",
        name: "DJ Royale",
        price: "€500",
        availability: "Available",
        image: require("../assets/dj2.jpg"),
      },
      {
        id: "3c",
        name: "Live Band Symphony",
        price: "€1200",
        availability: "Unavailable",
        image: require("../assets/band1.jpg"),
      },
      {
        id: "3d",
        name: "Celebrity Performer",
        price: "€15000",
        availability: "Unavailable",
        image: require("../assets/celebrity.jpg"),
      },
    ],
  },
  {
    id: "4",
    name: "Photographers & Videographers",
    services: [
      {
        id: "4a",
        name: "Student Photographer",
        price: "€50",
        availability: "Available",
        image: require("../assets/photographer1.jpg"),
      },
      {
        id: "4b",
        name: "Photographer Betty",
        price: "€110",
        availability: "Available",
        image: require("../assets/photographer2.jpg"),
      },
      {
        id: "4c",
        name: "Cinematic Videography",
        price: "€700",
        availability: "Available",
        image: require("../assets/videographer1.jpg"),
      },
      {
        id: "4d",
        name: "Luxury Wedding Filmmaking",
        price: "€5000",
        availability: "Unavailable",
        image: require("../assets/videographer2.jpg"),
      },
    ],
  },
  {
    id: "5",
    name: "Transportation Services",
    services: [
      {
        id: "5a",
        name: "Standard Taxi",
        price: "€50",
        availability: "Available",
        image: require("../assets/taxi1.jpg"),
      },
      {
        id: "5b",
        name: "Luxury Chauffeur",
        price: "€200",
        availability: "Available",
        image: require("../assets/transport1.jpg"),
      },
      {
        id: "5c",
        name: "Classic Car Rentals",
        price: "€350",
        availability: "Available",
        image: require("../assets/transport2.jpg"),
      },
      {
        id: "5d",
        name: "Private Jet Rental",
        price: "€25000",
        availability: "Unavailable",
        image: require("../assets/privatejet.jpg"),
      },
    ],
  },
];

const ExploreSearchScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    let updated = categories;

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
          services: cat.services.filter(
            (s) => s.availability === "Available"
          ),
        }))
        .filter((cat) => cat.services.length > 0);
    }
    setFilteredCategories(updated);
  }, [search, selectedFilterCategory, onlyAvailable]);

  const handleSearch = (text) => setSearch(text);

  const toggleOnlyAvailable = () => {
    setFilterLoading(true);
    setTimeout(() => {
      setOnlyAvailable((prev) => !prev);
      setFilterLoading(false);
    }, 800);
  };

  // Renders each category with its services
  const renderCategory = (cat) => (
    <View key={cat.id} style={styles.categoryBlock}>
      <Text style={styles.categoryTitle}>{cat.name}</Text>
      <View style={styles.cardRow}>
        {cat.services.map((svc) => (
          <TouchableOpacity
            key={svc.id}
            style={styles.card}
            onPress={() => navigation.navigate("ServiceDescription", { service: svc })}
          >
            <Image source={svc.image} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{svc.name}</Text>
            <Text style={styles.cardPrice}>{svc.price}</Text>
            <Text
              style={[
                styles.availabilityText,
                {
                  color: svc.availability === "Unavailable" ? "red" : "green",
                },
              ]}
            >
              {svc.availability}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.outerContainer}>
        {/* SCROLLABLE CONTENT */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
        >
          {/* SEARCH BAR */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={colors.text}
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Search for services..."
              placeholderTextColor={colors.placeholder}
              value={search}
              onChangeText={handleSearch}
              style={styles.searchInput}
            />
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons name="filter" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* AVAILABILITY BUTTON */}
          <TouchableOpacity onPress={toggleOnlyAvailable} activeOpacity={0.8}>
            <LinearGradient
              colors={["#B12A90", "#8E1C6C"]}
              style={styles.availabilityButton}
            >
              {filterLoading ? (
                <ActivityIndicator color={colors.buttonText} />
              ) : (
                <Text style={styles.availabilityButtonText}>
                  {onlyAvailable ? "Show All" : "Show Only Available"}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* FILTER MODAL */}
          <Modal
            transparent
            visible={filterModalVisible}
            animationType="slide"
            onRequestClose={() => setFilterModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filter by Category</Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedFilterCategory("All");
                    setFilterModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItem}>All</Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      setSelectedFilterCategory(cat.name);
                      setFilterModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItem}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={styles.modalClose}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* CATEGORY LISTS */}
          {filteredCategories.map(renderCategory)}

          {/* SPACER so last cards not hidden */}
          <View style={{ height: 80 }} />
        </ScrollView>

        {/* NAV BAR PINNED */}
        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => navigation.navigate("HomeScreen")}
            style={styles.navItem}
          >
            <Ionicons name="home-outline" size={22} color={colors.buttonText} />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ExploreSearch")}
            style={styles.navItem}
          >
            <Ionicons
              name="search-outline"
              size={22}
              color={colors.buttonText}
            />
            <Text style={styles.navText}>Explore</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Chatbot")}
            style={styles.navItem}
          >
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={colors.buttonText}
            />
            <Text style={styles.navText}>Chatbot</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("CheckoutScreen")}
            style={styles.navItem}
          >
            <Ionicons name="cart-outline" size={22} color={colors.buttonText} />
            <Text style={styles.navText}>My Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    // Fill viewport on web
    minHeight: Platform.OS === "web" ? "100vh" : undefined,
  },
  outerContainer: {
    flex: 1,
    position: "relative", // So nav bar can be pinned at bottom
  },
  scrollArea: {
    flex: 1,
    // On web, ensure the scroll area fits above the nav bar
    ...(Platform.OS === "web" && { maxHeight: "calc(100vh - 60px)" }),
  },
  scrollContent: {
    padding: 20,
  },
  // SEARCH
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
  // AVAILABILITY BUTTON
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
  // MODAL
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
  // CATEGORIES
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
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
    width: Platform.OS === "web" ? "31%" : "48%",
    // Some spacing on web so we get 3 columns in a row
    ...(Platform.OS === "web" && { marginBottom: 20 }),
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
  // NAV BAR
  navBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: colors.inputBackground,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 9999,
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navText: {
    color: colors.text,
    fontSize: 12,
    marginTop: 2,
  },
});

export default ExploreSearchScreen;
