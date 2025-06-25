import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OutlinedButton from './OutlinedButton';

const ViewMusicCard = ({ music, onRemove, type = 'music' }) => {
  // Format date to string if it's a Date object
  const formatDate = (date) => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{music.name || music.title}</Text>
          <View style={[styles.detailRow, styles.firstDetailRow]}><Ionicons name="calendar-outline" size={18} color="#0366d6" /><Text style={styles.detailLabel}>Date: </Text><Text style={styles.detailValue}>{formatDate(music.startDate)}{music.endDate ? ` - ${formatDate(music.endDate)}` : ''}</Text></View>
          {music.repeatType && (
            <View style={styles.detailRow}><Ionicons name="repeat" size={18} color="#0366d6" /><Text style={styles.detailLabel}>Repeat: </Text><Text style={styles.detailValue}>{music.repeatType === 'Daily' ? `${music.numDays} Day${music.numDays > 1 ? 's' : ''}` : music.repeatType === 'Weekly' ? `${music.numWeeks} Week${music.numWeeks > 1 ? 's' : ''}` : music.repeatType}</Text></View>
          )}
          {music.weekDays && music.weekDays.length > 0 && (
            <View style={styles.detailRow}><Ionicons name="calendar" size={18} color="#0366d6" /><Text style={styles.detailLabel}>Days: </Text><Text style={styles.detailValue}>{music.weekDays.join(', ')}</Text></View>
          )}
          {music.medTimes && music.medTimes.length > 0 && (
            <View style={styles.detailRow}><Ionicons name="time-outline" size={18} color="#0366d6" /><Text style={styles.detailLabel}>Time: </Text><Text style={styles.detailValue}>{music.medTimes.join(', ')}</Text></View>
          )}
          {music.instructions && (
            <View style={styles.instructionsRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="information-circle-outline" size={18} color="#0366d6" />
                <Text style={styles.detailLabel}>Instructions:</Text>
              </View>
              <Text style={styles.instructionsValue}>{music.instructions}</Text>
            </View>
          )}
        </View>
        <View style={styles.rightColumn}>
          {music.imageUri ? (
            <Image source={{ uri: music.imageUri }} style={styles.iconImage} />
          ) : (
            <View style={styles.iconPlaceholder}>
              <Ionicons name={type === 'medicine' ? 'medkit' : 'musical-notes'} size={32} color="#0366d6" />
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(music.id)}>
        <Text style={styles.removeButtonText} numberOfLines={1} ellipsizeMode="clip">Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 16,
    elevation: 0,
    shadowColor: 'transparent',
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: 1,
    paddingRight: 8,
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  rightColumn: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  firstDetailRow: {
    marginTop: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#222',
    marginLeft: 6,
  },
  detailValue: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
  removeButton: {
    backgroundColor: '#fde8e8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  removeButtonText: {
    color: '#e53935',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginTop: 10,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f0fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  instructionsRow: {
    marginTop: 0,
    marginBottom: 6,
  },
  instructionsValue: {
    fontSize: 15,
    color: '#555',
    marginLeft: 24,
    marginTop: 2,
    fontWeight: '490',
  },
});

export default ViewMusicCard; 