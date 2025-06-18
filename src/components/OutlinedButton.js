import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const OutlinedButton = ({ children, onPress, style, textStyle }) => (
  <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
    <Text style={[styles.text, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: '#0366d6',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 16,
  },
  text: {
    color: '#0366d6',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OutlinedButton; 