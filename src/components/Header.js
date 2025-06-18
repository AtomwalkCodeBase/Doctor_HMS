import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Header = ({ title, onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <MaterialIcons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
    <View style={styles.titleContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
    <View style={styles.placeholder} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0366d6',
    paddingVertical: 15,
    paddingHorizontal: 16,
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  placeholder: {
    width: 40, // Same width as backButton for balance
  },
});

export default Header;