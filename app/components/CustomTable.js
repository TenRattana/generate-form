import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors, spacing, fonts } from "../../theme";
import { useResponsive } from "./useResponsive";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export const CustomTable = ({
  Tabledata,
  Tablehead,
  flexArr,
  handleAction,
  actionIndex,
}) => {
  const responsive = useResponsive();
  const [action, setAction] = useState([]);

  console.log("CustomTable");

  useMemo(() => {
    if (actionIndex && Array.isArray(actionIndex)) setAction(actionIndex || []);
    else setAction([]);
  }, [actionIndex]);

  const styles = StyleSheet.create({
    containerTable: {
      width: responsive === "small" ? "100%" : "95%",
      alignSelf: "center",
      marginVertical: 10,
      borderRadius: 10,
    },
    head: {
      height: responsive === "small" ? 40 : responsive === "medium" ? 50 : 60,
      borderBottomWidth: 2,
    },
    headerCell: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.sm,
    },
    row: {
      flexDirection: "row",
      height: responsive === "small" ? 60 : responsive === "medium" ? 50 : 60,
      borderBottomWidth: 1,
      borderColor: colors.background,
    },
    cardRow: {
      padding: spacing.md,
      marginVertical: spacing.sm,
      borderRadius: 5,
      borderWidth: 1,
    },
    titleStyled: {
      color: colors.palette.danger,
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
    },
    titleStylew: {
      color: colors.palette.primaryLight,
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
    },
    text: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      color: colors.text,
      alignSelf: responsive === "small" ? "flex-start" : "center",
    },
    textHead: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      fontWeight: "bold",
      color: colors.text,
      alignSelf: responsive === "small" ? "flex-start" : "center",
    },
    button: {
      paddingVertical:
        responsive === "small"
          ? spacing.sm
          : responsive === "medium"
          ? spacing.md
          : spacing.lg,
      paddingHorizontal:
        responsive === "small"
          ? spacing.md
          : responsive === "medium"
          ? spacing.lg
          : spacing.xl,
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
    },
    booleanText: {
      fontSize: fonts.sm,
      color: colors.text,
    },
    booleanIcon: {
      fontSize: 20,
      textAlign: "center",
    },
  });

  const renderActionButton = (data, action) => {
    const handlePress = () => {
      handleAction(action, data);
    };

    switch (action) {
      case "editIndex":
        return (
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <AntDesign name="edit" size={20} color={colors.palette.primary} />
          </TouchableOpacity>
        );
      case "delIndex":
        return (
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <AntDesign name="delete" size={20} color={colors.palette.danger} />
          </TouchableOpacity>
        );
      case "changeIndex":
        return (
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <FontAwesome6
              name="edit"
              size={20}
              color={colors.palette.primary}
            />
          </TouchableOpacity>
        );
      case "copyIndex":
        return (
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <AntDesign name="copy1" size={20} color={colors.palette.danger} />
          </TouchableOpacity>
        );
      case "preIndex":
        return (
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <AntDesign name="copy1" size={20} color={colors.palette.danger} />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const renderCellContent = (cell) => {
    if (typeof cell === "boolean") {
      return (
        <Text style={styles.booleanText}>
          {cell ? (
            <AntDesign
              name="checkcircle"
              style={styles.booleanIcon}
              color={colors.palette.green}
            />
          ) : (
            <AntDesign
              name="closecircle"
              style={styles.booleanIcon}
              color={colors.palette.danger}
            />
          )}
        </Text>
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
                {renderCellContent(rowData[i])}
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
