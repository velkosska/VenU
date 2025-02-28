// screens/OnboardingScreen.js
import React, { useRef, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Plan Your Event in Minutes",
    description: "From venues to catering, book everything in one place",
    image: require("../assets/onboarding1.jpg"),
  },
  {
    id: "2",
    title: "Find the Perfect Venue!",
    description: "Explore a wide selection of unique venues for any occasion",
    image: require("../assets/onboarding2.jpg"),
  },
  {
    id: "3",
    title: "Book Services with Ease!",
    description: "Easily compare and book services from trusted providers",
    image: require("../assets/onboarding3.jpg"),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace("Login"); // Replace with actual next screen
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width, alignItems: "center" }}>
            <Image source={item.image} style={{ width, height: height * 0.6, resizeMode: "cover" }} />
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 }}>{item.title}</Text>
              <Text style={{ fontSize: 16, color: "#aaa", textAlign: "center" }}>{item.description}</Text>
            </View>
          </View>
        )}
      />
      <View style={{ position: "absolute", bottom: 30, width: "100%", alignItems: "center" }}>
        <TouchableOpacity
          onPress={handleNext}
          style={{ backgroundColor: "#007bff", padding: 15, borderRadius: 10, width: "80%", alignItems: "center" }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
