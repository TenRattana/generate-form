import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Divider } from "@rneui/themed";

export const Layout2 = ({ style, form }) => {
  const { styles, colors, responsive } = style;
  // const renderLayout2 = () => (
  //   <FlatList
  //     data={state.subForms}
  //     renderItem={({ item, index }) => (
  //       <View style={styles.card} key={`card-${index}`}>
  //         <Text style={styles.cardTitle}>{item.cardName}</Text>
  //         <View style={styles.formContainer}>
  //           {item.fields.map((field, fieldIndex) => {
  //             const containerStyle = {
  //               flexBasis: `${
  //                 responsive === "small" || responsive === "medium"
  //                   ? 100
  //                   : 100 / item.cardColumns
  //               }%`,
  //               flexGrow: field.displayOrder || 1,
  //               padding: 5,
  //             };
  //             return (
  //               <View
  //                 key={`field-${fieldIndex}-${item.cardName}`}
  //                 style={containerStyle}
  //               >
  //                 <DynamicForm fields={[field]} onChange={handleFieldChange} />
  //               </View>
  //             );
  //           })}
  //         </View>
  //       </View>
  //     )}
  //     keyExtractor={(item, index) => `card-${index}`}
  //   />
  // );

  return (
    <View>
      <Text style={[styles.textHeader, { color: colors.palette.dark }]}>
        {form.formName ? form.formName : "Content Name"}
      </Text>
      <Divider
        style={{ left: -50 }}
        subHeader={form.formDescription || "Content Description"}
        inset={true}
        subHeaderStyle={{
          marginTop: 2,
          left: -50,
          color: colors.palette.dark,
        }}
      />
      {/* {renderLayout2()} */}
    </View>
  );
};

const styles = StyleSheet.create({});
