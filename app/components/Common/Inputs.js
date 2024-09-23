import React from "react";
import { View, Text } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import commonStyle from "../../../styles/commons/common";
import { useTheme, useRes } from "../../../contexts";

const Inputs = ({
  placeholder,
  label,
  error,
  errorMessage,
  value,
  handleChange,
  handleBlur,
  hint,
  mode,
}) => {
  const { colors, fonts, spacing } = useTheme();
  const { responsive } = useRes();
  const styles = commonStyle({ colors, spacing, fonts, responsive });
  console.log("Input");

  return (
    <View style={styles.container}>
      <TextInput
        mode={mode || "outlined"}
        placeholder={placeholder}
        label={label}
        onChangeText={handleChange}
        onBlur={handleBlur}
        style={[styles.text, styles.textDark]}
        value={value}
        right={
          value && (
            <TextInput.Icon
              icon={"window-close"}
              onPress={() => handleChange("")}
              color={colors.primary}
            />
          )
        }
        error={error}
        enterKeyHint="done"
      />
      {hint ? (
        <Text style={[styles.text, { opacity: 0.5 }]}>{hint}</Text>
      ) : (
        false
      )}
      <HelperText type="error" visible={error} style={{ left: -10 }}>
        {errorMessage}
      </HelperText>
    </View>
  );
};

export default Inputs;
