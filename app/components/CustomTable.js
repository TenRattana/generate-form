import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { Icon, Button } from "@rneui/themed";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { colors, spacing, fonts } from "../../theme";

const styles = StyleSheet.create({
  containerTable: {
    width: "90%",
    alignSelf: "center",
    margin: spacing.sm,
  },
  head: {
    height: 40,
    backgroundColor: colors.secondary,
  },
  headerCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: spacing.sm,
  },
  row: {
    flexDirection: "row",
    height: 40,
    backgroundColor: colors.secondary2,
  },
  buttonStylew: {
    backgroundColor: colors.palette.pramaryLight,
  },
  buttonStyled: {
    backgroundColor: colors.danger,
  },
  titleStyle: {
    color: colors.palette.light,
  },
  text: {
    fontSize: 14,
    alignSelf: "center",
    color: colors.dark,
  },
});

const HeaderCell = ({ header, iconName }) => (
  <View style={styles.headerCell}>
    {iconName && <Icon name={iconName} type="ionicon" size={20} />}
    <Text style={styles.text}>{header}</Text>
  </View>
);

const renderHeader = (header, index, editIndex, delIndex) => {
  if (index === editIndex) {
    return <HeaderCell key={index} header={header} iconName="create-outline" />;
  } else if (index === delIndex) {
    return <HeaderCell key={index} header={header} iconName="trash-outline" />;
  }
  return <HeaderCell key={index} header={header} />;
};

const Element = (data, index, action, handleAction) => {
  const handlePress = () => {
    handleAction(action, data);
  };

  if (action === "edit") {
    return (
      <Button
        type="outline"
        title="Edit"
        buttonStyle={styles.buttonStylew}
        titleStyle={styles.titleStyle}
        onPress={handlePress}
      />
    );
  } else if (action === "del") {
    return (
      <Button
        type="outline"
        title="Delete"
        buttonStyle={styles.buttonStyled}
        titleStyle={styles.titleStyle}
        onPress={handlePress}
      />
    );
  }
  return "";
};

export const CustomTable = ({ Tabledata, Tablehead, editIndex, delIndex, handleAction }) => (
  <View>
    <Table borderStyle={{ borderWidth: 1 }} style={styles.containerTable}>
      <Row
        data={Tablehead.map((header, index) =>
          renderHeader(header, index, editIndex, delIndex)
        )}
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
                  ? Element(cellData, index, "edit", handleAction)
                  : cellIndex === delIndex
                  ? Element(cellData, index, "del", handleAction)
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
