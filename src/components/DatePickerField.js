import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

function formatDateDMY(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

const DatePickerField = ({ label, value, onChange, placeholder = 'Select date', onPress }) => {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View style={{ flex: 1 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity onPress={onPress ? onPress : () => setShow(true)}>
        <View style={styles.dateInputRow}>
          <Ionicons name="calendar-outline" size={18} color="#0366d6" />
          <Text style={[styles.dateInput, { color: value ? '#222' : '#888' }]}> 
            {value ? formatDateDMY(value) : placeholder}
          </Text>
        </View>
      </TouchableOpacity>
      {show && !onPress && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    marginTop: 0,
    height: 48,
    backgroundColor: '#fff',
  },
  dateInput: {
    marginLeft: 6,
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
});

export default DatePickerField; 