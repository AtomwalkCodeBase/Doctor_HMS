import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VitalCard = ({ icon, label, value, iconColor }) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={24} color={iconColor} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
});

export default VitalCard; 