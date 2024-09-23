import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { useTheme, useRes } from "../../../contexts";
import Inputs from "../../components/Common/Inputs";
import { useFormBuilder } from "../../../customhooks";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchemaForm = Yup.object().shape({
  formName: Yup.string().required("The form name field is required."),
  description: Yup.string().required("The description field is required."),
});

const FormProperty = ({ route }) => {
  const { form, setForm } = useFormBuilder(route);
  const [activeTab, setActiveTab] = useState("form");
  const [animation] = useState(new Animated.Value(0));
  const { colors } = useTheme();
  const { responsive } = useRes();

  const handleTabChange = (tab) => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setActiveTab(tab);
      animation.setValue(0);
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "form":
        return (
          <Formik
            initialValues={form}
            validationSchema={validationSchemaForm}
            validateOnBlur={false}
            validateOnChange={true}
            onSubmit={(values) => {
              setForm(values);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              dirty,
              isValid,
            }) => (
              <View style={{ padding: 0 }}>
                <Inputs
                  placeholder="Enter Content Name"
                  label="Content Name"
                  handleChange={handleChange("formName")}
                  handleBlur={handleBlur("formName")}
                  value={values.formName}
                  error={touched.formName && Boolean(errors.formName)}
                  errorMessage={touched.formName ? errors.formName : ""}
                />
                <Inputs
                  label="Content Description"
                  placeholder="Enter Content Description"
                  handleChange={handleChange("description")}
                  handleBlur={handleBlur("description")}
                  value={values.description}
                  error={touched.description && Boolean(errors.description)}
                  errorMessage={touched.description ? errors.description : ""}
                />
              </View>
            )}
          </Formik>
        );
      case "tool":
        return (
          <Text style={styles.headerText}>Here is the UI for Form Element</Text>
        );
      case "favourite":
        return (
          <Text style={styles.headerText}>Here is the UI for Favourite</Text>
        );
      default:
        return null;
    }
  };

  const animatedStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -50],
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: responsive === "small" ? "column" : "row",
      flexWrap: responsive === "small" ? "nowrap" : "wrap",
    },
    layout1: {
      display: "flex",
      padding: 10,
      width: responsive === "small" ? "100%" : 400,
      backgroundColor: colors.main,
    },
    layout2: {
      display: "flex",
      flex: 1,
      margin: 10,
    },
    header: {
      padding: 16,
      backgroundColor: "#FFF",
      elevation: 2,
    },
    segmentedButtons: {
      backgroundColor: "#FFFFFF",
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
      backgroundColor: "#FFFFFF",
      borderRadius: 8,
      elevation: 1,
      marginTop: 16,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.layout1}>
        <View style={styles.header}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={handleTabChange}
            buttons={[
              { value: "form", label: "Form" },
              { value: "tool", label: "Form Element" },
              { value: "favourite", label: "Favourite" },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
        <View style={styles.contentContainer}>
          <Animated.View style={[animatedStyle, { position: "absolute" }]}>
            {renderContent()}
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default FormProperty;
