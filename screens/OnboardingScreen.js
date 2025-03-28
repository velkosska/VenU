import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Plan Your Event in Minutes",
    description: "From venues to catering, book everything in one place.",
    image: require("../assets/onboarding1.jpg"),
  },
  {
    id: "2",
    title: "Find the Perfect Venue!",
    description: "Explore a wide selection of unique venues for any occasion.",
    image: require("../assets/onboarding2.jpg"),
  },
  {
    id: "3",
    title: "Book Services with Ease!",
    description: "Easily compare and book services from trusted providers.",
    image: require("../assets/onboarding3.jpg"),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      // Immediately update the state to reflect the next slide
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
    } else {
      navigation.replace("Login");
    }
  };

  const handleSkip = () => {
    navigation.replace("Login");
  };

  const onMomentumScrollEnd = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const renderItem = ({ item }) => (
    <View style={{ width, alignItems: "center" }}>
      <Image
        source={item.image}
        style={{ width, height: height * 0.6, resizeMode: "cover" }}
        accessible
        accessibilityLabel={item.title}
      />
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#fff",
            marginBottom: 10,
          }}
        >
          {item.title}
        </Text>
        <Text style={{ fontSize: 16, color: "#aaa", textAlign: "center" }}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" />

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={renderItem}
      />

      {/* Only show pagination dots on mobile */}
      {Platform.OS !== "web" && (
        <View
          style={{
            position: "absolute",
            bottom: 150,
            width: "100%",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  backgroundColor: currentIndex === index ? "#fff" : "#888",
                  margin: 5,
                }}
              />
            ))}
          </View>
        </View>
      )}

      {/* Navigation Buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 30,
          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: "#B12A90",
            padding: 15,
            borderRadius: 10,
            width: "80%",
            alignItems: "center",
          }}
          accessible
          accessibilityLabel="Next or Get Started"
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSkip}
          style={{ marginTop: 10 }}
          accessible
          accessibilityLabel="Skip Onboarding"
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
