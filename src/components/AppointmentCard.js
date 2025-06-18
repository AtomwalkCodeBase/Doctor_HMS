import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppointmentCard = ({ name, date, time, avatar, completed, onPress }) => (
  <View style={styles.card}>
    <View style={{ flex: 1 }}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.time}>{time}</Text>
      {completed ? (
        <TouchableOpacity style={styles.completedButton} onPress={onPress}>
          <Text style={styles.completedText}>Completed</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
          <Text style={styles.detailsText}>See Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#111" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      )}
    </View>
    <Image source={avatar} style={styles.avatar} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    color: '#111',
  },
  date: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  time: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 16,
  },
  detailsButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  detailsText: {
    color: '#111',
    fontWeight: '600',
    fontSize: 15,
  },
  completedButton: {
    backgroundColor: '#D1FADF',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  completedText: {
    color: '#217A39',
    fontWeight: '600',
    fontSize: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginLeft: 24,
    backgroundColor: '#f5e3d7',
  },
});

export default AppointmentCard; 