// screens/CheckoutScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import * as FileSystem from "expo-file-system";

const cartFilePath = FileSystem.documentDirectory + "cart.txt";

const colors = {
  background: "#1E0B32",
  button: "#B12A90",
  buttonText: "#FFFFFF",
  text: "#D0CDE1",
  cardBackground: "#3C1C64",
  itemBackground: "#2A1B4A",
};

const CheckoutScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [totalSum, setTotalSum] = useState(0);

  const loadCart = async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(cartFilePath);
      if (fileExists.exists) {
        const data = await FileSystem.readAsStringAsync(cartFilePath);
        const parsedData = JSON.parse(data);
        setCart(parsedData);
        calculateTotal(parsedData);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const removeFromCart = async (serviceId) => {
    try {
      const updatedCart = cart.filter((item) => item.id !== serviceId);
      await FileSystem.writeAsStringAsync(cartFilePath, JSON.stringify(updatedCart));
      setCart(updatedCart);
      calculateTotal(updatedCart);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      await FileSystem.writeAsStringAsync(cartFilePath, JSON.stringify([]));
      setCart([]);
      setModalVisible(true);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const calculateTotal = (cartItems) => {
    const sum = cartItems.reduce((acc, item) => {
      const priceWithoutDollar = item.price.replace(/[^0-9.]/g, ''); // Remove '$' and non-numeric characters
      const parsedPrice = parseFloat(priceWithoutDollar);
      
      if (!isNaN(parsedPrice)) {
        return acc + parsedPrice;
      }
      return acc; // Skip invalid values
    }, 0);
  
    setTotalSum(sum);
  };  
  

  const handlePayment = async () => {
    await clearCart();
    setPaymentModalVisible(false);
    setModalVisible(true);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
      {/* Success Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: colors.cardBackground, padding: 20, borderRadius: 10, alignItems: "center", width: "80%" }}>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Success</Text>
            <Text style={{ color: colors.text, fontSize: 16, marginBottom: 20 }}>Cart has been cleared!</Text>
            <TouchableOpacity 
              style={{ backgroundColor: colors.button, padding: 10, borderRadius: 8, width: "80%", alignItems: "center" }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: colors.buttonText, fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal transparent={true} visible={paymentModalVisible} animationType="fade">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: colors.cardBackground, padding: 20, borderRadius: 10, alignItems: "center", width: "80%" }}>
            <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Order Summary</Text>
            <FlatList
              data={cart}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={{ color: colors.text, fontSize: 16, marginBottom: 5 }}>{item.price}</Text>
              )}
            />
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "bold", marginVertical: 10 }}>--------</Text>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>Total: {totalSum.toFixed(2)}</Text>
            <TouchableOpacity 
              style={{ backgroundColor: colors.button, padding: 10, borderRadius: 8, width: "80%", alignItems: "center", marginBottom: 10 }}
              onPress={handlePayment}
            >
              <Text style={{ color: colors.buttonText, fontSize: 16 }}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
              <Text style={{ color: colors.button, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cart Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: "bold" }}>Your Cart</Text>
        {cart.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={{ backgroundColor: colors.button, padding: 6, borderRadius: 5 }}>
            <Text style={{ color: colors.buttonText, fontSize: 14 }}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "bold" }}>Your added services will appear here.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: colors.itemBackground, borderRadius: 8, marginBottom: 15, padding: 10, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: "bold" }}>{item.name} - {item.price}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <View style={{ width: 25, height: 4, backgroundColor: colors.button, borderRadius: 2 }} />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Pay Button */}
          <TouchableOpacity 
            style={{ backgroundColor: colors.button, padding: 15, borderRadius: 8, marginTop: 20, alignItems: "center" }}
            onPress={() => setPaymentModalVisible(true)}
          >
            <Text style={{ color: colors.buttonText, fontSize: 18, fontWeight: "bold" }}>Pay</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default CheckoutScreen;
