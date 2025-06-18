import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';
import { Ionicons } from '@expo/vector-icons';

const TASKS = [
  {
    label: 'Medicine',
    iconName: 'medkit-outline',
    iconBg: '#e6f0fa',
    iconColor: '#0366d6',
  },
  {
    label: 'Music',
    iconName: 'musical-notes',
    iconBg: '#e6f0fa',
    iconColor: '#0366d6',
  },
  {
    label: 'Exercise',
    iconName: 'bicycle',
    iconBg: '#e6f0fa',
    iconColor: '#0366d6',
  },
];

const TaskCard = ({ label, iconName, iconBg, iconColor, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.iconContainer, { backgroundColor: iconBg }]}> 
      <Ionicons name={iconName} size={85} color={iconColor} />
    </View>
    <Text style={styles.cardLabel}>{label}</Text>
  </TouchableOpacity>
);

const AddTask = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Header title="Post Medication Activity" onBack={() => router.back()} />
      <View style={styles.content}>
        <View style={styles.gridContainer}>
          {/* Top Row */}
          <View style={styles.gridRow}>
            <TaskCard key="medicine" {...TASKS[0]} onPress={() => router.push('/AddTask/medicine')} />
            <TaskCard key="music" {...TASKS[1]} onPress={() => router.push({ pathname: '/AddTask/music', params: { patientName: params.patientName, appointmentTime: params.appointmentTime, appointmentDate: params.appointmentDate } })} />
          </View>
          {/* Second Row */}
          <View style={styles.gridRow}>
            <TaskCard key="exercise" {...TASKS[2]} onPress={() => router.push({ pathname: '/AddTask/exercise', params: { patientName: params.patientName, appointmentTime: params.appointmentTime, appointmentDate: params.appointmentDate } })} />
            <View style={styles.cardPlaceholder} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  gridContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
    width: '45%',
    minHeight: 170,
    marginHorizontal: 0,
    marginBottom: 0,
    elevation: 0,
    shadowColor: 'transparent',
  },
  cardPlaceholder: {
    width: '45%',
    minHeight: 170,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: '#e6f0fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0366d6',
    textAlign: 'center',
    marginTop: 6,
    fontFamily: 'System',
  },
});

export default AddTask; 