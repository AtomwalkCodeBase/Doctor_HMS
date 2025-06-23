import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const VitalCard = ({ icon, label, value, iconColor, iconSet }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        {iconSet === 'MaterialCommunityIcons' ? (
          <MaterialCommunityIcons name={icon} size={70} color={iconColor} />
        ) : (
          <Ionicons name={icon} size={70} color={iconColor} />
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 170,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginRight: 16,
    paddingTop: 16,
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  iconWrapper: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginTop: 6,
  },
});

export default VitalCard; 