import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomStatusBar from '../components/StatusBar';
import VitalCard from '../components/VitalCard';
import ActionButton from '../components/ActionButton';
import Header from '../components/Header';
import { processBookingData } from '../services/productServices';

const PatientDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isPressed, setIsPressed] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [prescriptionName, setPrescriptionName] = useState('');

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
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <Text style={styles.infoText}>ID: {params.customer_id || 'N/A'}</Text>
          </View>
          
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.vitalsContainer}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
        >
          <VitalCard
            icon="heart"
            label="Heart Rate"
            value="72 bpm"
            iconColor="#EF4444"
            backgroundColor="#fff"
          />
          <VitalCard
            icon="thermometer"
            label="Temperature"
            value="98.6°F"
            iconColor="#F59E0B"
            backgroundColor="#fff"
          />
          <VitalCard
            icon="water"
            label="BP"
            value="120/80"
            iconColor="#3B82F6"
            backgroundColor="#fff"
          />
          <VitalCard
            icon="pulse"
            label="SpO2"
            value="98%"
            iconColor="#10B981"
            backgroundColor="#fff"
          />
        </ScrollView>

        {/* Prescription Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescription Name</Text>
          <TextInput
            style={styles.prescriptionInput}
            placeholder="Enter prescription name..."
            placeholderTextColor="#9CA3AF"
            value={prescriptionName}
            onChangeText={setPrescriptionName}
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
            value={symptoms}
            onChangeText={setSymptoms}
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
              onPress={() => router.push('/OrderTest')}
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
          onPress={async () => {
            try {
              const booking_data = {
                customer_id: params.customer_id,
                equipment_id: params.equipment_id,
                booking_date: params.booking_date,
                start_time: params.start_time,
                end_time: params.end_time,
                duration: params.duration,
                call_mode: 'COMPLETE',
                status: 'COMPLETE',
                remarks: symptoms,
                booking_id: params.booking_id,
              };
              console.log('Booking Data to POST:', booking_data);
              await processBookingData(booking_data);
              Alert.alert('Success', 'Booking marked as complete!');
            } catch (err) {
              Alert.alert('Error', 'Failed to complete booking.');
            }
          }}
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
    paddingTop: 16,
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
  prescriptionInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    height: 40,
    fontSize: 16,
  },
  symptomsInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    height: 120,
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