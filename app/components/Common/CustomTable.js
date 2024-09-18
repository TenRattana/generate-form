import React, { useRef, useMemo, useState, useEffect } from "react";
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
  const [page, setPage] = useState(0);
  const numberOfItemsPerPageList = [2, 3, 4];
  const [itemsPerPage, setItemsPerPage] = useState(numberOfItemsPerPageList[0]);
  const { colors, fonts, spacing } = useTheme();
  const { responsive } = useRes();
  const styles = customtableStyle({ colors, spacing, fonts, responsive });

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useMemo(() => {
    if (Array.isArray(actionIndex)) {
      setAction(actionIndex);
    } else {
      setAction([]);
    }
  }, [actionIndex]);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const renderActionButton = (data, action) => {
    const handlePress = () => {
      handleAction(action, data);
    };

    const iconScale = scaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2],
    });

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    let icon;
    switch (action) {
      case "activeIndex":
        icon = (
          <MaterialCommunityIcons
            name="fridge-industrial"
            size={20}
            color={colors.palette.primary}
          />
        );
        break;
      case "editIndex":
        icon = (
          <AntDesign name="edit" size={20} color={colors.palette.primary} />
        );
        break;
      case "delIndex":
        icon = (
          <AntDesign name="delete" size={20} color={colors.palette.danger} />
        );
        break;
      case "changeIndex":
        icon = (
          <FontAwesome6 name="edit" size={20} color={colors.palette.primary} />
        );
        break;
      case "copyIndex":
      case "preIndex":
        icon = (
          <AntDesign name="copy1" size={20} color={colors.palette.danger} />
        );
        break;
      default:
        return null;
    }

    return (
      <Pressable style={styles.button} onPress={handlePress}>
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          {icon}
        </Animated.View>
      </Pressable>
    );
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
      <View key={`row-${headerIndex}`} style={styles.cardRow}>
        {Tablehead.map((header, i) => (
          <View
            key={`header-${headerIndex}-${i}`}
            style={{ marginBottom: spacing.xs }}
          >
            <Text style={styles.titleStyled}>{header}:</Text>
            {renderCellContent(rowData[i])}
          </View>
        ))}
        <View style={{ flexDirection: "row", marginTop: spacing.md }}>
          {Object.entries(action[0]).map(
            ([key, value]) =>
              value >= 0 && renderActionButton(rowData[value], key)
          )}
        </View>
      </View>
    ) : (
      rowData.map((cellData, cellIndex) => (
        <React.Fragment key={`cell-${headerIndex}-${cellIndex}`}>
          {action.map((actionItem, actionIndex) => {
            const filteredEntries = Object.entries(actionItem).filter(
              ([key, value]) => value === cellIndex
            );

            return filteredEntries.length > 0
              ? filteredEntries.map(([key]) =>
                  renderActionButton(cellData, key)
                )
              : renderCellContent(cellData);
          })}
        </React.Fragment>
      ))
    )
  );

  return (
    <View
      style={responsive === "small" ? styles.container : styles.containerTable}
    >
      {responsive === "small" ? (
        rowsData
      ) : (
        <DataTable>
          <DataTable.Header>
            {Tablehead.map((header, index) => (
              <DataTable.Title
                key={`header-${index}`}
                style={{ flex: flexArr[index] || 1, justifyContent: "center" }}
                sortDirection="descending"
              >
                <Text style={[styles.textHead]}>{header}</Text>
              </DataTable.Title>
            ))}
          </DataTable.Header>

          {Tabledata.length === 0 ? (
            <Text style={styles.noDataText}>Not found your data...</Text>
          ) : (
            Tabledata.map((row, rowIndex) => (
              <DataTable.Row key={`row-${rowIndex}`} style={styles.row}>
                {row.map((cell, cellIndex) => (
                  <DataTable.Cell
                    key={`cell-${rowIndex}-${cellIndex}`}
                    style={{
                      flex: flexArr[cellIndex] || 1,
                      justifyContent: "center",
                    }}
                  >
                    {action.map((actionItem, actionIndex) => {
                      const filteredEntries = Object.entries(actionItem).filter(
                        ([key, value]) => value === cellIndex
                      );

                      return filteredEntries.length > 0
                        ? filteredEntries.map(([key]) =>
                            renderActionButton(cell, key)
                          )
                        : renderCellContent(cell);
                    })}
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))
          )}
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(Tabledata.length / itemsPerPage)}
            onPageChange={(newPage) => setPage(newPage)}
            label={`Page ${page + 1} of ${Math.ceil(
              Tabledata.length / itemsPerPage
            )}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            showFastPaginationControls
            selectPageDropdownLabel={"Rows per page"}
          />
        </DataTable>
      )}
    </View>
  );
};

export default CustomTable;
