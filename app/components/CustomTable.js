import React, { useRef, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, Animated } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import customtableStyle from "../styles/components/customtable";
import { useTheme, useToast, useRes } from "../contexts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const CustomTable = ({
  Tabledata,
  Tablehead,
  flexArr,
  handleAction,
  actionIndex,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [action, setAction] = useState([]);
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = customtableStyle({ colors, spacing, fonts, responsive });

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressAction = () => {
    setIsActive((prev) => !prev);
    Animated.timing(colorAnim, {
      toValue: isActive ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["lightgray", "lightblue"],
  });

  const iconColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["gray", "green"],
  });

  console.log("CustomTable");

  useMemo(() => {
    if (actionIndex && Array.isArray(actionIndex)) setAction(actionIndex || []);
    else setAction([]);
  }, [actionIndex]);

  const renderActionButton = (data, action) => {
    const handlePress = () => {
      handleAction(action, data);
    };

    switch (action) {
      case "activeIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <MaterialCommunityIcons
              name="fridge-industrial"
              size={20}
              color={colors.palette.primary}
            />
          </Pressable>
        );

      case "editIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <AntDesign name="edit" size={20} color={colors.palette.primary} />
          </Pressable>
        );
      case "delIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <AntDesign name="delete" size={20} color={colors.palette.danger} />
          </Pressable>
        );
      case "changeIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <FontAwesome6
              name="edit"
              size={20}
              color={colors.palette.primary}
            />
          </Pressable>
        );
      case "copyIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <AntDesign name="copy1" size={20} color={colors.palette.danger} />
          </Pressable>
        );
      case "preIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <AntDesign name="copy1" size={20} color={colors.palette.danger} />
          </Pressable>
        );
      default:
        return null;
    }
  };

  const renderCellContent = (cell) => {
    if (typeof cell === "boolean") {
      return (
        <View style={styles.iconStatus}>
          <MaterialCommunityIcons
            name={cell ? "toggle-switch" : "toggle-switch-off-outline"}
            size={35}
            color={cell ? colors.palette.green : colors.palette.primary}
          />
        </View>
      );
    }
    return <Text style={styles.text}>{cell}</Text>;
  };

  const rowsData = Tabledata.map((rowData, headerIndex) =>
    responsive === "small"
      ? action.map((v, actionIndex) => (
          <View key={headerIndex} style={styles.cardRow}>
            {Tablehead.map((header, i) => (
              <View key={i} style={{ marginBottom: spacing.xs }}>
                <Text style={styles.titleStyled}>{header}:</Text>
                {rowData[i]}
              </View>
            ))}
            <View style={{ flexDirection: "row", marginTop: spacing.md }}>
              {Object.entries(v).map(([key, value]) => (
                <React.Fragment key={`${headerIndex}-${actionIndex}-${key}`}>
                  {value >= 0 && renderActionButton(rowData[value], key)}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))
      : rowData.map((cellData, cellIndex) =>
          action.map((v, actionIndex) => {
            const filteredEntries = Object.entries(v).filter(
              ([key, value]) => value === cellIndex
            );

            return filteredEntries.length > 0 ? (
              filteredEntries.map(([key, value]) => (
                <React.Fragment key={`${headerIndex}-${actionIndex}-${key}`}>
                  {renderActionButton(rowData[value], key)}
                </React.Fragment>
              ))
            ) : (
              <React.Fragment
                key={`${headerIndex}-${actionIndex}-${cellIndex}`}
              >
                {renderCellContent(cellData)}
              </React.Fragment>
            );
          })
        )
  );

  return responsive === "small" ? (
    rowsData
  ) : (
    <ScrollView contentContainerStyle={styles.containerTable}>
      <Table>
        <Row
          data={Tablehead}
          style={styles.head}
          textStyle={styles.textHead}
          flexArr={flexArr}
        />
        {Tabledata.length == 0 ? (
          <Text
            style={{ alignSelf: "center", padding: 10, fontStyle: "italic" }}
          >
            Not found your data...
          </Text>
        ) : (
          <Rows
            data={rowsData}
            style={styles.row}
            textStyle={styles.text}
            flexArr={flexArr}
          />
        )}
      </Table>
    </ScrollView>
  );
};
