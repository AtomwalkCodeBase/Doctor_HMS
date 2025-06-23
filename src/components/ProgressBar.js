import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressBar = ({ completed, total }) => {
  const progress = completed / total;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.bold}>{completed}</Text>
        <Text style={styles.text}>/{total} appointments completed</Text>
      </Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 2,
  },
  text: {
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
    fontWeight: '400',
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#E5E7EB', // light gray
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    backgroundColor: '#111', // dark gray/black
    borderRadius: 4,
  },
});

export default ProgressBar; 