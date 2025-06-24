import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const VitalCard = ({ icon, label, value, iconColor, iconSet, backgroundColor }) => {
  return (
    <View style={[styles.container, backgroundColor ? { backgroundColor } : null]}>
      <View style={styles.iconWrapper}>
        {iconSet === 'MaterialCommunityIcons' ? (
          <MaterialCommunityIcons name={icon} size={44} color={iconColor} />
        ) : (
          <Ionicons name={icon} size={44} color={iconColor} />
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 12,
    paddingTop: 10,
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  iconWrapper: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default VitalCard; 