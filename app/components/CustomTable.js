import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { colors, spacing, fonts } from "../../theme";
import { useResponsive } from "./useResponsive";

export const CustomTable = ({
  Tabledata,
  Tablehead,
  editIndex,
  delIndex,
  handleAction,
}) => {
  const responsive = useResponsive();

  const styles = StyleSheet.create({
    containerTable: {
      width: responsive === "small" ? "100%" : "90%",
      alignSelf: "center",
    },
    head: {
      height: responsive === "small" ? 30 : responsive === "medium" ? 40 : 50,
      backgroundColor: colors.secondary,
    },
    headerCell: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    row: {
      flexDirection: "row",
      height: responsive === "small" ? 30 : responsive === "medium" ? 40 : 50,
      backgroundColor: colors.secondary2,
    },
    titleStyled: {
      color: colors.palette.danger,
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.md
          : fonts.xmd,
    },
    titleStylew: {
      color: colors.palette.primaryLight,
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.md
          : fonts.xmd,
      
    },
    text: {
      fontSize:
        responsive === "small"
          ? fonts.sm
          : responsive === "medium"
          ? fonts.xsm
          : fonts.md,
      alignSelf: "center",
      color: colors.dark,
    },
    textHead:{
      fontWeight: "bold",
    },
    button: {
      paddingVertical:
        responsive === "small" ? 8 : responsive === "medium" ? 10 : 12,
      paddingHorizontal:
        responsive === "small" ? 15 : responsive === "medium" ? 20 : 25,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const renderHeader = (header) => (
    <View style={styles.headerCell}>
      <Text style={[styles.text , styles.textHead]}>{header}</Text>
    </View>
  );

  const Element = (data, action, handleAction) => {
    const handlePress = () => {
      handleAction(action, data);
    };

    if (action === "edit") {
      return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.titleStylew}>Edit</Text>
        </TouchableOpacity>
      );
    } else if (action === "del") {
      return (
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.titleStyled}>Delete</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View>
      <Table borderStyle={{ borderWidth: 1 }} style={styles.containerTable}>
        <Row
          data={Tablehead.map((header) => renderHeader(header))}
          style={styles.head}
          textStyle={styles.text}
        />

        {Tabledata.map((rowData, index) => (
          <TableWrapper key={index} style={styles.row}>
            {rowData.map((cellData, cellIndex) => (
              <Cell
                key={cellIndex}
                data={
                  cellIndex === editIndex
                    ? Element(cellData, "edit", handleAction)
                    : cellIndex === delIndex
                    ? Element(cellData, "del", handleAction)
                    : cellData
                }
                textStyle={styles.text}
              />
            ))}
          </TableWrapper>
        ))}
      </Table>
    </View>
  );
};
