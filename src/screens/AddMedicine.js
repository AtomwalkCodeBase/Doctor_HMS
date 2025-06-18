import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import ViewMusicCard from '../components/ViewMusicCard';
import ViewTabFooter from '../components/ViewTabFooter';

const MED_TIMES = ['Morning', 'Noon', 'Evening', 'Night'];
const FOOD_OPTIONS = ['After Food', 'Before Food'];

function formatDateDMY(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

const AddMedicine = () => {
  const router = useRouter();
  const [medName, setMedName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [medTimes, setMedTimes] = useState([]);
  const [food, setFood] = useState([]);
  const [note, setNote] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [activeTab, setActiveTab] = useState('Add Medicine');
  const [isNoteFocused, setIsNoteFocused] = useState(false);

  const toggleMedTime = (time) => {
    setMedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };
  const toggleFood = (option) => {
    setFood((prev) =>
      prev.includes(option) ? prev.filter((f) => f !== option) : [...prev, option]
    );
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) setStartDate(selectedDate);
  };
  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) setEndDate(selectedDate);
  };

  const isFormFilled = () => {
    return medName.trim() !== '' && medTimes.length > 0;
  };

  const resetForm = () => {
    setMedName('');
    setStartDate('');
    setEndDate('');
    setMedTimes([]);
    setFood([]);
    setNote('');
    setImageUri(null);
  };

  const addMedicineToList = () => {
    const newMedicine = {
      id: Date.now(),
      name: medName,
      startDate,
      endDate,
      medTimes,
      food,
      note,
      imageUri,
    };
    setMedicines(prev => [...prev, newMedicine]);
  };

  const handleAddAnother = () => {
    if (isFormFilled()) {
      addMedicineToList();
      resetForm();
      // Stay on Add Medicine tab
    }
    // else do nothing
  };

  const handleCreate = () => {
    if (isFormFilled()) {
      addMedicineToList();
      resetForm();
      setActiveTab('View');
    }
    // else do nothing
  };

  const handleRemoveMedicine = (id) => {
    setMedicines(medicines.filter(medicine => medicine.id !== id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Medicine</Text>
      </View>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={activeTab === 'Add Medicine' ? styles.tabSelected : styles.tabUnselected}
          onPress={() => setActiveTab('Add Medicine')}
        >
          <Text style={activeTab === 'Add Medicine' ? styles.tabSelectedText : styles.tabUnselectedText}>Add Medicine</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={activeTab === 'View' ? styles.tabSelected : styles.tabUnselected}
          onPress={() => setActiveTab('View')}
        >
          <Text style={activeTab === 'View' ? styles.tabSelectedText : styles.tabUnselectedText}>View</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'Add Medicine' ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingTop: 0, paddingBottom: 48, flexGrow: 1, justifyContent: 'flex-start' }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Medication Name */}
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Medication Name</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Aspirin 100 mg"
            value={medName}
            onChangeText={setMedName}
            placeholderTextColor="#888"
          />
          {/* Dates */}
          <View style={[styles.rowBetween, styles.sectionSpacing]}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[styles.label, styles.sectionSpacing]}>Start Date</Text>
              <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                <View style={styles.dateInputRow}>
                  <Ionicons name="calendar-outline" size={18} color="#0366d6" />
                  <Text style={styles.dateInput}>{startDate ? formatDateDMY(startDate) : '5/8/2025'}</Text>
                </View>
              </TouchableOpacity>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate ? new Date(startDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                />
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[styles.label, styles.sectionSpacing]}>End Date</Text>
              <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                <View style={styles.dateInputRow}>
                  <Ionicons name="calendar-outline" size={18} color="#0366d6" />
                  <Text style={styles.dateInput}>{endDate ? formatDateDMY(endDate) : '8/8/2025'}</Text>
                </View>
              </TouchableOpacity>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate ? new Date(endDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                />
              )}
            </View>
          </View>
          {/* Medication Time */}
          <Text style={[styles.label, styles.sectionSpacing]}>Medication Time</Text>
          <View style={styles.btnRow}>
            {MED_TIMES.map((time) => (
              <TouchableOpacity
                key={time}
                style={medTimes.includes(time) ? styles.timeBtnSelected : styles.timeBtn}
                onPress={() => toggleMedTime(time)}
              >
                <Text style={medTimes.includes(time) ? styles.timeBtnTextSelected : styles.timeBtnText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* To be Taken */}
          <Text style={[styles.label, styles.sectionSpacing]}>To be Taken</Text>
          <View style={styles.btnRow}>
            {FOOD_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={food.includes(option) ? styles.timeBtnSelected : styles.timeBtn}
                onPress={() => toggleFood(option)}
              >
                <Text style={food.includes(option) ? styles.timeBtnTextSelected : styles.timeBtnText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Important Note */}
          <Text style={[styles.label, styles.sectionSpacing]}>Important Note</Text>
          <TextInput
            style={[styles.noteInput, { height: 180 }]}
            placeholder="Type Here"
            value={note}
            onChangeText={setNote}
            placeholderTextColor="#888"
            multiline
          />
          {/* Add Another Medicine Button */}
          <TouchableOpacity style={[styles.addAnotherBtn, { marginTop: 12 }]} onPress={handleAddAnother}> 
            <Text style={styles.addAnotherText}>Add Another Medicine</Text>
          </TouchableOpacity>
          {/* Create Button */}
          <TouchableOpacity style={[styles.createBtn, { marginTop: 12 }]} onPress={handleCreate}> 
            <Text style={styles.createBtnText}>Create</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={{ flex: 1, position: 'relative' }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingTop: 20, paddingBottom: 120, flexGrow: 1, justifyContent: 'flex-start' }}
            showsVerticalScrollIndicator={false}
          >
            {medicines.map((medicine) => (
              <ViewMusicCard key={medicine.id} music={medicine} onRemove={handleRemoveMedicine} type="medicine" />
            ))}
          </ScrollView>
          <ViewTabFooter
            onAddAnother={() => setActiveTab('Add Medicine')}
            onDone={() => router.push('/PatientList')}
            addAnotherText="Add Another"
            doneText="Done"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0366d6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
  },
  backBtn: {
    marginRight: 14,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 21,
    marginRight: 26,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabSelected: {
    flex: 1,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#111',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  tabSelectedText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 17,
  },
  tabUnselected: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  tabUnselectedText: {
    color: '#888',
    fontWeight: 'normal',
    fontSize: 17,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 4,
  },
  label: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 17,
    color: '#222',
    height: 48,
    marginBottom: 4,
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  dateInput: {
    marginLeft: 7,
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
  btnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 0,
  },
  timeBtn: {
    borderWidth: 1,
    borderColor: '#0366d6',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  timeBtnSelected: {
    backgroundColor: '#0366d6',
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  timeBtnText: {
    color: '#0366d6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeBtnTextSelected: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    height: 140,
    fontSize: 17,
    color: '#222',
    marginTop: 6,
    textAlignVertical: 'top',
  },
  addAnotherBtn: {
    borderWidth: 1,
    borderColor: '#0366d6',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 12,
  },
  addAnotherText: {
    color: '#0366d6',
    fontWeight: 'bold',
    fontSize: 17,
  },
  createBtn: {
    backgroundColor: '#0366d6',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  createBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  fixedBottomRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    zIndex: 10,
  },
  sectionSpacing: {
    marginTop: 8,
  },
});

export default AddMedicine; 