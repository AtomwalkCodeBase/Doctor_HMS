import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomStatusBar from '../components/StatusBar';
import VitalCard from '../components/VitalCard';
import ActionButton from '../components/ActionButton';
import Header from '../components/Header';

const PatientDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <Header title="Patient Details" onBack={() => router.back()} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Patient Info */}
        <View style={styles.patientInfo}>
          <Image
            source={require('../../assets/images/UserIcon.png')}
            style={styles.avatar}
          />
          <Text style={styles.patientName}>{params.patientName || 'Unknown'}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text style={styles.infoText}>{params.appointmentDate || 'No date'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text style={styles.infoText}>{params.appointmentTime || 'No time'}</Text>
          </View>
        </View>

        {/* Vitals Summary */}
        <View style={styles.vitalsContainer}>
          <VitalCard
            icon="heart"
            label="Body Weight"
            value="70 Kg"
            iconColor="#EF4444"
          />
          <VitalCard
            icon="thermometer"
            label="Body Temperature"
            value="37.2 Celsius"
            iconColor="#F59E0B"
          />
          <VitalCard
            icon="pulse"
            label="Blood Pressure"
            value="120/80 mmHg"
            iconColor="#EC4899"
          />
        </View>

        {/* Issue/Symptoms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issue / Symptoms</Text>
          <TextInput
            style={styles.symptomsInput}
            multiline
            placeholder="Enter patient symptoms..."
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Action Buttons Grid */}
        <View style={styles.actionGrid}>
          <View style={styles.actionRow}>
            <ActionButton
              icon="add-circle-outline"
              label="Add Tasks"
              onPress={() => router.push({
                pathname: '/AddTask',
                params: {
                  patientName: params.patientName,
                  appointmentTime: params.appointmentTime,
                  appointmentDate: params.appointmentDate,
                },
              })}
            />
            <ActionButton
              icon="list-outline"
              label="View Tasks"
              onPress={() => {}}
            />
          </View>
          <View style={styles.actionRow}>
            <ActionButton
              icon="flask-outline"
              label="Order Tests"
              onPress={() => {}}
            />
            <ActionButton
              icon="document-text-outline"
              label="Test Results"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isPressed && styles.submitButtonPressed
          ]} 
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={1}
        >
          <Text style={[
            styles.submitButtonText,
            isPressed && styles.submitButtonTextPressed
          ]}>
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  patientInfo: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 16,
  },
  vitalsContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    marginTop: 0,
  },
  section: {
    padding: 16,
    marginTop: -8,
    marginBottom: -16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  symptomsInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    height: 150,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  actionGrid: {
    padding: 16,
    marginTop: 0,
    paddingBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  submitButton: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonPressed: {
    backgroundColor: '#0366d6',
    borderColor: '#0366d6',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  submitButtonTextPressed: {
    color: '#fff',
  },
});

export default PatientDetails; 