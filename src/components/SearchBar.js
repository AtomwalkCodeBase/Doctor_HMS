import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ value, onChangeText, style }) => (
  <View style={[styles.container, style]}>
    <Ionicons name="search" size={20} color="#6B7280" style={styles.icon} />
    <TextInput
      style={styles.input}
      placeholder="Search"
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#6B7280"
      returnKeyType="search"
      blurOnSubmit={true}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 48,
    width: '100%',
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB', // subtle light gray
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
});

export default SearchBar; 