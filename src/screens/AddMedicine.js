import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Image, Keyboard, TouchableWithoutFeedback, findNodeHandle, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import ViewMusicCard from '../components/ViewMusicCard';
import ViewTabFooter from '../components/ViewTabFooter';
import ConfigSectionStyles from '../components/ConfigSectionStyles';
import FormLabel from '../components/FormLabel';
import RoundedTextInput from '../components/RoundedTextInput';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MED_TIMES = ['Morning', 'Noon', 'Evening', 'Night'];
const FOOD_OPTIONS = ['After Food', 'Before Food'];
const REPEAT_OPTIONS = ['Daily', 'Weekly', 'Monthly'];
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  const [repeatType, setRepeatType] = useState('Daily');
  const [numDays, setNumDays] = useState(1);
  const [numWeeks, setNumWeeks] = useState(1);
  const [selectedWeekDays, setSelectedWeekDays] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [showRepeatDropdown, setShowRepeatDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const repeatAnchorRef = useRef(null);

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
    setRepeatType('Daily');
    setNumDays(1);
    setNumWeeks(1);
    setSelectedWeekDays([]);
    setInstructions('');
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
      repeatType,
      numDays,
      numWeeks,
      weekDays: [...selectedWeekDays],
      instructions,
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
          {/* Config Section Fields (flat, not collapsible) */}
          {/* Start Date */}
          <FormLabel style={{ marginTop: 12 }}>Start Date</FormLabel>
          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={ConfigSectionStyles.dateInputRowNew}>
            <Ionicons name="calendar-outline" size={20} color="#0366d6" />
            <Text style={ConfigSectionStyles.dateInputNew}>{startDate ? formatDateDMY(startDate) : 'Start Date'}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate ? new Date(startDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}
          {/* Repeat and No. of Days/Weeks Row */}
          <View style={ConfigSectionStyles.rowBetweenInline}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={ConfigSectionStyles.labelSmall}>Repeat</Text>
              <View ref={repeatAnchorRef} collapsible={false}>
                <TouchableOpacity
                  style={ConfigSectionStyles.frequencyDropdown}
                  onPress={() => {
                    if (repeatAnchorRef.current && repeatAnchorRef.current.measureInWindow) {
                      repeatAnchorRef.current.measureInWindow((x, y, width, height) => {
                        setDropdownPosition({ top: y + height, left: x, width });
                        setShowRepeatDropdown(true);
                      });
                    } else {
                      // fallback for debugging
                      setDropdownPosition({ top: 200, left: 20, width: 150 });
                      setShowRepeatDropdown(true);
                    }
                  }}
                >
                  <Text style={ConfigSectionStyles.frequencyDropdownText}>{repeatType}</Text>
                  <Ionicons name="chevron-down" size={18} color="#0366d6" />
                </TouchableOpacity>
              </View>
            </View>
            {repeatType === 'Daily' && (
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={ConfigSectionStyles.labelSmall}>No. of Days</Text>
                <View style={ConfigSectionStyles.stepperRow}>
                  <TouchableOpacity
                    style={[ConfigSectionStyles.stepperBtn, { marginRight: 12 }]}
                    onPress={() => setNumDays(Math.max(1, numDays - 1))}
                  >
                    <MaterialCommunityIcons name="minus" size={20} color="#0366d6" />
                  </TouchableOpacity>
                  <TextInput
                    style={ConfigSectionStyles.stepperInput}
                    value={numDays.toString()}
                    onChangeText={text => {
                      const numericText = text.replace(/[^0-9]/g, '');
                      const value = parseInt(numericText) || 1;
                      setNumDays(Math.max(1, Math.min(30, value)));
                    }}
                    keyboardType="numeric"
                    textAlign="center"
                    maxLength={2}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    contextMenuHidden={true}
                  />
                  <TouchableOpacity
                    style={[ConfigSectionStyles.stepperBtn, { marginLeft: 12 }]}
                    onPress={() => setNumDays(Math.min(30, numDays + 1))}
                  >
                    <MaterialCommunityIcons name="plus" size={20} color="#0366d6" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {repeatType === 'Weekly' && (
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={ConfigSectionStyles.labelSmall}>Repeat For (weeks)</Text>
                <View style={ConfigSectionStyles.stepperRow}>
                  <TouchableOpacity
                    style={[ConfigSectionStyles.stepperBtn, { marginRight: 12 }]}
                    onPress={() => setNumWeeks(Math.max(1, numWeeks - 1))}
                  >
                    <MaterialCommunityIcons name="minus" size={20} color="#0366d6" />
                  </TouchableOpacity>
                  <TextInput
                    style={ConfigSectionStyles.stepperInput}
                    value={numWeeks.toString()}
                    onChangeText={text => {
                      const numericText = text.replace(/[^0-9]/g, '');
                      const value = parseInt(numericText) || 1;
                      setNumWeeks(Math.max(1, Math.min(12, value)));
                    }}
                    keyboardType="numeric"
                    textAlign="center"
                    maxLength={2}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    contextMenuHidden={true}
                  />
                  <TouchableOpacity
                    style={[ConfigSectionStyles.stepperBtn, { marginLeft: 12 }]}
                    onPress={() => setNumWeeks(Math.min(12, numWeeks + 1))}
                  >
                    <MaterialCommunityIcons name="plus" size={20} color="#0366d6" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          {/* Weekly Fields */}
          {repeatType === 'Weekly' && (
            <>
              <Text style={[ConfigSectionStyles.labelSmall, { marginTop: 14 }]}>Select Days of the Week</Text>
              <View style={ConfigSectionStyles.weekDaysRow}>
                {WEEK_DAYS.map(day => {
                  const selected = selectedWeekDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={selected ? ConfigSectionStyles.weekDayBtnSelected : ConfigSectionStyles.weekDayBtn}
                      onPress={() => {
                        setSelectedWeekDays(selected
                          ? selectedWeekDays.filter(d => d !== day)
                          : [...selectedWeekDays, day]);
                      }}
                    >
                      <Text style={selected ? ConfigSectionStyles.weekDayTextSelected : ConfigSectionStyles.weekDayText}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
          {/* Medication Time (pill buttons) */}
          <FormLabel style={{ marginTop: 16 }}>Medication Time</FormLabel>
          <View style={ConfigSectionStyles.pillButtonRow}>
            {MED_TIMES.map(time => {
              const selected = medTimes.includes(time);
              return (
                <TouchableOpacity
                  key={time}
                  style={selected ? ConfigSectionStyles.pillBtnSelected : ConfigSectionStyles.pillBtn}
                  onPress={() => setMedTimes(selected ? medTimes.filter(t => t !== time) : [...medTimes, time])}
                >
                  <Text style={selected ? ConfigSectionStyles.pillBtnTextSelected : ConfigSectionStyles.pillBtnText}>{time}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* Instructions */}
          <FormLabel style={{ marginTop: 16 }}>Instructions</FormLabel>
          <RoundedTextInput
            style={ConfigSectionStyles.instructionsInputNew}
            placeholder="Type here"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={4}
          />
          {/* End Date (removed) */}
          {/* To be Taken (removed) */}
          {/* Add Another Medicine Button */}
          <TouchableOpacity style={[styles.addAnotherBtn, { marginTop: 18 }]} onPress={handleAddAnother}> 
            <Text style={styles.addAnotherText}>Add Another Medicine</Text>
          </TouchableOpacity>
          {/* Create Button */}
          <TouchableOpacity style={[styles.createBtn, { marginTop: 14 }]} onPress={handleCreate}> 
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
            onAddAnother={() => {
              resetForm();
              setActiveTab('Add Medicine');
            }}
            onDone={() => router.push('/PatientList')}
            addAnotherText="Add Another"
            doneText="Done"
            style={{ marginBottom: 18 }}
          />
        </View>
      )}
      {showRepeatDropdown && (
        <TouchableOpacity
          style={styles.dropdownOverlay}
          onPress={() => setShowRepeatDropdown(false)}
        >
          <View style={[styles.dropdownModal, dropdownPosition]}>
            {REPEAT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={styles.dropdownOption}
                onPress={() => {
                  setRepeatType(opt);
                  setShowRepeatDropdown(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
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
  addAnotherBtn: {
    borderWidth: 1,
    borderColor: '#0366d6',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 24,
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
    marginTop: 24,
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
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 20,
  },
  dropdownModal: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 120,
  },
  dropdownOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  dropdownOptionText: {
    fontSize: 15,
    color: '#0366d6',
  },
});

export default AddMedicine; 