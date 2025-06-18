import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const RoundedTextInput = ({ style, ...props }) => (
  <TextInput
    style={[styles.input, style]}
    placeholderTextColor="#888"
    {...props}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#222',
  },
});

export default RoundedTextInput; 