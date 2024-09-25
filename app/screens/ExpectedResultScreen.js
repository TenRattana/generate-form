import React, { useState, useCallback, useMemo } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import { CustomTable, LoadingSpinner, Searchbars } from "../components";
import { useTheme, useToast, useRes } from "../../contexts";
import screenStyles from "../../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const ExpectedResultScreen = React.memo(({ navigation }) => {
  const [expectedResult, setExpectedResult] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });

  const ShowMessages = (textH, textT, color) => {
    Toast.show({
      type: "customToast",
      text1: textH,
      text2: textT,
      text1Style: [styles.text, { color: colors.palette.dark }],
      text2Style: [styles.text, { color: colors.palette.dark }],
    });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [expectedResultResponse] = await Promise.all([
            axios.post("ExpectedResult_service.asmx/GetExpectedResults"),
          ]);
          setExpectedResult(expectedResultResponse.data.data ?? []);
          setIsLoading(true);
        } catch (error) {
          ShowMessages(
            error.message || "Error",
            error.response
              ? error.response.data.errors
              : ["Something went wrong!"],
            "error"
          );
        }
      };

      fetchData();
      return () => {};
    }, [])
  );

  const handleAction = async (action, item) => {
    try {
      if (action === "preIndex") {
        const data = expectedResult.find((v) => v.TableID === item);

        navigation.navigate("View Form", {
          formId: data.FormID,
          tableId: data.TableID,
        });
      }
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    }
  };

  const handleNewForm = () => {
    navigation.navigate("Create Form");
  };

  const convertToThaiDateTime = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear() + 543;
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} เวลา ${hours}:${minutes}`;
  };

  const tableData = useMemo(() => {
    return expectedResult.map((item) => [
      item.MachineName,
      item.FormName,
      convertToThaiDateTime(item.CreateDate),
      item.TableID,
    ]);
  }, [expectedResult]);

  const tableHead = ["Machine Name", "Form Name", "Time Submit", "Preview"];

  const actionIndex = [
    {
      preIndex: 3,
    },
  ];

  const customtableProps = {
    Tabledata: tableData,
    Tablehead: tableHead,
    flexArr: [3, 3, 3, 1],
    actionIndex,
    handleAction,
    searchQuery,
  };

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Forms</Card.Title>
          <Card.Divider />

          <Searchbars
            viewProps={
              <Pressable
                onPress={handleNewForm}
                style={[styles.button, styles.backMain]}
              >
                <Text style={[styles.text, styles.textLight]}>New Form</Text>
              </Pressable>
            }
            searchQuery={searchQuery}
            handleChange={setSearchQuery}
          />

          {isLoading ? (
            <CustomTable {...customtableProps} />
          ) : (
            <LoadingSpinner />
          )}
        </Card>
      </ScrollView>
    </View>
  );
});

export default ExpectedResultScreen;
