import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";

const PACKAGES_FILE = FileSystem.documentDirectory + "packages.txt";
const LOCALSTORAGE_KEY = "packages.txt";

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
];

const PackageDetailScreen = ({ route, navigation }) => {
  const { packageId } = route.params || {};
  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        allPackages = fileInfo.exists
          ? JSON.parse(await FileSystem.readAsStringAsync(PACKAGES_FILE))
          : [];
      }
      const pkg = allPackages.find((p) => String(p.id) === String(packageId));
      setPackageData(pkg || null);
    } catch (error) {
      console.error("Error loading package:", error);
      Alert.alert("Error", "Failed to load package");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPackage();
    }, [packageId])
  );

  const copyLink = () => {
    if (packageData?.affiliateLink) {
      if (Platform.OS === "web") {
        navigator.clipboard.writeText(packageData.affiliateLink).then(
          () => Alert.alert("Link Copied!"),
          () => Alert.alert("Error copying link")
        );
      } else {
        Clipboard.setString(packageData.affiliateLink);
        Alert.alert("Link Copied!", packageData.affiliateLink);
      }
    }
  };

  if (!packageId) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <Text style={styles.noData}>No package ID provided.</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ActivityIndicator size="large" color={colors.button} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (!packageData) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <Text style={styles.noData}>Package details not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.outerContainer}>
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          {/* Title & Description */}
          <Text style={styles.title}>{packageData.title}</Text>
          <Text style={styles.description}>{packageData.description}</Text>

          {/* Copy Link Button */}
          <TouchableOpacity style={styles.copyButton} onPress={copyLink}>
            <Text style={styles.copyButtonText}>Copy Link</Text>
          </TouchableOpacity>

          {/* Already Added Services */}
          <View style={styles.servicesContainer}>
            {packageData.services?.length > 0 ? (
              packageData.services.map((service, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.serviceCard}
                  onPress={() =>
                    navigation.navigate("SuperPlannerEventDescriptionScreen", {
                      service,
                      packageId,
                    })
                  }
                >
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.servicePrice}>{service.price}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noServices}>No services added yet.</Text>
            )}
          </View>

          {/* Recommended Services */}
          <Text style={styles.sectionTitle}>Recommended Services</Text>
          {categories.map((cat) => (
            <View key={cat.id} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{cat.name}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {cat.services.map((svc) => (
                  <TouchableOpacity
                    key={svc.id}
                    onPress={() =>
                      navigation.navigate("SuperPlannerEventDescriptionScreen", {
                        service: svc,
                        packageId: packageData.id,
                      })
                    }
                    style={styles.recommendedCard}
                  >
                    <Image source={svc.image} style={styles.recommendedImage} />
                    <Text style={styles.recommendedName}>{svc.name}</Text>
                    <Text
                      style={[
                        styles.availability,
                        { color: svc.availability === "Unavailable" ? "red" : "green" },
                      ]}
                    >
                      {svc.availability}
                    </Text>
                    <Text style={styles.recommendedPrice}>{svc.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
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
  scrollArea: {
    flex: 1,
    ...(Platform.OS === "web" && { maxHeight: "calc(100vh)" }),
  },
  scrollContent: {
    padding: 20,
    alignItems: "center", // center everything horizontally
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  copyButton: {
    backgroundColor: colors.button,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  copyButtonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  servicesContainer: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center", // center cards in the container
  },
  serviceCard: {
    backgroundColor: colors.inputBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: 280, // fixed width so they appear centered
    alignItems: "center",
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
  },
  servicePrice: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
  },
  noServices: {
    color: colors.text,
    fontStyle: "italic",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 30,
    marginBottom: 10,
    textAlign: "center",
  },
  categorySection: {
    marginBottom: 25,
    width: "100%",
    alignItems: "center", // center the category title & scroller
  },
  categoryTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    alignSelf: "center",
  },
  horizontalScrollContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  recommendedCard: {
    backgroundColor: colors.inputBackground,
    marginRight: 12,
    padding: 10,
    borderRadius: 10,
    width: 140,
    alignItems: "center",
  },
  recommendedImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
    marginBottom: 6,
  },
  recommendedName: {
    color: colors.text,
    fontWeight: "bold",
    textAlign: "center",
  },
  availability: {
    fontSize: 12,
    textAlign: "center",
  },
  recommendedPrice: {
    color: colors.text,
    fontSize: 14,
    textAlign: "center",
  },
  noData: {
    color: colors.text,
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});

export default PackageDetailScreen;
