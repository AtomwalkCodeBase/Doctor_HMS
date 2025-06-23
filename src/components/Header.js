import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Header = ({ title, onBack }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <MaterialIcons name="arrow-back" size={26} color="#fff" />
    </TouchableOpacity>
    <View style={styles.titleContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
    <View style={styles.backButton} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#0366D6',
    paddingHorizontal: 16,
    width: '100%',
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    // alignItems: 'center',
    marginLeft: 0
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Inter', // fallback to system font if not available
  },
});

export default Header;