import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const PrimaryButton = ({ children, onPress, style, textStyle }) => (
  <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
    <Text style={[styles.text, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#0366d6',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PrimaryButton; 