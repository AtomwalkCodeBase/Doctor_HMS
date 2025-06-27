import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActionButton = ({ icon, label, onPress, style, disabled = false }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        style, 
        disabled && styles.disabledContainer
      ]} 
      onPress={disabled ? null : onPress}
      disabled={disabled}
    >
      <Ionicons 
        name={icon} 
        size={24} 
        color={disabled ? "#9CA3AF" : "#0366d6"} 
        style={styles.icon} 
      />
      <Text style={[styles.label, disabled && styles.disabledLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0366d6',
    padding: 16,
    margin: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledContainer: {
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    shadowOpacity: 0.02,
    elevation: 1,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0366d6',
  },
  disabledLabel: {
    color: '#9CA3AF',
  },
});

export default ActionButton; 