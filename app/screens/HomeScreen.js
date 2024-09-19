import React, { useState, useEffect, useCallback } from "react";
import { Text, View, FlatList, Pressable, ScrollView } from "react-native";
import { useTheme, useToast, useRes } from "../../contexts";
import axios from "../../config/axios";
import screenStyles from "../../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";
import { Drawer, Button } from "react-native-paper";

const HomeScreen = React.memo(({ navigation }) => {
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  const [isVisible, setIsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log("ScreenA is focused");
      return () => {
        console.log("ScreenA is unfocused");
      };
    }, [])
  );

  const ShowMessages = (textH, textT, color) => {
    Toast.show({
      type: "customToast",
      text1: textH,
      text2: textT,
      text1Style: [styles.text, { color: colors.palette.dark }],
      text2Style: [styles.text, { color: colors.palette.dark }],
    });
  };

  console.log("Home");

  const handleMenu = (item) => {
    navigation.navigate(item);
  };

  return (
    <React.Fragment>
      <Drawer.Section title="Menu" showDivider={isVisible}>
        <Drawer.Item
          style={{ backgroundColor: "#64ffda" }}
          icon="star"
          label="Machine Group"
          onPress={() => handleMenu("Machine Group")}
        />
        <Drawer.Item
          style={{ backgroundColor: "#64ffda" }}
          icon="star"
          label="Machine"
          onPress={() => handleMenu("Machine")}
        />
        <Drawer.Item
          style={{ backgroundColor: "#64ffda" }}
          icon="star"
          label="Check List"
          onPress={() => handleMenu("Check List")}
        />
        <Drawer.Item
          style={{ backgroundColor: "#64ffda" }}
          icon="star"
          label="Check List Option"
          onPress={() => handleMenu("Check List Option")}
        />
        <Drawer.Item
          style={{ backgroundColor: "#64ffda" }}
          icon="star"
          label="Group Check List Option"
          onPress={() => handleMenu("Group Check List Option")}
        />
        <Drawer.Item
          style={{ backgroundColor: "#64ffda" }}
          icon="star"
          label="Match Check List Option"
          onPress={() => handleMenu("Match Check List Option")}
        />
        <Drawer.Item
          style={{ backgroundColor: "#64ffda" }}
          icon="star"
          label="Forms"
          onPress={() => handleMenu("Forms")}
        />
        <Drawer.Item
          style={{ backgroundColor: "#64ffda" }}
          icon="star"
          label="Match Form & Machine"
          onPress={() => handleMenu("Match Form & Machine")}
        />
      </Drawer.Section>
      <Button onPress={() => setIsVisible(true)}>Show Menu</Button>
    </React.Fragment>
  );
});

export default HomeScreen;
