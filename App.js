// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import RoleSelectionScreen from "./screens/RoleSelectionScreen";
import EventDetailsScreen from "./screens/EventDetailsScreen";
import ExploreSearchScreen from "./screens/ExploreSearchScreen";
import ServiceDescriptionScreen from "./screens/ServiceDescriptionScreen"; 
import HomeScreen from "./screens/HomeScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import ChatbotScreen from "./screens/ChatbotScreen";
import ServiceProviderDashboard from "./screens/ServiceProviderDashboard";
// New SuperPlanner screens
import SuperPlannerDashboard from "./screens/SuperPlannerDashboard";
import PackageDetailScreen from "./screens/PackageDetailScreen";
import SuperPlannerExploreSearchScreen from "./screens/SuperPlannerExploreSearchScreen";
import SuperPlannerEventDescriptionScreen from "./screens/SuperPlannerEventDescriptionScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="ExploreSearch" component={ExploreSearchScreen} />
        <Stack.Screen name="ServiceDescription" component={ServiceDescriptionScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        <Stack.Screen name="ServiceProviderDashboard" component={ServiceProviderDashboard} />
        <Stack.Screen name="SuperPlannerDashboard" component={SuperPlannerDashboard} />
        <Stack.Screen name="PackageDetailScreen" component={PackageDetailScreen} />
        <Stack.Screen name="SuperPlannerExploreSearchScreen" component={SuperPlannerExploreSearchScreen} />
        <Stack.Screen name="SuperPlannerEventDescriptionScreen" component={SuperPlannerEventDescriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
