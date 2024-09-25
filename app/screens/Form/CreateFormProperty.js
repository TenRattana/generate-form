import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Inputs } from "../../components";

const App = () => {
  const [qrValue, setQrValue] = useState("");

  const generateQR = (value) => {
    return (
      <QRCode
        value={value || "No input"}
        size={200}
        color="black"
        backgroundColor="white"
      />
    );
  };

  const handleChange = (value) => {
    setQrValue(value);
  };

  return (
    <View style={styles.container}>
      <Inputs
        placeholder=""
        label="QR Code Example"
        value={qrValue}
        handleChange={handleChange}
      />
      {generateQR(qrValue)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default App;
