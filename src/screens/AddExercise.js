import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, FlatList } from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import DatePickerField from '../components/DatePickerField';
import MultiSelectButtonGroup from '../components/MultiSelectButtonGroup';
import OutlinedButton from '../components/OutlinedButton';
import PrimaryButton from '../components/PrimaryButton';
import RoundedTextInput from '../components/RoundedTextInput';
import FormLabel from '../components/FormLabel';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MusicCard from '../components/MusicCard';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CollapsibleConfigSection from '../components/CollapsibleConfigSection';
import ConfigSectionStyles from '../components/ConfigSectionStyles';

const EXERCISE_LIST = [
  { id: 1, title: 'Morning Walk', image: null },
  { id: 2, title: 'Yoga', image: null },
  { id: 3, title: 'Stretching', image: null },
  { id: 4, title: 'Light Cardio', image: null },
  { id: 5, title: 'Breathing Exercises', image: null },
  { id: 6, title: 'Balance Training', image: null },
];

const MED_TIMES = ['Morning', 'Noon', 'Evening', 'Night'];

const REPEAT_OPTIONS = ['Daily', 'Weekly'];
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateDMY(date) {
  if (!date) return '';
  if (typeof date === 'string') return date;
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

const CARD_LIST_HEIGHT = 320;
const AddExercise = () => {
  const [tab, setTab] = useState('assign');
  const [search, setSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [medTimes, setMedTimes] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [assignedExercises, setAssignedExercises] = useState([]);
  const router = useRouter();
  const params = useLocalSearchParams();
  const [configExpanded, setConfigExpanded] = useState(false);
  const configAnim = useRef(new Animated.Value(0)).current;
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [repeatType, setRepeatType] = useState('Daily');
  const [numDays, setNumDays] = useState(1);
  const [numWeeks, setNumWeeks] = useState(1);
  const [selectedWeekDays, setSelectedWeekDays] = useState([]);
  const [showRepeatDropdown, setShowRepeatDropdown] = useState(false);

  const expandConfig = () => {
    if (!configExpanded) {
      Animated.timing(configAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
      setConfigExpanded(true);
    }
  };

  const toggleConfig = () => {
    Animated.timing(configAnim, {
      toValue: configExpanded ? 0 : 1,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    setConfigExpanded(!configExpanded);
  };

  const configSectionHeight = repeatType === 'Weekly' ? 585 : 500;

  return (
    <View style={{ flex: 1 }}>
      <Header title="Add Exercise" onBack={() => router.back()} />
      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={tab === 'assign' ? styles.tabSelected : styles.tabUnselected} onPress={() => setTab('assign')}>
          <Text style={tab === 'assign' ? styles.tabSelectedText : styles.tabUnselectedText}>Assign Exercise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tab === 'assigned' ? styles.tabSelected : styles.tabUnselected} onPress={() => setTab('assigned')}>
          <Text style={tab === 'assigned' ? styles.tabSelectedText : styles.tabUnselectedText}>View Exercise</Text>
        </TouchableOpacity>
      </View>
      {tab === 'assign' ? (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ paddingHorizontal: 20, marginTop: 8, flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                <SearchBar value={search} onChangeText={setSearch} style={{ flex: 1 }} />
                <TouchableOpacity style={styles.filterIconBtn}>
                  <Ionicons name="filter" size={24} color="#0366d6" />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, marginTop: 16, paddingBottom: 48 }}>
                <FlatList
                  data={EXERCISE_LIST.filter(e => e.title.toLowerCase().includes(search.toLowerCase()))}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <MusicCard
                      title={item.title}
                      image={item.image}
                      buttonText={selectedExercise && selectedExercise.id === item.id ? 'Selected' : 'Select'}
                      onButtonPress={() => {
                        if (selectedExercise && selectedExercise.id === item.id) {
                          setSelectedExercise(null);
                          Animated.timing(configAnim, {
                            toValue: 0,
                            duration: 250,
                            easing: Easing.ease,
                            useNativeDriver: false,
                          }).start();
                          setConfigExpanded(false);
                        } else {
                          setSelectedExercise(item);
                          expandConfig();
                        }
                      }}
                      buttonStyle={selectedExercise && selectedExercise.id === item.id ? { borderColor: '#0366d6', backgroundColor: '#e6f0fa' } : {}}
                      disabled={false}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </View>
          {/* Bottom collapsible config section */}
          {configExpanded ? (
            <CollapsibleConfigSection
              type="Exercise"
              configExpanded={configExpanded}
              toggleConfig={toggleConfig}
              configAnim={configAnim}
              configSectionHeight={configSectionHeight}
              selectedItem={selectedExercise}
              startDate={startDate}
              onStartDatePress={() => setShowStartPicker(true)}
              repeatType={repeatType}
              onRepeatTypePress={opt => setRepeatType(opt)}
              showRepeatDropdown={showRepeatDropdown}
              setShowRepeatDropdown={setShowRepeatDropdown}
              REPEAT_OPTIONS={REPEAT_OPTIONS}
              numDays={numDays}
              setNumDays={setNumDays}
              numWeeks={numWeeks}
              setNumWeeks={setNumWeeks}
              weekDays={selectedWeekDays}
              setWeekDays={setSelectedWeekDays}
              WEEK_DAYS={WEEK_DAYS}
              medTimes={medTimes}
              setMedTimes={setMedTimes}
              MED_TIMES={MED_TIMES}
              instructions={instructions}
              setInstructions={setInstructions}
              onSave={() => {
                if (!selectedExercise) return;
                if (repeatType === 'Weekly' && selectedWeekDays.length === 0) return;
                setAssignedExercises(prev => [
                  ...prev,
                  {
                    id: Date.now(),
                    title: selectedExercise.title || '',
                    image: selectedExercise.image || null,
                    startDate,
                    repeatType,
                    numDays: repeatType === 'Daily' ? numDays : undefined,
                    numWeeks: repeatType === 'Weekly' ? numWeeks : undefined,
                    weekDays: repeatType === 'Weekly' ? [...selectedWeekDays] : [],
                    medTimes: [...medTimes],
                    instructions,
                  },
                ]);
                setSelectedExercise(null);
                setStartDate('');
                setNumDays(1);
                setNumWeeks(1);
                setRepeatType('Daily');
                setSelectedWeekDays([]);
                setMedTimes([]);
                setInstructions('');
                setTab('assigned');
              }}
              saveDisabled={repeatType === 'Weekly' && selectedWeekDays.length === 0}
              styles={ConfigSectionStyles}
            />
          ) : (
            <TouchableOpacity
              style={styles.configToggleCollapsed}
              onPress={toggleConfig}
              activeOpacity={0.7}
            >
              <Text style={styles.configToggleTextCollapsed}>▶ Configure Selected Exercise</Text>
            </TouchableOpacity>
          )}
          {/* Render DateTimePickers at root level */}
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
          {showEndPicker && (
            <DateTimePicker
              value={endDate ? new Date(endDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </View>
      ) : (
        <View style={{ flex: 1, position: 'relative' }}>
          <ScrollView
            contentContainerStyle={[styles.contentContainer, { paddingBottom: 120 }]}
            showsVerticalScrollIndicator={false}
          >
            <SearchBar value={search} onChangeText={setSearch} />
            <View style={{ marginTop: 16 }}>
              {assignedExercises.filter(e => e.title.toLowerCase().includes(search.toLowerCase())).map((exercise, idx) => (
                <MusicCard
                  key={exercise.id}
                  title={exercise.title}
                  image={exercise.image}
                  buttonText="Remove"
                  onButtonPress={() => setAssignedExercises(assignedExercises.filter(e => e.id !== exercise.id))}
                  buttonStyle={{ backgroundColor: '#f2f2f2', borderColor: '#f2f2f2', color: '#222' }}
                  startDate={exercise.startDate}
                  endDate={exercise.endDate}
                  medTimes={exercise.medTimes}
                  instructions={exercise.instructions}
                  repeatType={exercise.repeatType}
                  numDays={exercise.numDays}
                  numWeeks={exercise.numWeeks}
                  weekDays={exercise.weekDays}
                />
              ))}
            </View>
          </ScrollView>
          <View style={styles.fixedBottomRow}>
            <OutlinedButton style={styles.addAnotherBtn} onPress={() => {
              setTab('assign');
              setConfigExpanded(false);
              configAnim.setValue(0);
            }}>
              Add Another
            </OutlinedButton>
            <PrimaryButton
              style={styles.doneBtn}
              onPress={() =>
                router.push({
                  pathname: '/PatientList',
                  params: {
                    patientName: params.patientName,
                    appointmentTime: params.appointmentTime,
                    appointmentDate: params.appointmentDate,
                  },
                })
              }
            >
              Done
            </PrimaryButton>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tabSelectedText: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabUnselected: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tabUnselectedText: {
    color: '#888',
    fontWeight: 'normal',
    fontSize: 16,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 64,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 6,
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    color: '#222',
    height: 100,
    marginTop: 6,
    textAlignVertical: 'top',
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
  addAnotherBtn: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flex: 1,
    marginRight: 8,
    borderWidth: 0,
  },
  doneBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    flex: 1,
    marginLeft: 8,
  },
  fixedSaveRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    zIndex: 10,
  },
  configToggle: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  configToggleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0366d6',
  },
  configSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  bottomConfigContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    zIndex: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
  },
  dateInput: {
    fontSize: 16,
    color: '#222',
    marginLeft: 8,
  },
  configToggleCollapsed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  configToggleTextCollapsed: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0366d6',
    letterSpacing: 0.2,
  },
  filterIconBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f2f6fa',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  dateInputRowNew: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#f9fafd',
  },
  dateInputNew: {
    fontSize: 16,
    color: '#222',
    marginLeft: 10,
  },
  rowBetweenInline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 6,
  },
  daysStepperContainer: {
    flex: 1,
    marginRight: 8,
  },
  labelSmall: {
    fontSize: 13,
    color: '#222',
    marginBottom: 4,
    fontWeight: '500',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f6fa',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 90,
    justifyContent: 'center',
  },
  stepperBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#e6f0fa',
    marginHorizontal: 4,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0366d6',
    marginHorizontal: 8,
  },
  frequencyDropdownContainer: {
    flex: 1,
    marginLeft: 8,
  },
  frequencyDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9fafd',
    minWidth: 110,
    justifyContent: 'space-between',
  },
  frequencyDropdownText: {
    fontSize: 15,
    color: '#222',
  },
  dropdownModal: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 100,
  },
  dropdownOption: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  dropdownOptionText: {
    fontSize: 15,
    color: '#0366d6',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 2,
  },
  weekDayBtn: {
    borderWidth: 1,
    borderColor: '#0366d6',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    backgroundColor: '#fff',
  },
  weekDayBtnSelected: {
    backgroundColor: '#0366d6',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 2,
  },
  weekDayText: {
    color: '#0366d6',
    fontWeight: '500',
  },
  weekDayTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  pillButtonRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 2,
    justifyContent: 'space-between',
  },
  pillBtn: {
    borderWidth: 1,
    borderColor: '#0366d6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 2,
    backgroundColor: '#fff',
  },
  pillBtnSelected: {
    backgroundColor: '#0366d6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 2,
  },
  pillBtnText: {
    color: '#0366d6',
    fontWeight: '500',
    fontSize: 15,
  },
  pillBtnTextSelected: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
  },
  instructionsInputNew: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#222',
    height: 100,
    marginTop: 6,
    textAlignVertical: 'top',
    backgroundColor: '#f9fafd',
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: '#0366d6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0366d6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.2,
  },
});

export default AddExercise; 