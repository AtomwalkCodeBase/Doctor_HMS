import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AddImageButton = ({ onPress, style }) => (
  <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
    <Text style={styles.text}>Add Image</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#0366d6',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AddImageButton; 