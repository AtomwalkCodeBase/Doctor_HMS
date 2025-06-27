import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const STATUS_COLORS = {
  Completed: "#22C55E", // Green
  Pending: "#F59E42",  // Orange
  "Needs Attention": "#ffe066",
  critical: "#ff6b6b",
  Stable: "#8DD8FF",
  "Round Completed": "#4ade80",
};

const STATUS_TEXT_COLORS = {
  Completed: "#fff",
  Pending: "#fff",
};

const StatusBadge = ({ label }) => (
  <View style={[
    styles.statusBadge,
    { backgroundColor: STATUS_COLORS[label] || "#eee" }
  ]}>
    <Text style={[
      styles.statusBadgeText,
      { color: STATUS_TEXT_COLORS[label] || "#222" }
    ]}>
      {label}
    </Text>
  </View>
);

const AppointmentCard = ({ id, name, date, time, avatar, completed, onPress, status }) => (
  <View style={styles.card}>
    <View style={{ flex: 1 }}>
      {/* Name Row (without Status Badge) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Text style={styles.name}>{name}</Text>
      </View>
      {/* Patient ID */}
      {id && (
        <Text style={styles.idText}>ID: {id}</Text>
      )}
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.time}>{time}</Text>
      <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
        <Text style={styles.detailsText}>See Details</Text>
        <Ionicons name="chevron-forward" size={16} color="#111" style={{ marginLeft: 6 }} />
      </TouchableOpacity>
    </View>
    {/* Avatar and Status Badge Column */}
    <View style={styles.avatarColumn}>
      {status && Array.isArray(status) && status.length > 0 && (
        <StatusBadge label={status[0]} />
      )}
      <Image source={avatar} style={styles.avatar} />
    </View>
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
    marginBottom: 0,
    color: '#111',
  },
  idText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 0,
  },
  date: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 0,
  },
  time: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 0,
  },
  detailsButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  detailsText: {
    color: '#111',
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
  avatarColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 24,
  },
  statusBadge: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    alignSelf: "flex-end",
    marginLeft: 'auto',
    marginBottom: 8,
    marginTop: -6,
    minWidth: 80,
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});

export default AppointmentCard; 