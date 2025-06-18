import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const MultiSelectButtonGroup = ({ options, selected, onSelect, style, buttonStyle, textStyle }) => (
  <View style={[styles.btnRow, style]}>
    {options.map((option) => (
      <TouchableOpacity
        key={option}
        style={selected.includes(option) ? styles.btnSelected : styles.btn}
        onPress={() => onSelect(option)}
      >
        <Text style={selected.includes(option) ? styles.textSelected : styles.text}>{option}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const styles = StyleSheet.create({
  btnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 0,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#0366d6',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  btnSelected: {
    backgroundColor: '#0366d6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    color: '#0366d6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textSelected: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MultiSelectButtonGroup; 