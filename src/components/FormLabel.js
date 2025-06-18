import React from 'react';
import { Text, StyleSheet } from 'react-native';

const FormLabel = ({ children, style }) => (
  <Text style={[styles.label, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
});

export default FormLabel; 