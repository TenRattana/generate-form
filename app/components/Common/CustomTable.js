import React, { useRef, useMemo, useState, useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { DataTable, Searchbar } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import customtableStyle from "../../../styles/components/customtable";
import { useTheme, useRes } from "../../../contexts";
import Dialog_check from "./Dialog_check";

const CustomTable = ({
  Tabledata,
  Tablehead,
  flexArr,
  handleAction,
  actionIndex,
  searchQuery,
}) => {
  const [action, setAction] = useState([]);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("ascending");
  const [isVisible, setIsVisible] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogData, setDialogData] = useState("");
  const { colors, fonts, spacing } = useTheme();
  const { responsive } = useRes();
  const styles = customtableStyle({ colors, spacing, fonts, responsive });
  console.log("CustomTable");

  const animations = useRef(Tabledata.map(() => new Animated.Value(1))).current;

  useMemo(() => {
    if (Array.isArray(actionIndex)) {
      setAction(actionIndex);
    } else {
      setAction([]);
    }
  }, [actionIndex]);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage, searchQuery, sortColumn, sortDirection]);

  const handleSort = (columnIndex) => {
    if (sortColumn === columnIndex) {
      setSortDirection(
        sortDirection === "ascending" ? "descending" : "ascending"
      );
    } else {
      setSortColumn(columnIndex);
      setSortDirection("ascending");
    }
  };

  const sortedData = [...Tabledata].sort((a, b) => {
    if (sortColumn !== null) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue < bValue) return sortDirection === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter((row) =>
    row.some((cell) =>
      cell.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleDialog = (action, data) => {
    handleAction(action, data);
  };

  const renderActionButton = (data, action, row, rowIndex) => {
    const handlePress = () => {
      setDialogAction(action);
      setDialogData(data);
      setDialogTitle(action === "editIndex" ? "Edit" : "Delete");
      setDialogMessage(`${row[0]}`);
      setIsVisible(true);
    };

    let icon;
    switch (action) {
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
      <Pressable
        style={styles.button}
        onPress={handlePress}
        key={`action-${action}`}
      >
        {icon}
      </Pressable>
    );
  };

  const renderCellContent = (cell, cellIndex, row, rowIndex) => {
    if (typeof cell === "boolean") {
      const handlePress = () => {
        Animated.sequence([
          Animated.timing(animations[rowIndex], {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(animations[rowIndex], {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();

        const status = row[cellIndex] ? "In active" : "Active";

        setDialogAction("activeIndex");
        setDialogTitle("Change Status");
        setDialogData(row[cellIndex + 1]);
        setDialogMessage(`${row[0]}  ${status}`);
        setIsVisible(true);
      };

      return (
        <Pressable
          style={styles.button}
          key={`cell-content-${cellIndex}`}
          onPress={handlePress}
        >
          <Animated.View
            style={{ transform: [{ scale: animations[rowIndex] }] }}
          >
            <MaterialCommunityIcons
              name={cell ? "toggle-switch" : "toggle-switch-off-outline"}
              size={34}
              color={cell ? colors.palette.green : colors.palette.primary}
            />
          </Animated.View>
        </Pressable>
      );
    }
    return (
      <Text style={styles.text} key={`cell-content-${cellIndex}`}>
        {cell}
      </Text>
    );
  };

  const currentData = filteredData.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  if (responsive === "small") {
    return currentData.map((rowData, headerIndex) => (
      <View key={`row-${headerIndex}`} style={styles.cardRow}>
        {Tablehead.map((header, i) => (
          <View
            key={`header-${headerIndex}-${i}`}
            style={{ marginBottom: spacing.xs }}
          >
            <Text style={styles.titleStyled}>{header}:</Text>
            {renderCellContent(rowData[i], i, rowData, headerIndex)}
          </View>
        ))}
        <View style={{ flexDirection: "row", marginTop: spacing.md }}>
          {Object.entries(action[0]).map(
            ([key, value]) =>
              value >= 0 &&
              renderActionButton(rowData[value], key, rowData, headerIndex)
          )}
        </View>
      </View>
    ));
  } else {
    return (
      <View style={styles.containerTable}>
        <DataTable>
          <DataTable.Header>
            {Tablehead.map((header, index) => (
              <DataTable.Title
                key={`header-${index}`}
                style={{ flex: flexArr[index] || 1, justifyContent: "center" }}
                sortDirection={sortColumn === index ? sortDirection : null}
                onPress={() => handleSort(index)}
              >
                <Text
                  style={sortColumn === index ? styles.textHead : styles.text}
                >
                  {header}
                </Text>
              </DataTable.Title>
            ))}
          </DataTable.Header>

          {filteredData.length === 0 ? (
            <Text style={styles.noDataText}>No data found...</Text>
          ) : (
            currentData.map((row, rowIndex) => (
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
                            renderActionButton(cell, key, row, rowIndex)
                          )
                        : renderCellContent(cell, cellIndex, row, rowIndex);
                    })}
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))
          )}
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(filteredData.length / itemsPerPage)}
            onPageChange={(newPage) => setPage(newPage)}
            label={`Page ${page + 1} of ${Math.ceil(
              filteredData.length / itemsPerPage
            )}`}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            showFastPaginationControls
            selectPageDropdownLabel={"Rows per page"}
          />
        </DataTable>

        <Dialog_check
          style={{ styles, colors }}
          isVisible={isVisible}
          title={dialogTitle}
          setIsVisible={setIsVisible}
          setDialogData={setDialogData}
          handleDialog={handleDialog}
          actions={dialogAction}
          messages={dialogMessage}
          data={dialogData}
        />
      </View>
    );
  }
};

export default CustomTable;
