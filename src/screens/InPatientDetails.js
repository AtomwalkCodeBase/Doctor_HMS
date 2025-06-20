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
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import CustomStatusBar from '../components/StatusBar';
import Header from '../components/Header';
import VitalCard from '../components/VitalCard';
import PrimaryButton from '../components/PrimaryButton';
import OutlinedButton from '../components/OutlinedButton';

// Inline PatientInfoCard for reuse
const PatientInfoCard = ({
  avatar,
  name,
  condition,
  location,
  roundsDone,
  onToggleRounds,
  lastUpdated,
}) => (
  <View style={styles.patientInfoRow}>
    <Image source={avatar} style={styles.avatar} />
    <View style={{ flex: 1, marginLeft: 16 }}>
      <Text style={styles.patientName}>{name}</Text>
      <Text style={styles.patientCondition}>{condition}</Text>
      <Text style={styles.patientLocation}>{location}</Text>
      <View style={styles.roundsRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.roundsLabel}>Mark Rounds as Done</Text>
          <Text style={styles.lastUpdated}>Last Updated: {lastUpdated}</Text>
        </View>
        <Switch
          value={roundsDone}
          onValueChange={onToggleRounds}
          trackColor={{ false: '#E5E7EB', true: '#0366d6' }}
          thumbColor={roundsDone ? '#fff' : '#fff'}
        />
      </View>
    </View>
  </View>
);

const vitalsData = [
  {
    icon: 'heart',
    label: 'Heart Rate',
    value: '72 bpm',
    iconColor: '#EF4444',
  },
  {
    icon: 'thermometer',
    label: 'Temperature',
    value: '98.6°F',
    iconColor: '#F59E0B',
  },
  {
    icon: 'water',
    label: 'Blood Pressure',
    value: '120/80',
    iconColor: '#3B82F6',
  },
];

const overviewData = {
  diagnosis: 'Pneumonia',
  chiefComplaint: 'Shortness of breath, cough',
  admissionDate: '2024-07-26',
  physician: 'Dr. Roshit Singh',
  notes:
    'Patient showing improvement in breathing.\nContinue current treatment plan.',
};

const TABS = ['Overview', 'Vitals', 'Medications'];

const InPatientDetails = () => {
  // For now, use hardcoded data. Later, fetch from API and set state.
  const [roundsDone, setRoundsDone] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Overview');

  // Header right icon handler (call)
  const handleCall = () => {
    // Placeholder: integrate with Linking API later
    // Linking.openURL('tel:1234567890');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <CustomStatusBar />
      {/* Custom Header with right call icon */}
      <View style={{ position: 'relative', zIndex: 2 }}>
        <Header
          title="Patient Details"
          onBack={() => {}}
        />
        <TouchableOpacity style={styles.callIcon} onPress={handleCall}>
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Info Section */}
        <PatientInfoCard
          avatar={require('../../assets/images/UserIcon.png')}
          name="Yuvraj Singh"
          condition="Critical Condition"
          location="Room 302, Ward B"
          roundsDone={roundsDone}
          onToggleRounds={setRoundsDone}
          lastUpdated="11:45 AM"
        />

        {/* Vitals Section */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.vitalsScroll}
          contentContainerStyle={{ paddingVertical: 12 }}
        >
          {vitalsData.map((v, idx) => (
            <View key={v.label} style={{ width: 110, marginRight: idx === vitalsData.length - 1 ? 0 : 12 }}>
              <VitalCard {...v} />
            </View>
          ))}
        </ScrollView>

        {/* Sub Tabs */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabBtn}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
              {selectedTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Content (only show for Overview tab) */}
        {selectedTab === 'Overview' && (
          <View style={styles.overviewContent}>
            <View style={styles.sectionField}>
              <Text style={styles.fieldTitle}>Diagnosis</Text>
              <Text style={styles.fieldValue}>{overviewData.diagnosis}</Text>
            </View>
            <View style={styles.sectionField}>
              <Text style={styles.fieldTitle}>Chief Complaint</Text>
              <Text style={styles.fieldValue}>{overviewData.chiefComplaint}</Text>
            </View>
            <View style={styles.sectionField}>
              <Text style={styles.fieldTitle}>Admission Date</Text>
              <Text style={styles.fieldValue}>{overviewData.admissionDate}</Text>
            </View>
            <View style={styles.sectionField}>
              <Text style={styles.fieldTitle}>Attending Physician</Text>
              <Text style={styles.fieldValue}>{overviewData.physician}</Text>
            </View>
            <View style={styles.sectionField}>
              <Text style={styles.fieldTitle}>Notes</Text>
              <Text style={styles.fieldValue}>{overviewData.notes}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <PrimaryButton
                style={styles.addNoteBtn}
                textStyle={{ fontSize: 15, fontWeight: 'bold' }}
                onPress={() => {}}
              >
                Add Note
              </PrimaryButton>
              <OutlinedButton
                style={styles.manageMedBtn}
                textStyle={{ fontSize: 15, fontWeight: 'bold', color: '#222' }}
                onPress={() => {}}
              >
                Manage Medications
              </OutlinedButton>
            </View>
            <PrimaryButton
              style={styles.orderTestsBtn}
              textStyle={{ fontSize: 16, fontWeight: 'bold' }}
              onPress={() => {}}
            >
              Order Tests
            </PrimaryButton>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  callIcon: {
    position: 'absolute',
    right: 20,
    top: 15,
    backgroundColor: 'transparent',
    zIndex: 10,
    padding: 4,
  },
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eee',
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  patientCondition: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 0,
  },
  patientLocation: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  roundsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  roundsLabel: {
    fontWeight: '600',
    fontSize: 15,
    color: '#222',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  vitalsScroll: {
    marginBottom: 0,
    marginTop: -4,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 12,
    marginBottom: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#111',
    fontWeight: 'bold',
  },
  tabUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
    height: 3,
    backgroundColor: '#111',
    borderRadius: 2,
  },
  overviewContent: {
    marginTop: 18,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  sectionField: {
    marginBottom: 16,
  },
  fieldTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#111',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    color: '#222',
    marginBottom: 0,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  addNoteBtn: {
    flex: 1,
    marginRight: 8,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: '#0366d6',
    minWidth: 120,
  },
  manageMedBtn: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: '#F1F1F1',
    borderWidth: 0,
    minWidth: 120,
  },
  orderTestsBtn: {
    marginTop: 16,
    borderRadius: 12,
    width: '100%',
    backgroundColor: '#0366d6',
    paddingVertical: 14,
  },
});

export default InPatientDetails; 