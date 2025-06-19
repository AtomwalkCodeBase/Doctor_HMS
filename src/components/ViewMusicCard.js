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
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{music.name || music.title}</Text>
          {music.food && <Text style={styles.cardSubtitle}>{Array.isArray(music.food) ? music.food.join(', ') : music.food}</Text>}
        </View>
        <View style={styles.cardImageContainer}>
          {music.imageUri ? (
            <Image source={{ uri: music.imageUri }} style={styles.cardImage} />
          ) : (
            <View style={styles.cardImagePlaceholder}>
              <Ionicons name={type === 'medicine' ? 'medkit' : 'musical-notes'} size={24} color="#0366d6" />
            </View>
          )}
        </View>
      </View>
      <View style={styles.cardDetails}>
        {(music.startDate || music.endDate) && (
          <View style={styles.cardDetailRow}>
            <Ionicons name="calendar-outline" size={18} color="#0366d6" />
            <Text style={styles.cardDetailText}>
              {formatDate(music.startDate)} - {formatDate(music.endDate)}
            </Text>
          </View>
        )}
        {music.medTimes && (
          <View style={styles.cardDetailRow}>
            <Ionicons name="time-outline" size={18} color="#0366d6" />
            <Text style={styles.cardDetailText}>
              {Array.isArray(music.medTimes) ? music.medTimes.join(', ') : music.medTimes}
            </Text>
          </View>
        )}
        {music.note && (
          <View style={styles.cardDetailRow}>
            <Ionicons name="information-circle-outline" size={18} color="#0366d6" />
            <Text style={styles.cardDetailText}>{music.note}</Text>
          </View>
        )}
      </View>
      <OutlinedButton style={styles.removeButtonOutlined} onPress={() => onRemove(music.id)}>
        Remove
      </OutlinedButton>
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginLeft: 12,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e6f0fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetails: {
    marginTop: 12,
  },
  cardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardDetailText: {
    marginLeft: 8,
    fontSize: 11,
    color: '#666',
  },
  removeButtonOutlined: {
    alignSelf: 'flex-end',
    marginTop: 14,
    backgroundColor: '#f2f2f2',
    color: '#222',
    borderWidth: 0,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
});

export default ViewMusicCard; 