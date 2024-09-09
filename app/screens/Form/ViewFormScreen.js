import React, { useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { Layout2 } from "../../components";
import formStyles from "../../styles/forms/form";
import { useTheme, useToast, useRes } from "../../contexts";
import axios from "../../../config/axios";

// import { useViewForm } from "../../customhooks/forms/viewform";

const FormBuilder = ({ route }) => {
  // const {} = useViewForm(route);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formResponse = await axios.post("GetForm");
      } catch (error) {
        // ShowMessages(error.message, error.response.data.errors, "error");
      }
    };

    fetchData();
  }, []);

  // const { colors, spacing, fonts } = useTheme();
  // const { Toast } = useToast();
  // const { responsive } = useRes();

  // const styles = formStyles({ colors, spacing, fonts, responsive });
  console.log("CreateForm");

  return (
    <ScrollView
    // contentContainerStyle={styles.container}
    >
      <View
      // style={styles.layout2}
      >
        {/* <Layout2
        form={form}
        style={{ styles, colors, responsive }}
        state={state}
        checkListType={checkListType}
        checkList={checkList}
        formData={formData}
        handleChange={handleChange}
        matchCheckListOption={matchCheckListOption}
        handleSubmit={handleSubmit}
        /> */}
      </View>
    </ScrollView>
  );
};

export default FormBuilder;
