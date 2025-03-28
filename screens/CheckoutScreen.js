import React, { useEffect, useState } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  Image, 
  StyleSheet,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const cartFilePath = FileSystem.documentDirectory + "cart.txt";

const colors = {
  background: "#1E0B32",
  button: "#B12A90",
  buttonText: "#FFFFFF",
  text: "#D0CDE1",
  cardBackground: "#3C1C64",
};

const CheckoutScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [totalSum, setTotalSum] = useState(0);

  const loadCart = async () => {
    try {
      let data;
      if (Platform.OS === "web") {
        data = localStorage.getItem("cart");
      } else {
        const fileInfo = await FileSystem.getInfoAsync(cartFilePath);
        if (fileInfo.exists) {
          data = await FileSystem.readAsStringAsync(cartFilePath);
        }
      }
      if (data) {
        const parsedData = JSON.parse(data);
        setCart(parsedData);
        calculateTotal(parsedData);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const calculateTotal = (cartItems) => {
    const sum = cartItems.reduce((acc, item) => {
      const priceString = item.price || "";
      const priceWithoutSymbol = priceString.replace(/[^0-9.]/g, "");
      const parsedPrice = parseFloat(priceWithoutSymbol);
      return !isNaN(parsedPrice) ? acc + parsedPrice : acc;
    }, 0);
    setTotalSum(sum);
  };

  const removeItemFromCart = async (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    calculateTotal(newCart);
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("cart", JSON.stringify(newCart));
      } else {
        await FileSystem.writeAsStringAsync(cartFilePath, JSON.stringify(newCart));
      }
    } catch (error) {
      console.error("Error updating cart file:", error);
    }
  };

  const handleBook = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("cart", JSON.stringify([]));
      } else {
        await FileSystem.writeAsStringAsync(cartFilePath, JSON.stringify([]));
      }
      setCart([]);
      setSuccessModalVisible(true);
    } catch (error) {
      console.error("Error booking event:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your event cart is empty.</Text>
          </View>
        ) : (
          <View style={styles.summaryContainer}>
            <Text style={styles.headerText}>Event Summary</Text>
            <FlatList
              data={cart}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.rowContainer}>
                  <Image source={item.image} style={styles.thumbnail} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <Text style={styles.priceText}>{item.price}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeItemFromCart(index)} style={styles.removeButton}>
                    <Ionicons name="trash" size={24} color={colors.button} />
                  </TouchableOpacity>
                </View>
              )}
            />
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: €{totalSum.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
              <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => navigation.navigate("ExploreSearch")}>
            <Text style={styles.navLinkText}>Explore</Text>
          </TouchableOpacity>
        </View>

        <Modal transparent visible={successModalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>Event has been successfully booked!</Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setSuccessModalVisible(false)}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  summaryContainer: {
    width: "100%",
  },
  headerText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: colors.cardBackground,
    borderBottomWidth: 1,
    width: "100%",
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
  priceText: {
    color: colors.text,
    fontSize: 18,
    textAlign: "right",
  },
  removeButton: {
    marginLeft: 10,
  },
  totalContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginVertical: 20,
  },
  totalText: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  bookButton: {
    backgroundColor: colors.button,
    paddingVertical: 15,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
  },
  bookButtonText: {
    color: colors.buttonText,
    fontSize: 22,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    width: "100%",
  },
  emptyText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  navLinks: {
    marginTop: 20,
    alignSelf: "center",
  },
  navLinkText: {
    color: colors.buttonText,
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: colors.cardBackground,
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: colors.button,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CheckoutScreen;
