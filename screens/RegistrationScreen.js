// screens/RegistrationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const colors = {
  background: "#1E0B32",         // Dark Purple
  inputBackground: "#3C1C64",      // Slightly Lighter Purple
  button: "#B12A90",             // Magenta
  buttonText: "#FFFFFF",         // White
  text: "#D0CDE1",              // Light Grayish Purple
  placeholder: "#9B8CAD",       // Muted Purple
};

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureEntryConfirm, setSecureEntryConfirm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    // Simple email regex for demo purposes
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = () => {
    setErrorMessage("");
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Simulate a registration process; replace with your registration API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Registration successful!", [
        { text: "OK", onPress: () => navigation.navigate("Login") }
      ]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TextInput
        placeholder="Name"
        placeholderTextColor={colors.placeholder}
        value={name}
        onChangeText={setName}
        style={styles.input}
        accessible
        accessibilityLabel="Name input"
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        accessible
        accessibilityLabel="Email input"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureEntry}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          accessible
          accessibilityLabel="Password input"
        />
        <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)} accessible accessibilityLabel="Toggle password visibility">
          <Ionicons name={secureEntry ? "eye-off" : "eye"} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor={colors.placeholder}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secureEntryConfirm}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          accessible
          accessibilityLabel="Confirm Password input"
        />
        <TouchableOpacity onPress={() => setSecureEntryConfirm(!secureEntryConfirm)} accessible accessibilityLabel="Toggle confirm password visibility">
          <Ionicons name={secureEntryConfirm ? "eye-off" : "eye"} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister} accessible accessibilityLabel="Register button">
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate("Login")} accessible accessibilityLabel="Login link">
        <Text style={styles.loginText}>Already a user? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 30,
  },
  input: {
    width: "80%",
    padding: 12,
    backgroundColor: colors.inputBackground,
    color: colors.text,
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: colors.button,
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 15,
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: colors.button, // Use pink color for consistency
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default RegistrationScreen;
