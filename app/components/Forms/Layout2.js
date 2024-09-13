import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Divider, Button } from "@rneui/themed";
import { DynamicForm } from "./index";

const Layout2 = ({
  style,
  form,
  state,
  checkListType,
  checkList,
  formData,
  handleChange,
  groupCheckListOption,
  handleSubmit,
}) => {
  const { styles, colors, spacing, fonts, responsive } = style;
  console.log("Layout2");

  const renderLayout2 = () => (
    <FlatList
      data={state.subForms}
      renderItem={({ item, index }) => (
        <View style={styles.card} key={`card-${index}`}>
          <Text style={styles.cardTitle}>{item.subFormName}</Text>
          <View style={styles.formContainer}>
            {item.fields.map((field, fieldIndex) => {
              const containerStyle = {
                flexBasis: `${
                  responsive === "small" || responsive === "medium"
                    ? 100
                    : 100 / item.columns
                }%`,
                flexGrow: field.displayOrder || 1,
                padding: 5,
              };
              return (
                <View
                  key={`field-${fieldIndex}-${item.subFormName}`}
                  style={containerStyle}
                >
                  <DynamicForm
                    style={{ styles, colors, spacing, fonts, responsive }}
                    responsive={responsive}
                    fields={[field]}
                    formData={formData}
                    handleChange={handleChange}
                    checkListType={checkListType}
                    checkList={checkList}
                    indexSubForm={index}
                    groupCheckListOption={groupCheckListOption}
                  />
                </View>
              );
            })}
          </View>
        </View>
      )}
      keyExtractor={(item) => item.subFormName || `subForm-${item.subFormId}`}
    />
  );

  return (
    <View>
      <Text style={[styles.textHeader, { color: colors.palette.dark }]}>
        {form.formName ? form.formName : "Content Name"}
      </Text>
      <Divider
        style={{ left: -50 }}
        subHeader={form.description || "Content Description"}
        inset={true}
        subHeaderStyle={{
          marginTop: 2,
          left: -50,
          color: colors.palette.dark,
        }}
      />
      {renderLayout2()}
      {state.subForms.length > 0 && state.subForms[0].fields.length > 0 ? (
        <View style={styles.buttonContainer}>
          <Button
            title="Submit"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={() => handleSubmit()}
          />
        </View>
      ) : null}
    </View>
  );
};

export default Layout2;
