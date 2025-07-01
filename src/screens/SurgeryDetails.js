import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import PrimaryButton from '../../src/components/PrimaryButton';
import OutlinedButton from '../../src/components/OutlinedButton';
import Header from '../../src/components/Header';
import NoteInput from '../../src/components/NoteInput';
import { Ionicons } from '@expo/vector-icons';

const mockData = {
  status: 'Scheduled',
  name: 'Yuvraj Singh',
  details: '35, Male · Bed 201, Ward A',
  avatar: require('../../assets/images/UserIcon.png'),
  procedure: 'Appendectomy',
  notes: 'Patient has acute appendicitis. Prepare for laparoscopic surgery.',
  surgeryType: 'Laparoscopic',
  category: 'Emergency',
  checklist: [
    { label: 'Patient Consent', checked: true },
    { label: 'Anesthesia Clearance', checked: true },
    { label: 'Lab Results', checked: false },
    { label: 'Imaging Review', checked: false },
  ],
  vitals: [
    { label: 'Temperature', value: '37.2°C', icon: 'thermometer' },
    { label: 'Blood Pressure', value: '120/80 mmHg', icon: 'speedometer' },
    { label: 'Heart Rate', value: '75 bpm', icon: 'heart' },
    { label: 'Oxygen Saturation', value: '98%', icon: 'pulse' },
  ],
  attachments: [
    { name: 'Lab Results.pdf', type: 'pdf', size: '2.4 MB' },
    { name: 'Imaging Report.pdf', type: 'pdf', size: '5.1 MB' },
  ],
};

const SurgeryDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [checklist, setChecklist] = useState(mockData.checklist);
  const [addNoteModalVisible, setAddNoteModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(mockData.notes);

  const handleToggle = idx => {
    setChecklist(prev => prev.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item));
  };

  // Use params if provided, else fallback to mockData
  const data = { ...mockData, ...params };

  // Parse attachments if passed as a string
  let attachments = data.attachments;
  if (typeof attachments === 'string') {
    try {
      attachments = JSON.parse(attachments);
    } catch {
      attachments = [];
    }
  }

  // Handle Add Note modal submit
  const handleSubmitNote = () => {
    if (noteText.trim()) {
      setNotes(noteText.trim());
      setAddNoteModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Surgery Details" onBack={() => router.back()} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Patient Card */}
        <View style={styles.patientCard}>
          <View style={styles.patientInfo}>
            <View style={[styles.statusBadge, data.status === 'Completed' ? styles.completedBadge : styles.scheduledBadge]}>
              <Text style={styles.statusBadgeText}>{data.status}</Text>
            </View>
            <Text style={styles.patientName}>{data.name}</Text>
            <Text style={styles.patientDetails}>{data.details}</Text>
          </View>
          <Image source={data.avatar} style={styles.avatar} />
        </View>

        {/* Surgery Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Surgery Information</Text>
          
          <View style={styles.detailItem}>
            <Ionicons name="medkit" size={20} color="#4b7bec" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Procedure</Text>
              <Text style={styles.detailValue}>{data.procedure}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="document-text" size={20} color="#4b7bec" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Notes</Text>
              <Text style={styles.detailValue}>{notes}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="options" size={20} color="#4b7bec" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Surgery Type</Text>
              <Text style={styles.detailValue}>{data.surgeryType}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="warning" size={20} color="#4b7bec" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{data.category}</Text>
            </View>
          </View>
        </View>

        {/* Checklist Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pre-Op Checklist</Text>
          {checklist.map((item, idx) => (
            <TouchableOpacity 
              key={item.label} 
              style={styles.checklistItem} 
              onPress={() => handleToggle(idx)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, item.checked && styles.checkedBox]}>
                {item.checked && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={[styles.checklistLabel, item.checked && styles.checkedLabel]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Vitals Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vitals Snapshot</Text>
          <View style={styles.vitalsGrid}>
            {data.vitals.map((vital, index) => (
              <View key={index} style={styles.vitalItem}>
                <View style={styles.vitalIconContainer}>
                  <Ionicons name={vital.icon} size={20} color="#4b7bec" />
                </View>
                <Text style={styles.vitalLabel}>{vital.label}</Text>
                <Text style={styles.vitalValue}>{vital.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Attachments Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attachments</Text>
          {attachments.map((att, idx) => (
            <View key={idx} style={styles.attachmentItem}>
              <View style={styles.attachmentIcon}>
                <Ionicons name="document" size={24} color="#4b7bec" />
              </View>
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentName}>{att.name}</Text>
                <Text style={styles.attachmentSize}>{att.size}</Text>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <Ionicons name="download" size={20} color="#4b7bec" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Action Buttons (back inside ScrollView) */}
        <View style={styles.actionsContainer}>
          <PrimaryButton 
            style={styles.primaryButton} 
            textStyle={styles.primaryButtonText}
          >
            Mark as Completed
          </PrimaryButton>
          <OutlinedButton 
            style={styles.secondaryButton}
            textStyle={styles.secondaryButtonText}
            onPress={() => setAddNoteModalVisible(true)}
          >
            Add Notes
          </OutlinedButton>
        </View>
      </ScrollView>
      {/* Add Note Modal */}
      <Modal
        visible={addNoteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddNoteModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ width: '88%', maxWidth: 360, backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#222' }}>Add Note</Text>
            <NoteInput
              style={{ width: '100%', minHeight: 100, marginBottom: 18 }}
              placeholder="Write your note here..."
              value={noteText}
              onChangeText={setNoteText}
            />
            <PrimaryButton
              style={{ width: '100%', height: 48, borderRadius: 12, backgroundColor: '#0366D6', justifyContent: 'center', alignItems: 'center' }}
              textStyle={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}
              onPress={handleSubmitNote}
            >
              Submit
            </PrimaryButton>
            <OutlinedButton
              style={{ width: '100%', height: 44, borderRadius: 12, marginTop: 10, backgroundColor: '#F2F2F2', justifyContent: 'center', alignItems: 'center' }}
              textStyle={{ color: '#222', fontSize: 16, fontWeight: 'bold' }}
              onPress={() => setAddNoteModalVisible(false)}
            >
              Cancel
            </OutlinedButton>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  patientInfo: {
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  scheduledBadge: {
    backgroundColor: '#ffeaa7',
  },
  completedBadge: {
    backgroundColor: '#55efc4',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#636e72',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginLeft: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#2d3436',
    fontWeight: '500',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#dfe6e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkedBox: {
    backgroundColor: '#4b7bec',
    borderColor: '#4b7bec',
  },
  checklistLabel: {
    fontSize: 16,
    color: '#2d3436',
    flex: 1,
  },
  checkedLabel: {
    textDecorationLine: 'line-through',
    color: '#636e72',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalItem: {
    width: '48%',
    backgroundColor: '#f1f5fd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  vitalIconContainer: {
    backgroundColor: '#e1e9fc',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalLabel: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  attachmentIcon: {
    marginRight: 12,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2d3436',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    color: '#636e72',
  },
  downloadButton: {
    padding: 8,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: -12,
    marginBottom: -12,
  },
  primaryButton: {
    backgroundColor: '#0366d6',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderColor: '#0366d6',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 0,
  },
  secondaryButtonText: {
    color: '#0366d6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SurgeryDetails;