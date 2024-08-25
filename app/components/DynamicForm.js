import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DynamicForm = ({ fields }) => {
  return (
    <View>
      {fields.map((field, index) => (
        <View key={index} style={styles.field}>
          <Text>{field.name}</Text>
          {field.type === 'text' && <TextInput placeholder={field.name} style={styles.input} />}
          {field.type === 'dropdown' && (
            <Picker style={styles.picker}>
              {/* Replace with actual dropdown options */}
              <Picker.Item label="Option 1" value="option1" />
              <Picker.Item label="Option 2" value="option2" />
            </Picker>
          )}
          {/* Add other field types here */}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 5,
    marginVertical: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default DynamicForm;
