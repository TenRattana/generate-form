import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function layouttool() {
  const renderCard = ({ item, index }) => (
    <View style={styles.cardshow}>
      <TouchableOpacity
        onPress={() => {
          setSelectedCardIndex(index);
          setFormCard(item);
          setEditMode(true);
          setShowCardDialog(true);
        }}
        style={styles.button}
      >
        <Text style={styles.text}>Card : {item.cardName}</Text>
        <Entypo name="chevron-right" size={18} color={colors.palette.light} />
      </TouchableOpacity>

      {item.fields.map((field, idx) => (
        <TouchableOpacity
          key={`${field.ListName}-${idx}`}
          onPress={() => {
            setSelectedCardIndex(index);
            setSelectedFieldIndex(idx);
            setEditMode(true);
            setFormState(field);
            setShowFieldDialog(true);
          }}
          style={[styles.button]}
        >
          <Text style={styles.text}>{field.ListName}</Text>
          <Entypo name="chevron-right" size={18} color={colors.palette.light} />
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => {
          setSelectedCardIndex(index);
          setShowFieldDialog(true);
        }}
      >
        <Text style={[styles.button, { color: colors.palette.blue }]}>
          <AntDesign name="plus" size={16} color={colors.palette.blue} />
          Add Field
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.layout1}>
      <View style={{ margin: 30 }}>
        <Input
          label="Content Name"
          placeholder="Enter Content Name"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleForm("formName", text)}
          value={form.formName}
        />
        <Input
          label="Content Description"
          placeholder="Enter Content Description"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleForm("formDescription", text)}
          value={form.formDescription}
        />
        <TouchableOpacity
          onPress={() => {
            setEditMode(false);
            setShowCardDialog(true);
          }}
        >
          <Text style={[styles.button, { color: colors.palette.blue }]}>
            <AntDesign name="plus" size={16} color={colors.palette.blue} />
            Add Card
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setEditMode(false);
            setShowSaveDialog(true);
          }}
          style={{ marginTop: 10 }}
        >
          <Text
            style={[
              styles.button,
              {
                color: colors.palette.light,
                backgroundColor: colors.palette.green,
              },
            ]}
          >
            Save Form
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={state.cards}
        renderItem={renderCard}
        keyExtractor={(item, index) => `card-${index}`}
      />

      <Dialog isVisible={showSaveDialog} overlayStyle={styles.dialogContainer}>
        <Dialog.Title
          title="Save Form"
          titleStyle={[
            styles.textHeader,
            {
              justifyContent: "center",
              color: colors.palette.dark,
            },
          ]}
        />
        <Text
          style={[
            styles.textHeader,
            styles.text,
            {
              justifyContent: "center",
              color: colors.palette.dark,
              fontWeight: "regular",
            },
          ]}
        >
          You are about to save the form. Are you sure?
        </Text>

        <View
          style={[
            styles.viewDialog,
            {
              flexDirection: responsive === "small" ? "column" : "row",
              justifyContent: "center",
            },
          ]}
        >
          <Button
            title="Save"
            onPress={() => saveForm()}
            titleStyle={styles.text}
            containerStyle={[
              styles.containerButton,
              { width: responsive === "small" ? "100%" : "30%" },
            ]}
          />
          <Button
            title="Cancel"
            onPress={() => resetForm}
            titleStyle={styles.text}
            containerStyle={[
              styles.containerButton,
              { width: responsive === "small" ? "100%" : "30%" },
            ]}
          />
        </View>
      </Dialog>

      <Dialog isVisible={showCardDialog} overlayStyle={styles.dialogContainer}>
        <View style={styles.viewDialog}>
          <Input
            label="Card Name"
            placeholder="Enter Card Name"
            value={formCard.cardName || ""}
            labelStyle={[styles.text, { color: colors.text }]}
            inputStyle={[styles.text, { color: colors.text }]}
            disabledInputStyle={styles.containerInput}
            onChangeText={(text) => handleCard("cardName", text)}
          />
          {error.cardName ? (
            <Text style={styles.errorText}>{error.cardName}</Text>
          ) : null}

          <Input
            label="Card Column"
            placeholder="Enter Number of Columns"
            value={formCard.cardColumns || ""}
            labelStyle={[styles.text, { color: colors.text }]}
            inputStyle={[styles.text, { color: colors.text }]}
            disabledInputStyle={styles.containerInput}
            onChangeText={(text) => handleCard("cardColumns", text)}
          />
          {error.cardColumns ? (
            <Text style={styles.errorText}>{error.cardColumns}</Text>
          ) : null}

          <Input
            label="Card Display Order"
            placeholder="Enter Display Order Number"
            value={formCard.cardDisplayOrder || ""}
            labelStyle={[styles.text, { color: colors.text }]}
            inputStyle={[styles.text, { color: colors.text }]}
            disabledInputStyle={styles.containerInput}
            onChangeText={(text) => handleCard("cardDisplayOrder", text)}
          />
          {error.cardDisplayOrder ? (
            <Text style={styles.errorText}>{error.cardDisplayOrder}</Text>
          ) : null}

          <View
            style={[
              styles.viewDialog,
              {
                flexDirection: responsive === "small" ? "column" : "row",
                justifyContent: "center",
              },
            ]}
          >
            <Button
              title={editMode ? "Update Card" : "Add Card"}
              onPress={() => saveCard()}
              titleStyle={styles.text}
              containerStyle={[
                styles.containerButton,
                { width: responsive === "small" ? "100%" : "30%" },
              ]}
            />
            {editMode && (
              <Button
                title={"Delete Card"}
                onPress={() => saveCard("delete")}
                titleStyle={styles.text}
                containerStyle={[
                  styles.containerButton,
                  { width: responsive === "small" ? "100%" : "30%" },
                ]}
              />
            )}
            <Button
              title="Cancel"
              onPress={() => resetForm}
              titleStyle={styles.text}
              containerStyle={[
                styles.containerButton,
                { width: responsive === "small" ? "100%" : "30%" },
              ]}
            />
          </View>
        </View>
      </Dialog>

      <Dialog isVisible={showFieldDialog} overlayStyle={styles.dialogContainer}>
        <View style={styles.viewDialog}>
          <CustomDropdown
            fieldName="listId"
            title="List"
            labels="ListName"
            values="ListID"
            data={list}
            updatedropdown={handleChange}
            reset={resetDropdown}
            selectedValue={formState.listId}
          />

          <CustomDropdown
            fieldName="listTypeId"
            title="Type"
            labels="TypeName"
            values="TypeID"
            data={listType}
            updatedropdown={handleChange}
            reset={resetDropdown}
            selectedValue={formState.listTypeId}
          />

          {shouldRender === "detail" ? (
            <Animated.View style={[styles.animatedText, { opacity: fadeAnim }]}>
              <CustomDropdown
                fieldName="matchListDetailId"
                title="Group List Detail"
                labels="ListName"
                values="MLDetailID"
                data={matchListDetail}
                updatedropdown={handleChange}
                reset={resetDropdown}
                selectedValue={formState.matchListDetailId}
              />
            </Animated.View>
          ) : shouldRender === "text" ? (
            <Animated.View style={[styles.animatedText, { opacity: fadeAnim }]}>
              <CustomDropdown
                fieldName="dataTypeId"
                title="Data Type"
                labels="DTypeName"
                values="DTypeID"
                data={dataType}
                updatedropdown={handleChange}
                reset={resetDropdown}
                selectedValue={formState.dataTypeId}
              />

              <Input
                label="Placeholder"
                placeholder="Enter Placeholder"
                labelStyle={[styles.text, { color: colors.text }]}
                inputStyle={[styles.text, { color: colors.text }]}
                disabledInputStyle={styles.containerInput}
                onChangeText={(text) => handleChange("placeholder", text)}
                value={formState.placeholder}
              />

              <Input
                label="Hint"
                placeholder="Enter Hint"
                labelStyle={[styles.text, { color: colors.text }]}
                inputStyle={[styles.text, { color: colors.text }]}
                disabledInputStyle={styles.containerInput}
                onChangeText={(text) => handleChange("hint", text)}
                value={formState.hint}
              />
            </Animated.View>
          ) : null}

          <Input
            label="Display Order"
            placeholder="Enter Display Order"
            labelStyle={[styles.text, { color: colors.text }]}
            inputStyle={[styles.text, { color: colors.text }]}
            disabledInputStyle={styles.containerInput}
            onChangeText={(text) => handleChange("displayOrder", text)}
            value={formState.displayOrder}
          />

          <View
            style={[
              styles.viewDialog,
              {
                flexDirection: responsive === "small" ? "column" : "row",
                justifyContent: "center",
              },
            ]}
          >
            <Button
              title={editMode ? "Update Field" : "Add Field"}
              onPress={() => saveField()}
              titleStyle={styles.text}
              containerStyle={[
                styles.containerButton,
                { width: responsive === "small" ? "100%" : "30%" },
              ]}
            />
            {editMode && (
              <Button
                title={"Delete Field"}
                onPress={() => saveField("delete")}
                titleStyle={styles.text}
                containerStyle={[
                  styles.containerButton,
                  { width: responsive === "small" ? "100%" : "30%" },
                ]}
              />
            )}

            <Button
              title="Cancel"
              onPress={() => resetForm}
              titleStyle={styles.text}
              containerStyle={[
                styles.containerButton,
                { width: responsive === "small" ? "100%" : "30%" },
              ]}
            />
          </View>
        </View>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({});
