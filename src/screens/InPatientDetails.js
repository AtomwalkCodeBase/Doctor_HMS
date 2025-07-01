import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  SafeAreaView,
  Modal,
} from 'react-native';
import Header from '../components/Header';
import VitalCard from '../components/VitalCard';
import PrimaryButton from '../components/PrimaryButton';
import OutlinedButton from '../components/OutlinedButton';
import NoteInput from '../components/NoteInput';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DatePickerField from '../components/DatePickerField';

const vitalsData = [
  {
    icon: 'heart',
    label: 'Heart Rate',
    value: '72 bpm',
    iconColor: '#EF4444',
    iconSet: 'Ionicons',
  },
  {
    icon: 'thermometer',
    label: 'Temperature',
    value: '98.6°F',
    iconColor: '#F59E0B',
    iconSet: 'Ionicons',
  },
  {
    icon: 'water',
    label: 'BP',
    value: '120/80',
    iconColor: '#3B82F6',
    iconSet: 'Ionicons',
  },
  {
    icon: 'pulse',
    label: 'SpO2',
    value: '98%',
    iconColor: '#10B981',
    iconSet: 'Ionicons',
  },
];

const overviewData = {
  diagnosis: 'Pneumonia',
  chiefComplaint: 'Shortness of breath, cough',
  admissionDate: '2024-07-26',
  physician: 'Dr. Roshit Singh',
  notes: 'Patient showing improvement in breathing. Continue current treatment plan.',
};

const TABS = ['Overview', 'Vitals', 'Medications'];

