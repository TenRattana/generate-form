import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import axios from "../../../config/axios";
import {
  Selects,
  Radios,
  Checkboxs,
  Textareas,
  Inputs,
} from "../../components";
import { Divider, Button } from "@rneui/themed";
import { useResponsive } from "../../components";

const ViewFormScreen = () => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState([]);
  const [formName, setFormName] = useState("");
  const responsive = useResponsive();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formResponse] = await Promise.all([
          axios.post("GetForm", { formQR: "Registration Form" }),
        ]);
        setForm(formResponse.data || []);
        setFormName(formResponse.data[0].FormName);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (name, value, type) => {
    setFormData({
      ...formData,
      [name]: type === "CHECKBOX" ? value : value,
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    form.forEach((section) => {
      if (section.fields) {
        section.fields.forEach((field) => {
          if (field.required && !formData[field.name]) {
            formIsValid = false;
            errors[field.name] = "This field is required";
          }
        });
      }
    });

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = () => {
    if (handleValidation()) {
      console.log("Form Data:", formData);
    }
  };

  const renderField = (field) => {
    switch (field.TypeName) {
      case "DROPDOWN":
        return (
          <Selects
            field={field}
            formData={formData}
            handleChange={handleChange}
          />
        );
      case "RADIO":
        return (
          <Radios
            field={field}
            formData={formData}
            handleChange={handleChange}
          />
        );
      case "CHECKBOX":
        return (
          <Checkboxs
            field={field}
            formData={formData}
            handleChange={handleChange}
          />
        );
      case "TEXTAERA":
        return (
          <Textareas
            field={field}
            formData={formData}
            handleChange={handleChange}
          />
        );
      case "FILE":
        return (
          <View style={styles.fileContainer}>
            <Text>File Upload</Text>
          </View>
        );
      case "TEXTINPUT":
        return (
          <Inputs
            field={field}
            formData={formData}
            handleChange={handleChange}
          />
        );
      default:
        return "";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHead}>{formName}</Text>

      {form.map((item, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{item.CardName}</Text>
          <View
            style={[
              styles.gridContainer,
              { gridTemplateColumns: `repeat(${item.CardColumns}, 1fr)` },
            ]}
          >
            {item.MatchQuestionMachines.map((field, MQuestionID) => (
              <View
                key={MQuestionID}
                style={[
                  styles.gridItem,
                  {
                    flexBasis: `${
                      responsive === "small" ? 90 : 90 / item.CardColumns
                    }%`,
                    flexGrow: field.DisplayOrder,
                  },
                ]}
              >
                <Text>{field.QuestionName}</Text>
                {renderField(field)}
                {formErrors[field.MQuestionID] && (
                  <Text style={styles.error}>
                    {formErrors[field.MQuestionID]}
                  </Text>
                )}
              </View>
            ))}
          </View>
          <Divider />
        </View>
      ))}
      <Button
        title="Submit"
        onPress={handleSubmit}
        containerStyle={styles.containerButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 30,
  },
  section: {
    padding: "2%",
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "white",
  },
  sectionHead: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    padding: 10,
    borderColor: "gray",
  },
  error: {
    color: "red",
  },
  fileContainer: {
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "white",
  },
  textInput: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  containerButton: {
    width: 500,
    marginVertical: 10,
    marginHorizontal: 50,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default ViewFormScreen;
