import { Camera, CameraType } from "expo-camera/legacy";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [qrValue, setQrValue] = useState(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setQrValue(data);
    console.log(
      `Bar code with type ${type} and data ${data} has been scanned!`
    );
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.buttonContainer}>
          {scanned && (
            <TouchableOpacity
              onPress={() => setScanned(false)}
              style={styles.button}
            >
              <Text style={styles.text}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </Camera>
      {scanned && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Scanned QR Code: {qrValue}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