const InPatientDetails = () => {
  const router = useRouter();
  const [roundsDone, setRoundsDone] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Overview');
  const [addNoteModalVisible, setAddNoteModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(overviewData.notes);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleAddNote = () => {
    setAddNoteModalVisible(true);
    setNoteText('');
  };

  const handleSubmitNote = () => {
    if (noteText.trim()) {
      setNotes(noteText.trim());
      setAddNoteModalVisible(false);
    }
  };

  const formatDateDMY = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="In Patient Details" onBack={() => router.back()} />
      
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Profile Section */}
        <View style={styles.profileContainer}>
          <Image 
            source={require('../../assets/images/UserIcon.png')} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Critical</Text>
            </View>
            <Text style={styles.patientName}>Yuvraj Singh</Text>
            <Text style={styles.patientDetails}>35, Male • Bed 302, Ward B</Text>
          </View>
        </View>

        {/* Rounds Toggle */}
        <View style={styles.roundsContainer}>
          <View>
            <Text style={styles.roundsLabel}>Mark Rounds as Done</Text>
            <Text style={styles.roundsSubtext}>Last updated: Today, 11:45 AM</Text>
          </View>
          <Switch
            value={roundsDone}
            onValueChange={setRoundsDone}
            trackColor={{ false: '#E5E7EB', true: '#0366d6' }}
            thumbColor={roundsDone ? '#fff' : '#fff'}
          />
        </View>

        {/* Vitals Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vitalsScroll}
        >
          {vitalsData.map((vital, index) => (
            <VitalCard 
              key={`vital-${index}`} 
              {...vital} 
              style={styles.vitalCard}
            />
          ))}
        </ScrollView>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab && styles.activeTabButton
              ]}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {/* Overview Tab */}
          {selectedTab === 'Overview' && (
            <>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons name="medical" size={18} color="#0366d6" />
                  <Text style={styles.infoLabel}>Diagnosis</Text>
                  <Text style={styles.infoValue}>{overviewData.diagnosis}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons name="warning" size={18} color="#0366d6" />
                  <Text style={styles.infoLabel}>Chief Complaint</Text>
                  <Text style={styles.infoValue}>{overviewData.chiefComplaint}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons name="calendar" size={18} color="#0366d6" />
                  <Text style={styles.infoLabel}>Admission Date</Text>
                  <Text style={styles.infoValue}>{overviewData.admissionDate}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Ionicons name="person" size={18} color="#0366d6" />
                  <Text style={styles.infoLabel}>Attending Physician</Text>
                  <Text style={styles.infoValue}>{overviewData.physician}</Text>
                </View>
              </View>

              <View style={styles.notesCard}>
                <View style={styles.notesHeader}>
                  <Ionicons name="document-text" size={20} color="#0366d6" />
                  <Text style={styles.notesTitle}>Clinical Notes</Text>
                </View>
                <Text style={styles.notesText}>{notes}</Text>
              </View>

              <View style={styles.buttonRow}>
                <OutlinedButton 
                  style={styles.medsButton}
                  onPress={() => setSelectedTab('Medications')}
                  icon="medkit-outline"
                >
                  Manage Medications
                </OutlinedButton>
                <PrimaryButton 
                  style={styles.noteButton}
                  onPress={handleAddNote}
                  icon="create-outline"
                >
                  Add Note
                </PrimaryButton>
              </View>

              <PrimaryButton 
                style={styles.testsButton}
                onPress={() => {}}
                icon="flask-outline"
              >
                Order Tests
              </PrimaryButton>
            </>
          )}

          {/* Vitals Tab */}
          {selectedTab === 'Vitals' && (
            <>
              <View style={styles.dateSelector}>
                <View style={{ width: 140 }}>
                  <DatePickerField
                    value={selectedDate}
                    onChange={setSelectedDate}
                    placeholder="Select Date"
                    style={{ marginTop: 0, marginBottom: 0, height: 48, backgroundColor: '#0366d6' }}
                    textColor="#fff"
                  />
                </View>
              </View>
              <View style={styles.vitalsHistoryCard}>
                <View style={styles.vitalHistoryRow}>
                  <View style={styles.vitalHistoryItem}>
                    <View style={styles.vitalHistoryIcon}>
                      <Ionicons name="calendar" size={16} color="#0366d6" />
                    </View>
                    <Text style={styles.vitalHistoryLabel}>Date</Text>
                    <Text style={styles.vitalHistoryValue}>07/20/2024</Text>
                  </View>
                  <View style={styles.vitalHistoryItem}>
                    <View style={styles.vitalHistoryIcon}>
                      <Ionicons name="speedometer" size={16} color="#0366d6" />
                    </View>
                    <Text style={styles.vitalHistoryLabel}>Respiratory Rate</Text>
                    <Text style={styles.vitalHistoryValue}>16 breaths/min</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.vitalHistoryRow}>
                  <View style={styles.vitalHistoryItem}>
                    <View style={styles.vitalHistoryIcon}>
                      <Ionicons name="heart" size={16} color="#0366d6" />
                    </View>
                    <Text style={styles.vitalHistoryLabel}>Heart Rate</Text>
                    <Text style={styles.vitalHistoryValue}>72 bpm</Text>
                  </View>
                  <View style={styles.vitalHistoryItem}>
                    <View style={styles.vitalHistoryIcon}>
                      <Ionicons name="water" size={16} color="#0366d6" />
                    </View>
                    <Text style={styles.vitalHistoryLabel}>Blood Pressure</Text>
                    <Text style={styles.vitalHistoryValue}>120/80 mmHg</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.vitalHistoryRow}>
                  <View style={styles.vitalHistoryItem}>
                    <View style={styles.vitalHistoryIcon}>
                      <Ionicons name="thermometer" size={16} color="#0366d6" />
                    </View>
                    <Text style={styles.vitalHistoryLabel}>Temperature</Text>
                    <Text style={styles.vitalHistoryValue}>98.6 °F</Text>
                  </View>
                  <View style={styles.vitalHistoryItem}>
                    <View style={styles.vitalHistoryIcon}>
                      <Ionicons name="pulse" size={16} color="#0366d6" />
                    </View>
                    <Text style={styles.vitalHistoryLabel}>SpO2</Text>
                    <Text style={styles.vitalHistoryValue}>98 %</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Medications Tab */}
          {selectedTab === 'Medications' && (
            <View style={styles.medsPlaceholder}>
              <Ionicons name="medkit" size={48} color="#0366d6" />
              <Text style={styles.medsPlaceholderText}>Medications details will appear here</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Note Modal */}
      <Modal
        visible={addNoteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddNoteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Clinical Note</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setAddNoteModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <NoteInput
              style={styles.noteInput}
              placeholder="Enter your clinical notes here..."
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={5}
            />

            <View style={styles.modalButtons}>
              <OutlinedButton
                style={styles.cancelButton}
                onPress={() => setAddNoteModalVisible(false)}
              >
                Cancel
              </OutlinedButton>
              <PrimaryButton
                style={styles.submitButton}
                onPress={handleSubmitNote}
              >
                Save Note
              </PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: '#E5E7EB',
  },
  profileInfo: {
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#FEE2E2',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  patientName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 16,
    color: '#6B7280',
  },
  roundsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  roundsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  roundsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  vitalsScroll: {
    paddingLeft: 16,
    paddingVertical: 8,
  },
  vitalCard: {
    marginRight: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    marginVertical: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: '#e6f0fa',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
  },
  activeTabText: {
    color: '#0366d6',
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
    marginLeft: 12,
    width: 140,
  },
  infoValue: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
  },
  notesText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -12,
    marginBottom: 8,
    gap: 12,
  },
  medsButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#0366d6',
    borderWidth: 1,
    paddingVertical: 16,
  },
  noteButton: {
    flex: 1,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testsButton: {
    width: '100%',
    paddingVertical: 16,
    marginTop: 10,
    marginBottom: -35,
  },
  dateSelector: {
    marginBottom: 16,
  },
  vitalsHistoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  vitalHistoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  vitalHistoryItem: {
    flex: 1,
    paddingHorizontal: 8,
  },
  vitalHistoryIcon: {
    backgroundColor: '#F1F5FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalHistoryLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  vitalHistoryValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  medsPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  medsPlaceholderText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalCloseButton: {
    padding: 4,
  },
  noteInput: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  submitButton: {
    width: 120,
  },
});

export default InPatientDetails;