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
import DateTimePicker from '@react-native-community/datetimepicker';

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
  notes:
    'Patient showing improvement in breathing. Continue current treatment plan.',
};

const TABS = ['Overview', 'Vitals', 'Medications'];

const InPatientDetails = () => {
  const router = useRouter();
  const [roundsDone, setRoundsDone] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Overview');
  const [addNoteModalVisible, setAddNoteModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(overviewData.notes);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
        {/* Patient Info Section */}
        <View style={styles.patientInfoSection}>
          <Image source={require('../../assets/images/UserIcon.png')} style={styles.avatar} />
          <View style={styles.patientInfoTextCol}>
            <Text style={styles.patientName}>Yuvraj Singh</Text>
            <Text style={styles.patientSubtext}>Critical Condition{"\n"}Room 302, Ward B</Text>
          </View>
        </View>
        {/* Toggle Section */}
        <View style={styles.toggleSection}>
          <View>
            <Text style={styles.toggleLabel}>Mark Rounds as Done</Text>
            <Text style={styles.toggleSubtext}>Last Updated: 11:45 AM</Text>
          </View>
          <Switch
            value={roundsDone}
            onValueChange={setRoundsDone}
            trackColor={{ false: '#E5E7EB', true: '#0366d6' }}
            thumbColor={roundsDone ? '#fff' : '#fff'}
            style={styles.toggleSwitch}
          />
        </View>
        {/* Vitals Scroll Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.vitalsScroll}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {vitalsData.map((v, idx) => (
            <VitalCard key={v.label} {...v} />
          ))}
        </ScrollView>
        {/* Tabs Section */}
        <View style={styles.tabsSection}>
          {TABS.map((tab, idx) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabBtn}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>{tab}</Text>
              {selectedTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>
        {/* Overview Section */}
        {selectedTab === 'Overview' && (
          <View style={styles.overviewSection}>
            <View style={styles.sectionField}>
              <Text style={styles.fieldLabel}>Diagnosis</Text>
              <Text style={styles.fieldValue}>{overviewData.diagnosis}</Text>
            </View>
            <View style={styles.sectionField}>
              <Text style={styles.fieldLabel}>Chief Complaint</Text>
              <Text style={styles.fieldValue}>{overviewData.chiefComplaint}</Text>
            </View>
            <View style={styles.sectionField}>
              <Text style={styles.fieldLabel}>Admission Date</Text>
              <Text style={styles.fieldValue}>{overviewData.admissionDate}</Text>
            </View>
            <View style={styles.sectionField}>
              <Text style={styles.fieldLabel}>Attending Physician</Text>
              <Text style={styles.fieldValue}>{overviewData.physician}</Text>
            </View>
            <View style={[styles.sectionField, styles.lastSectionField]}>
              <Text style={styles.fieldLabel}>Notes</Text>
              <Text style={styles.fieldValue}>{notes}</Text>
            </View>
            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <PrimaryButton
                style={styles.addNoteBtn}
                textStyle={styles.addNoteBtnText}
                onPress={handleAddNote}
              >
                Add Note
              </PrimaryButton>
              <OutlinedButton
                style={styles.manageMedBtn}
                textStyle={styles.manageMedBtnText}
                onPress={() => setSelectedTab('Medications')}
              >
                Manage Medications
              </OutlinedButton>
            </View>
            <PrimaryButton
              style={styles.orderTestsBtn}
              textStyle={styles.orderTestsBtnText}
              onPress={() => {}}
            >
              Order Tests
            </PrimaryButton>
            {/* Add Note Modal */}
            <Modal
              visible={addNoteModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setAddNoteModalVisible(false)}
            >
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <View style={{ width: '88%', maxWidth: 360, backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#222', fontFamily: 'Inter' }}>Add Note</Text>
                  <NoteInput
                    style={{ width: '100%', minHeight: 100, marginBottom: 18, fontFamily: 'Inter' }}
                    placeholder="Write your note here..."
                    value={noteText}
                    onChangeText={setNoteText}
                  />
                  <PrimaryButton
                    style={{ width: '100%', height: 48, borderRadius: 12, backgroundColor: '#0366D6', justifyContent: 'center', alignItems: 'center' }}
                    textStyle={{ color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter' }}
                    onPress={handleSubmitNote}
                  >
                    Submit
                  </PrimaryButton>
                  <OutlinedButton
                    style={{ width: '100%', height: 44, borderRadius: 12, marginTop: 10, backgroundColor: '#F2F2F2', justifyContent: 'center', alignItems: 'center' }}
                    textStyle={{ color: '#222', fontSize: 16, fontWeight: 'bold', fontFamily: 'Inter' }}
                    onPress={() => setAddNoteModalVisible(false)}
                  >
                    Cancel
                  </OutlinedButton>
                </View>
              </View>
            </Modal>
          </View>
        )}
        {/* Vitals Tab Content */}
        {selectedTab === 'Vitals' && (
          <View style={styles.overviewSection}>
            {/* Section Header */}
            <Text style={styles.fieldLabel}>Historical Vitals</Text>
            {/* Select Date Button */}
            <TouchableOpacity
              style={styles.selectDateBtn}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.selectDateBtnText} numberOfLines={1}>
                {selectedDate ? formatDateDMY(selectedDate) : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {/* Date Picker Modal */}
            {showDatePicker && (
              <Modal
                transparent
                animationType="fade"
                visible={showDatePicker}
                onRequestClose={() => setShowDatePicker(false)}
              >
                <View style={styles.datePickerModalBg}>
                  <View style={styles.datePickerModalContent}>
                    <DateTimePicker
                      value={selectedDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        if (date) setSelectedDate(date);
                        setShowDatePicker(false);
                      }}
                    />
                  </View>
                </View>
              </Modal>
            )}
            {/* Historical Vitals Card */}
            <View style={styles.historicalVitalsCard}>
              {/* Row 1 */}
              <View style={styles.vitalsRow}>
                <View style={styles.vitalColLeft}>
                  <Text style={styles.vitalLabel}>Date</Text>
                  <Text style={styles.vitalValue}>07/20/2024</Text>
                </View>
                <View style={styles.vitalColRight}>
                  <Text style={styles.vitalLabel}>Respiratory Rate</Text>
                  <Text style={styles.vitalValue}>16 breaths/min</Text>
                </View>
              </View>
              {/* Row 2 */}
              <View style={styles.vitalsRow}>
                <View style={styles.vitalColLeft}>
                  <Text style={styles.vitalLabel}>Heart Rate</Text>
                  <Text style={styles.vitalValue}>72 bpm</Text>
                </View>
                <View style={styles.vitalColRight}>
                  <Text style={styles.vitalLabel}>Blood Pressure</Text>
                  <Text style={styles.vitalValue}>120/80 mmHg</Text>
                </View>
              </View>
              {/* Row 3 */}
              <View style={styles.vitalsRowLast}>
                <View style={styles.vitalColLeft}>
                  <Text style={styles.vitalLabel}>Temperature</Text>
                  <Text style={styles.vitalValue}>98.6 °F</Text>
                </View>
                <View style={styles.vitalColRight}>
                  <Text style={styles.vitalLabel}>SpO2</Text>
                  <Text style={styles.vitalValue}>98 %</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {/* Medications Tab Content */}
        {selectedTab === 'Medications' && (
          <View style={styles.overviewSection}>
            <Text style={styles.fieldLabel}>Medications Details Here</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#fff',
  },
  patientInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#eee',
    marginRight: 20,
  },
  patientInfoTextCol: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'Inter',
  },
  patientSubtext: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter',
    marginTop: 4,
    lineHeight: 22,
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
    marginTop: 0,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'Inter',
  },
  toggleSubtext: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Inter',
    marginTop: 2,
  },
  toggleSwitch: {
    width: 48,
    height: 28,
  },
  vitalsScroll: {
    marginVertical: 10,
    marginBottom: 0,
    marginTop: 0,
  },
  tabsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 20,
    marginBottom: 0,
    justifyContent: 'space-between',
    marginTop: 5,
  },
  tabBtn: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  tabTextActive: {
    color: '#111',
    fontWeight: 'bold',
  },
  tabUnderline: {
    marginTop: 3,
    height: 3,
    backgroundColor: '#111',
    borderRadius: 2,
    width: '100%',
  },
  overviewSection: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 0,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionField: {
    marginBottom: 18,
  },
  lastSectionField: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  fieldValue: {
    fontSize: 16,
    color: '#222',
    fontFamily: 'Inter',
    marginBottom: 0,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 0,
    marginBottom: 0,
    gap: 16,
  },
  addNoteBtn: {
    width: 120,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0366D6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  addNoteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  manageMedBtn: {
    width: 180,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  manageMedBtnText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  orderTestsBtn: {
    marginTop: 24,
    marginBottom: -10,
    borderRadius: 14,
    width: 370,
    height: 54,
    backgroundColor: '#0366D6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  orderTestsBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  vitalsSectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 16,
    marginBottom: 0,
    paddingHorizontal: 16,
  },
  selectDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    minWidth: 130,
    maxWidth: 220,
    backgroundColor: '#0366d6',
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 0,
    marginLeft: 0,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  selectDateBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    flexShrink: 1,
  },
  datePickerModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  historicalVitalsCard: {
    backgroundColor: '#fff',
    width: '100%',
    marginTop: 24,
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 0,
    paddingHorizontal: 0,
  },
  vitalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  vitalsRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  vitalCol: {
    flex: 1,
    marginRight: 16,
  },
  vitalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  vitalValue: {
    fontSize: 15,
    color: '#222',
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  vitalColLeft: {
    flex: 1,
    marginRight: 32,
  },
  vitalColRight: {
    flex: 1,
    marginLeft: 32,
  },
});

export default InPatientDetails; 