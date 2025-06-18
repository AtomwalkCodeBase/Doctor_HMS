import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const NoteInput = ({ style, ...props }) => (
  <TextInput
    style={[styles.input, style]}
    placeholderTextColor="#888"
    multiline
    {...props}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    height: 120,
    fontSize: 14,
    color: '#222',
    marginTop: 6,
    textAlignVertical: 'top',
  },
});

export default NoteInput; 