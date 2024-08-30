import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Table, Row, Rows, TableWrapper } from "react-native-table-component";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors, spacing, fonts } from "../../theme";
import { useResponsive } from "./useResponsive";

export const CustomTable = ({
  Tabledata,
  Tablehead,
  flexArr,
  editIndex,
  delIndex,
  handleAction,
  TextAlie,
  copyIndex,
}) => {
  const responsive = useResponsive();

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
    },
  });

  const renderActionButton = (data, action) => {
    const handlePress = () => {
      handleAction(action, data);
    };

    if (action === "edit") {
      return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <AntDesign name="edit" size={20} color={colors.palette.primary} />
        </TouchableOpacity>
      );
    } else if (action === "del") {
      return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <AntDesign name="delete" size={20} color={colors.palette.danger} />
        </TouchableOpacity>
      );
    } else if (action === "copy") {
      return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <AntDesign name="copy1" size={20} color={colors.palette.danger} />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const rowsData = Tabledata.map((rowData, index) =>
    responsive === "small" ? (
      <View key={index} style={styles.cardRow}>
        {Tablehead.map((header, i) => (
          <View key={i} style={{ marginBottom: spacing.xs }}>
            <Text style={styles.titleStyled}>{header}:</Text>
            <Text style={styles.text}>{rowData[i]}</Text>
          </View>
        ))}
        <View style={{ flexDirection: "row", marginTop: spacing.md }}>
          {editIndex >= 0 && renderActionButton(rowData[editIndex], "edit")}
          {delIndex >= 0 && renderActionButton(rowData[delIndex], "del")}
          {copyIndex >= 0 && renderActionButton(rowData[copyIndex], "copy")}
        </View>
      </View>
    ) : (
      rowData.map((cellData, cellIndex, copyIndex) =>
        cellIndex === editIndex ? (
          renderActionButton(cellData, "edit")
        ) : cellIndex === delIndex ? (
          renderActionButton(cellData, "del")
        ) : cellIndex === copyIndex ? (
          renderActionButton(cellData, "copy")
        ) : (
          <Text key={cellIndex} style={styles.text}>
            {cellData}
          </Text>
        )
      )
    )
  );

  return responsive === "small" ? (
    rowsData
  ) : (
    <ScrollView style={styles.containerTable}>
      <Table>
        <Row
          data={Tablehead}
          style={styles.head}
          textStyle={styles.textHead}
          flexArr={flexArr}
        />
        <Rows
          data={rowsData.map((row) =>
            row.map((cell, cellIndex) =>
              cellIndex === editIndex ||
              cellIndex === delIndex ||
              cellIndex === copyIndex ? (
                cell
              ) : (
                <Text
                  key={cellIndex}
                  style={[
                    styles.text,
                    {
                      alignSelf: TextAlie ? TextAlie : "center",
                      paddingLeft: TextAlie ? spacing.md : 0,
                    },
                  ]}
                >
                  {cell}
                </Text>
              )
            )
          )}
          style={styles.row}
          textStyle={styles.text}
          flexArr={flexArr}
        />
      </Table>
    </ScrollView>
  );
};
