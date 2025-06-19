import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import OutlinedButton from './OutlinedButton';

function formatDateDMY(date) {
  if (!date) return '';
  if (typeof date === 'string') return date;
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

const MusicCard = ({
  title,
  subtitle,
  image,
  buttonText,
  onButtonPress,
  buttonStyle,
  disabled,
  startDate,
  endDate,
  medTimes,
  instructions,
}) => (
  <View style={styles.card}>
    <Image
      source={image || require('../../assets/images/UserIcon.png')}
      style={styles.image}
      resizeMode="cover"
    />
    <View style={styles.detailsContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {buttonText && buttonText.toLowerCase() === 'remove' && (
          <TouchableOpacity
            style={styles.removeChip}
            onPress={onButtonPress}
            disabled={disabled}
          >
            <Text style={styles.removeChipText}>{buttonText}</Text>
          </TouchableOpacity>
        )}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {(startDate || endDate) && (
        <View style={styles.row}>
          {startDate && <><Text style={styles.detailLabel}>Start:</Text><Text style={styles.detailValue}>{formatDateDMY(startDate)}</Text></>}
          {endDate && <><Text style={[styles.detailLabel, { marginLeft: 12 }]}>End:</Text><Text style={styles.detailValue}>{formatDateDMY(endDate)}</Text></>}
        </View>
      )}
      {medTimes && medTimes.length > 0 && (
        <View style={styles.medTimesRow}>
          {medTimes.map((time, idx) => (
            <View key={idx} style={styles.medTimeChip}><Text style={styles.medTimeText}>{time}</Text></View>
          ))}
        </View>
      )}
      {instructions && (
        <View style={{ marginTop: 4 }}>
          <Text style={styles.detailLabel}>Instructions:</Text>
          <Text style={styles.instructions}>{instructions}</Text>
        </View>
      )}
      {/* Select button at the bottom, right-aligned */}
      {buttonText && buttonText.toLowerCase() !== 'remove' && (
        <TouchableOpacity
          style={[styles.selectChip, { alignSelf: 'flex-end', marginTop: 12 }]}
          onPress={onButtonPress}
          disabled={disabled}
        >
          <Text style={styles.selectChipText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 20,
    backgroundColor: '#f2f2f2',
    marginTop: 2,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 13,
    color: '#888',
    marginRight: 2,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#888',
    marginRight: 10,
    fontWeight: '500',
  },
  medTimesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 2,
  },
  medTimeChip: {
    backgroundColor: '#e6f0fa',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  medTimeText: {
    color: '#0366d6',
    fontSize: 13,
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 15,
    color: '#222',
    marginTop: 2,
    fontWeight: '400',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  removeChip: {
    backgroundColor: '#fde8e8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
  },
  removeChipText: {
    color: '#e53935',
    fontSize: 13,
    fontWeight: 'bold',
  },
  selectChip: {
    backgroundColor: '#e6f0fa',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  selectChipText: {
    color: '#0366d6',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default MusicCard; 