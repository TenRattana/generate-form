import React, { useRef, useMemo, useState } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { DataTable } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import customtableStyle from "../../../styles/components/customtable";
import { useTheme, useRes } from "../../../contexts";

const CustomTable = ({
  Tabledata,
  Tablehead,
  flexArr,
  handleAction,
  actionIndex,
}) => {
  const [action, setAction] = useState([]);

  const { colors, fonts, spacing } = useTheme();
  const { responsive } = useRes();
  const styles = customtableStyle({ colors, spacing, fonts, responsive });

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useMemo(() => {
    if (actionIndex && Array.isArray(actionIndex)) setAction(actionIndex || []);
    else setAction([]);
  }, [actionIndex]);

  const renderActionButton = (data, action) => {
    const handlePress = () => {
      handleAction(action, data);
    };

    const iconSize = scaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    Animated.timing(scaleAnim, {
      toValue: 1.2,
      duration: 300,
      useNativeDriver: true,
    }).start();

    switch (action) {
      case "activeIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <Animated.View style={{ transform: [{ scale: iconSize }] }}>
              <MaterialCommunityIcons
                name="fridge-industrial"
                size={20}
                color={colors.palette.primary}
              />
            </Animated.View>
          </Pressable>
        );

      case "editIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <Animated.View style={{ transform: [{ scale: iconSize }] }}>
              <AntDesign name="edit" size={20} color={colors.palette.primary} />
            </Animated.View>
          </Pressable>
        );
      case "delIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <Animated.View style={{ transform: [{ scale: iconSize }] }}>
              <AntDesign
                name="delete"
                size={20}
                color={colors.palette.danger}
              />
            </Animated.View>
          </Pressable>
        );
      case "changeIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <Animated.View style={{ transform: [{ scale: iconSize }] }}>
              <FontAwesome6
                name="edit"
                size={20}
                color={colors.palette.primary}
              />
            </Animated.View>
          </Pressable>
        );
      case "copyIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <Animated.View style={{ transform: [{ scale: iconSize }] }}>
              <AntDesign name="copy1" size={20} color={colors.palette.danger} />
            </Animated.View>
          </Pressable>
        );
      case "preIndex":
        return (
          <Pressable style={styles.button} onPress={handlePress}>
            <Animated.View style={{ transform: [{ scale: iconSize }] }}>
              <AntDesign name="copy1" size={20} color={colors.palette.danger} />
            </Animated.View>
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
            size={30}
            color={cell ? colors.palette.green : colors.palette.primary}
          />
        </View>
      );
    }
    return <Text style={styles.text}>{cell}</Text>;
  };

  const rowsData = Tabledata.map((rowData, headerIndex) =>
    responsive === "small" ? (
      <View key={headerIndex} style={styles.cardRow}>
        {Tablehead.map((header, i) => (
          <View key={i} style={{ marginBottom: spacing.xs }}>
            <Text style={styles.titleStyled}>{header}:</Text>
            {renderCellContent(rowData[i])}
          </View>
        ))}
        <View style={{ flexDirection: "row", marginTop: spacing.md }}>
          {Object.entries(action[0]).map(([key, value]) => (
            <React.Fragment key={`${headerIndex}-${key}`}>
              {value >= 0 && renderActionButton(rowData[value], key)}
            </React.Fragment>
          ))}
        </View>
      </View>
    ) : (
      rowData.map((cellData, cellIndex) => (
        <React.Fragment key={`${headerIndex}-${cellIndex}`}>
          {action.map((actionItem, actionIndex) => {
            const filteredEntries = Object.entries(actionItem).filter(
              ([key, value]) => value === cellIndex
            );

            return filteredEntries.length > 0 ? (
              filteredEntries.map(([key]) => (
                <React.Fragment key={`${headerIndex}-${actionIndex}-${key}`}>
                  {renderActionButton(cellData, key)}
                </React.Fragment>
              ))
            ) : (
              <React.Fragment key={`${headerIndex}-${cellIndex}`}>
                {renderCellContent(cellData)}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))
    )
  );

  return responsive === "small" ? (
    <View style={styles.container}>{rowsData}</View>
  ) : (
    <View style={styles.containerTable}>
      <DataTable>
        <DataTable.Header>
          {Tablehead.map((header, index) => (
            <DataTable.Title
              key={index}
              style={{ flex: flexArr[index] || 1, justifyContent: "center" }}
            >
              <Text style={[styles.textHead]}>{header}</Text>
            </DataTable.Title>
          ))}
        </DataTable.Header>

        {Tabledata.length === 0 ? (
          <Text style={styles.noDataText}>Not found your data...</Text>
        ) : (
          Tabledata.map((row, rowIndex) => (
            <DataTable.Row key={rowIndex} style={styles.row}>
              {row.map((cell, cellIndex) => (
                <DataTable.Cell
                  key={cellIndex}
                  style={{
                    flex: flexArr[cellIndex] || 1,
                    justifyContent: "center",
                  }}
                >
                  {action.map((actionItem, actionIndex) => {
                    const filteredEntries = Object.entries(actionItem).filter(
                      ([key, value]) => value === cellIndex
                    );

                    return filteredEntries.length > 0 ? (
                      filteredEntries.map(([key]) => (
                        <React.Fragment key={`${rowIndex}-${key}`}>
                          {renderActionButton(cell, key)}
                        </React.Fragment>
                      ))
                    ) : (
                      <React.Fragment key={`${rowIndex}-${cellIndex}`}>
                        {renderCellContent(cell)}
                      </React.Fragment>
                    );
                  })}
                </DataTable.Cell>
              ))}
            </DataTable.Row>
          ))
        )}
      </DataTable>
    </View>
  );
};

export default CustomTable;
