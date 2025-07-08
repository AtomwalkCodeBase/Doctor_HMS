import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const defaultAvatar = require('../../assets/images/UserIcon.png');

// Status color mapping
const STATUS_COLORS = {
  Completed: '#22C55E', // Green
  Pending: '#FFB300', // Orange
  'Needs Attention': '#ffe066', // Yellow
  critical: '#ff6b6b', // Red
  Stable: '#8DD8FF', // Blue
  'Round Completed': '#4ade80', // Green
  Scheduled: '#60A5FA', // Blue
};

const STATUS_TEXT_COLORS = {
  Completed: '#fff',
  Pending: '#fff',
  'Needs Attention': '#222',
  critical: '#fff',
  Stable: '#222',
  'Round Completed': '#fff',
  Scheduled: '#fff',
};

// Helper to get the most important status for button color
const getPrimaryStatus = (statusArr) => {
  if (!statusArr || statusArr.length === 0) return 'Pending';
  // Priority: critical > Needs Attention > Pending > Stable > Completed > Round Completed
  const priority = [
    'critical',
    'Needs Attention',
    'Pending',
    'Stable',
    'Completed',
    'Round Completed',
  ];
  for (let p of priority) {
    if (statusArr.map(s => (s || '').toLowerCase()).includes(p.toLowerCase())) {
      return p;
    }
  }
  return statusArr[0];
};

const AppointmentCard = ({ name, id, date, time, status, onPress, avatar, containerStyle }) => {
  // Normalize status to array
  const statusArr = Array.isArray(status) ? status : status ? [status] : ['Pending'];
  const primaryStatus = getPrimaryStatus(statusArr);
  const getStatusColor = (s) => STATUS_COLORS[s] || '#9E9E9E';
  const getStatusTextColor = (s) => STATUS_TEXT_COLORS[s] || '#222';

  // Card style
  const getCardStyle = () => {
    return [
      styles.card,
      { borderLeftColor: getStatusColor(primaryStatus), borderLeftWidth: 4 }
    ];
  };

  return (
    <View style={[getCardStyle(), containerStyle]}>
      <View style={styles.contentContainer}>
        {/* Patient Info */}
        <Text style={styles.name}>{name}</Text>
        <View style={styles.idRow}>
          <Ionicons name="person-outline" size={16} color="#757575" style={styles.idIcon} />
          <Text style={styles.idText}>ID: {id}</Text>
        </View>
        {/* Date Row */}
        <View style={styles.timeRow}>
          <Ionicons name="calendar-outline" size={14} color="#616161" />
          <Text style={styles.date}> {date}</Text>
        </View>
        {/* Time Row (only if time is provided) */}
        {time ? (
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color="#616161" />
            <Text style={styles.time}> {time}</Text>
          </View>
        ) : null}
        {/* Details Button */}
        <TouchableOpacity
          style={[
            styles.detailsButton,
            { backgroundColor: '#F0F2F5' }
          ]}
          onPress={onPress}
        >
          <Text style={styles.detailsText}>See Details</Text>
          <Ionicons name="chevron-forward" size={14} color="#111" />
        </TouchableOpacity>
      </View>
      {/* Avatar and Status Badges Column */}
      <View style={styles.avatarContainer}>
        {/* Status Badges */}
        <View style={styles.statusBadgesRow}>
          {statusArr.map((s, idx) => (
            <View
              key={idx}
              style={[
                styles.statusContainer,
                { backgroundColor: getStatusColor(s) }
              ]}
            >
              <Text style={[styles.statusText, { color: getStatusTextColor(s) }]}>{String(s).toUpperCase()}</Text>
            </View>
          ))}
        </View>
        <Image
          source={avatar || defaultAvatar}
          style={styles.avatar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  contentContainer: {
    flex: 1,
  },
  avatarContainer: {
    marginLeft: 16,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    minWidth: 160,
  },
  statusBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusContainer: {
    alignSelf: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 2,
    marginBottom: 0,
    minWidth: 60,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 3,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  idIcon: {
    marginRight: 4,
  },
  idText: {
    fontSize: 14,
    color: '#757575',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  date: {
    fontSize: 15,
    color: '#616161',
  },
  time: {
    fontSize: 15,
    color: '#616161',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 7,
    marginTop: 8,
  },
  detailsText: {
    color: '#111',
    fontWeight: '500',
    fontSize: 16,
    marginRight: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#f5e3d7',
  },
});

export default AppointmentCard; 