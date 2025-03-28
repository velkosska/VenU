import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import Slider from "@react-native-community/slider";
import axios from "axios";
import * as FileSystem from "expo-file-system";

const OPENAI_API_KEY = "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"; // Replace with your OpenAI API key

const colors = {
  background: "#1E0B32",
  button: "#B12A90",
  buttonText: "#FFFFFF",
  text: "#D0CDE1",
  inputBackground: "#3C1C64",
  border: "#B12A90",
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

const mapImagesToPackage = (pkg) => {
  const keys = ["venue", "catering", "entertainment"];
  keys.forEach((key) => {
    const serviceName = pkg[key]?.name;
    for (let category of categories) {
      const foundService = category.services.find(
        (service) => service.name === serviceName
      );
      if (foundService) {
        pkg[key].image = foundService.image;
        break;
      }
    }
    if (!pkg[key].image) {
      console.warn(`No image found for ${serviceName}`);
    }
  });
  return pkg;
};

const adjustPackagePrices = (pkg, budget) => {
  const keys = ["venue", "catering", "entertainment"];
  let prices = keys.map(
    (key) => parseFloat(pkg[key].price.replace(/[€,]/g, "")) || 0
  );
  const total = prices.reduce((acc, curr) => acc + curr, 0);
  const lowerBound = budget * 0.8;
  const upperBound = budget * 1.0;
  let factor = 1;

  if (total < lowerBound) {
    factor = lowerBound / total;
  } else if (total > upperBound) {
    factor = upperBound / total;
  }
  
  keys.forEach((key) => {
    const oldPrice = parseFloat(pkg[key].price.replace(/[€,]/g, "")) || 0;
    const newPrice = Math.round(oldPrice * factor);
    pkg[key].price = `€${newPrice}`;
  });
  
  return pkg;
};

const checkBudgetRange = (pkg, numericBudget) => {
  const venuePrice = parseFloat(pkg.venue.price.replace(/[€,]/g, ""));
  const cateringPrice = parseFloat(pkg.catering.price.replace(/[€,]/g, ""));
  const entertainmentPrice = parseFloat(pkg.entertainment.price.replace(/[€,]/g, ""));
  const total = venuePrice + cateringPrice + entertainmentPrice;
  
  const minAllowed = numericBudget * 0.8;
  const maxAllowed = numericBudget * 1.0;

  if (total < minAllowed) {
    console.warn(`Plan is under 80% of budget. (Cost: €${total}, Budget: €${numericBudget})`);
  } else if (total > maxAllowed) {
    console.warn(`Plan exceeds 100% of budget. (Cost: €${total}, Budget: €${numericBudget})`);
  } else {
    console.log(`Plan is between 80% and 100% of budget! (Cost: €${total}, Budget: €${numericBudget})`);
  }
};

const EventDetailsScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [region, setRegion] = useState("Madrid");
  const [guests, setGuests] = useState(250);
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [eventPackage, setEventPackage] = useState(null);

  const cartFilePath = FileSystem.documentDirectory + "cart.txt";

  const generateEventPackage = async () => {
    setLoading(true);
    try {
      let userPrompt = `Plan an event in ${region} for ${guests} guests using these options: ${JSON.stringify(categories)}.`;
      if (budget.trim() !== "") {
        userPrompt = `Plan an event in ${region} for ${guests} guests with a budget of €${budget}. 
Keep the total cost (venue, catering, entertainment) at least 80% of the budget, 
but do NOT exceed 100% of the budget. Use these options: ${JSON.stringify(categories)}.`;
      }

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an event planning assistant. Return only JSON. " +
                "The JSON must have 'venue', 'catering', and 'entertainment'. " +
                "If a budget is provided, keep total cost ≥80% and ≤100% of that budget.",
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const rawResponse = response.data.choices[0].message.content.trim();
      console.log("OpenAI Response:", rawResponse);

      if (!rawResponse.startsWith("{") || !rawResponse.endsWith("}")) {
        throw new Error("Invalid JSON from AI.");
      }

      let recommendedPackage = JSON.parse(rawResponse);
      recommendedPackage = mapImagesToPackage(recommendedPackage);

      if (budget.trim() !== "") {
        const numericBudget = parseFloat(budget.trim());
        recommendedPackage = adjustPackagePrices(recommendedPackage, numericBudget);
        checkBudgetRange(recommendedPackage, numericBudget);
      }

      setEventPackage(recommendedPackage);
      setPreviewVisible(true);
    } catch (error) {
      console.error("Error generating event package:", error);
      alert("Failed to generate an event package. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmEventPackage = async () => {
    try {
      const cartData = JSON.stringify([
        eventPackage.venue,
        eventPackage.catering,
        eventPackage.entertainment,
      ]);
      if (Platform.OS === "web") {
        localStorage.setItem("cart", cartData);
      } else {
        await FileSystem.writeAsStringAsync(cartFilePath, cartData);
      }
      setPreviewVisible(false);
      navigation.navigate("CheckoutScreen");
    } catch (error) {
      console.error("Error confirming package:", error);
      alert("Failed to confirm the event package. Please try again.");
    }
  };

  const cancelPreview = () => {
    setPreviewVisible(false);
    setEventPackage(null);
  };

  const content = (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={Platform.OS === "web" ? { maxHeight: "calc(100vh - 60px)" } : {}}
    >
      <View style={styles.container}>
        <Text style={styles.stepIndicator}>
          {previewVisible
            ? "Step 2 of 2: Review & Confirm Your Event Package"
            : "Step 1 of 2: Enter Your Event Details"}
        </Text>

        <Text style={styles.title}>Select Your Event Details</Text>

        <CalendarPicker
          onDateChange={setDate}
          selectedDayColor={colors.button}
          selectedDayTextColor={colors.buttonText}
          textStyle={{ color: colors.text }}
        />

        <Text style={styles.label}>Region</Text>
        <TextInput
          placeholder="Enter region"
          placeholderTextColor={colors.text}
          value={region}
          onChangeText={setRegion}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          blurOnSubmit
        />

        <Text style={styles.label}>Guests: {guests}</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={500}
          step={1}
          minimumTrackTintColor={colors.border}
          maximumTrackTintColor="#000000"
          thumbTintColor={colors.border}
          value={guests}
          onValueChange={setGuests}
        />

        <Text style={styles.label}>Budget (Optional)</Text>
        <TextInput
          placeholder="e.g. 2000"
          placeholderTextColor={colors.text}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          blurOnSubmit
          value={budget}
          onChangeText={setBudget}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={generateEventPackage} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.buttonText} />
          ) : (
            <Text style={styles.buttonText}>AI Plan My Event</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("ExploreSearch")}>
          <Text style={styles.secondaryButtonText}>Manually Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Chatbot")}>
          <Text style={styles.secondaryButtonText}>Chat With Bot</Text>
        </TouchableOpacity>

        <Modal
          transparent
          visible={previewVisible}
          animationType="slide"
          onRequestClose={cancelPreview}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Review Your Event Package</Text>
              <ScrollView style={styles.modalContent}>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Venue:</Text>{" "}
                  {eventPackage?.venue?.name || "N/A"} - {eventPackage?.venue?.price || ""}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Catering:</Text>{" "}
                  {eventPackage?.catering?.name || "N/A"} - {eventPackage?.catering?.price || ""}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.bold}>Entertainment:</Text>{" "}
                  {eventPackage?.entertainment?.name || "N/A"} - {eventPackage?.entertainment?.price || ""}
                </Text>
              </ScrollView>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={confirmEventPackage}>
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.inputBackground }]}
                  onPress={cancelPreview}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      {Platform.OS === "web" ? (
        content
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === "web" && { minHeight: "100vh" }),
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  stepIndicator: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 20,
    marginBottom: 5,
  },
  input: {
    padding: 12,
    backgroundColor: colors.inputBackground,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.button,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: colors.inputBackground,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackground: {
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
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },
  modalContent: {
    marginBottom: 20,
  },
  modalText: {
    color: colors.text,
    fontSize: 16,
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
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

export default EventDetailsScreen;
