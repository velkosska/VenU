// screens/EventDetailsScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";


const colors = {
  background: "#1E0B32", // Dark Purple
  button: "#B12A90", // Magenta
  buttonText: "#FFFFFF", // White
  text: "#D0CDE1", // Light Grayish Purple
  inputBackground: "#3C1C64", // Slightly Lighter Purple
  border: "#B12A90" // Magenta Border
};

const EventDetailsScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [region, setRegion] = useState("Madrid");
  const [guests, setGuests] = useState(250);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: colors.text, marginBottom: 15, textAlign: 'center' }}>Select your Date</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={{ padding: 12, backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 15, alignItems: 'center' }}>
        <Text style={{ color: colors.text, fontSize: 18 }}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text, marginBottom: 10, textAlign: 'center' }}>Region</Text>
      <TextInput
        placeholder="Enter region"
        placeholderTextColor={colors.text}
        value={region}
        onChangeText={setRegion}
        style={{ padding: 12, backgroundColor: colors.inputBackground, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginBottom: 15, textAlign: 'center' }}
      />

      <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text, marginBottom: 10, textAlign: 'center' }}>Estimate of Guests</Text>
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
      <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", color: colors.text, marginBottom: 20 }}>{guests}</Text>
      
      <TouchableOpacity 
        style={{ backgroundColor: colors.button, padding: 15, borderRadius: 8, alignItems: "center" }}
        onPress={() => navigation.navigate("ExploreSearch")}
      >
        <Text style={{ color: colors.buttonText, fontSize: 18, fontWeight: "bold" }}>Get Started!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EventDetailsScreen;