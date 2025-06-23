import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TextInput,
  Modal
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FormLabel from './FormLabel';
import RoundedTextInput from './RoundedTextInput';

// MED_TIMES and WEEK_DAYS can be passed as props for reusability

function formatDateDMY(date) {
  if (!date) return '';
  if (typeof date === 'string') return date;
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

const CollapsibleConfigSection = ({
  type = 'Exercise',
  toggleConfig,
  configAnim,
  configSectionHeight,
  selectedItem,
  startDate,
  onStartDatePress,
  repeatType,
  onRepeatTypePress,
  showRepeatDropdown,
  setShowRepeatDropdown,
  onSetDropdownPosition,
  REPEAT_OPTIONS,
  numDays,
  setNumDays,
  numWeeks,
  setNumWeeks,
  weekDays,
  setWeekDays,
  WEEK_DAYS,
  medTimes,
  setMedTimes,
  MED_TIMES,
  instructions,
  setInstructions,
  onSave,
  saveDisabled,
  styles,
}) => {
  const scrollViewRef = useRef(null);
  const [numDaysInput, setNumDaysInput] = useState(numDays.toString());
  const [numWeeksInput, setNumWeeksInput] = useState(numWeeks.toString());
  const dropdownTriggerRef = useRef(null);

  // Update input values when props change
  React.useEffect(() => {
    setNumDaysInput(numDays.toString());
  }, [numDays]);

  React.useEffect(() => {
    setNumWeeksInput(numWeeks.toString());
  }, [numWeeks]);

  const handleNumDaysChange = (text) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    const value = parseInt(numericText) || 1;
    const clampedValue = Math.max(1, Math.min(30, value));
    setNumDaysInput(numericText);
    setNumDays(clampedValue);
  };

  const handleNumWeeksChange = (text) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    const value = parseInt(numericText) || 1;
    const clampedValue = Math.max(1, Math.min(12, value));
    setNumWeeksInput(numericText);
    setNumWeeks(clampedValue);
  };

  const handleNumDaysBlur = () => {
    const value = parseInt(numDaysInput) || 1;
    const clampedValue = Math.max(1, Math.min(30, value));
    setNumDaysInput(clampedValue.toString());
    setNumDays(clampedValue);
  };

  const handleNumWeeksBlur = () => {
    const value = parseInt(numWeeksInput) || 1;
    const clampedValue = Math.max(1, Math.min(12, value));
    setNumWeeksInput(clampedValue.toString());
    setNumWeeks(clampedValue);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.bottomConfigContainer}
    >
      <TouchableOpacity style={styles.configToggle} onPress={toggleConfig} activeOpacity={0.7}>
        <Text style={styles.configToggleText}>
          ▼ Configure Selected {type}
        </Text>
      </TouchableOpacity>
      <Animated.View style={{
        overflow: 'hidden',
        height: configAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, configSectionHeight],
        }),
        opacity: configAnim,
      }}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.configSection}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          bounces={true}
        >
          {/* Selected Exercise Indicator */}
          {selectedItem && (
            <View style={styles.selectedItemIndicator}>
              <Ionicons name="checkmark-circle" size={20} color="#0366d6" />
              <Text style={styles.selectedItemText}>Selected: {selectedItem.title}</Text>
            </View>
          )}
          
          {/* Start Date */}
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity onPress={onStartDatePress} style={styles.dateInputRowNew}>
            <Ionicons name="calendar-outline" size={20} color="#0366d6" />
            <Text style={styles.dateInputNew}>{startDate ? formatDateDMY(startDate) : 'Start Date'}</Text>
          </TouchableOpacity>
          
          {/* Repeat and No. of Days/Weeks Row */}
          <View style={styles.rowBetweenInline}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.labelSmall}>Repeat</Text>
              <TouchableOpacity
                ref={dropdownTriggerRef}
                style={styles.frequencyDropdown}
                onPress={() => {
                  if (dropdownTriggerRef.current && onSetDropdownPosition) {
                    dropdownTriggerRef.current.measureInWindow((x, y, width, height) => {
                      onSetDropdownPosition({ top: y + height, left: x, width });
                      setShowRepeatDropdown(true);
                    });
                  } else {
                    setShowRepeatDropdown(true);
                  }
                }}
              >
                <Text style={styles.frequencyDropdownText}>{repeatType}</Text>
                <Ionicons name="chevron-down" size={18} color="#0366d6" />
              </TouchableOpacity>
            </View>
            
            {repeatType === 'Daily' && (
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.labelSmall}>No. of Days</Text>
                <View style={styles.stepperRow}>
                  <TouchableOpacity
                    style={[styles.stepperBtn, { marginRight: 12 }]}
                    onPress={() => {
                      const newValue = Math.max(1, numDays - 1);
                      setNumDays(newValue);
                      setNumDaysInput(newValue.toString());
                    }}
                  >
                    <MaterialCommunityIcons name="minus" size={20} color="#0366d6" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.stepperInput}
                    value={numDaysInput}
                    onChangeText={handleNumDaysChange}
                    onBlur={handleNumDaysBlur}
                    keyboardType="numeric"
                    textAlign="center"
                    maxLength={2}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    contextMenuHidden={true}
                  />
                  <TouchableOpacity
                    style={[styles.stepperBtn, { marginLeft: 12 }]}
                    onPress={() => {
                      const newValue = Math.min(30, numDays + 1);
                      setNumDays(newValue);
                      setNumDaysInput(newValue.toString());
                    }}
                  >
                    <MaterialCommunityIcons name="plus" size={20} color="#0366d6" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            {repeatType === 'Weekly' && (
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.labelSmall}>Repeat For (weeks)</Text>
                <View style={styles.stepperRow}>
                  <TouchableOpacity
                    style={[styles.stepperBtn, { marginRight: 12 }]}
                    onPress={() => {
                      const newValue = Math.max(1, numWeeks - 1);
                      setNumWeeks(newValue);
                      setNumWeeksInput(newValue.toString());
                    }}
                  >
                    <MaterialCommunityIcons name="minus" size={20} color="#0366d6" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.stepperInput}
                    value={numWeeksInput}
                    onChangeText={handleNumWeeksChange}
                    onBlur={handleNumWeeksBlur}
                    keyboardType="numeric"
                    textAlign="center"
                    maxLength={2}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    contextMenuHidden={true}
                  />
                  <TouchableOpacity
                    style={[styles.stepperBtn, { marginLeft: 12 }]}
                    onPress={() => {
                      const newValue = Math.min(12, numWeeks + 1);
                      setNumWeeks(newValue);
                      setNumWeeksInput(newValue.toString());
                    }}
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
              <Text style={[styles.labelSmall, { marginTop: 14 }]}>Select Days of the Week</Text>
              <View style={styles.weekDaysRow}>
                {WEEK_DAYS.map(day => {
                  const selected = weekDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      style={selected ? styles.weekDayBtnSelected : styles.weekDayBtn}
                      onPress={() => {
                        setWeekDays(selected
                          ? weekDays.filter(d => d !== day)
                          : [...weekDays, day]);
                      }}
                    >
                      <Text style={selected ? styles.weekDayTextSelected : styles.weekDayText}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
          
          {/* Time Selection (if provided) */}
          {MED_TIMES && setMedTimes && (
            <FormLabel style={{ marginTop: 16 }}>{type} Time</FormLabel>
          )}
          {MED_TIMES && setMedTimes && (
            <View style={styles.pillButtonRow}>
              {MED_TIMES.map(time => {
                const selected = medTimes.includes(time);
                return (
                  <TouchableOpacity
                    key={time}
                    style={selected ? styles.pillBtnSelected : styles.pillBtn}
                    onPress={() => setMedTimes(selected ? medTimes.filter(t => t !== time) : [...medTimes, time])}
                  >
                    <Text style={selected ? styles.pillBtnTextSelected : styles.pillBtnText}>{time}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          
          {/* Instructions */}
          <FormLabel style={{ marginTop: 16 }}>Instructions</FormLabel>
          <RoundedTextInput
            style={styles.instructionsInputNew}
            placeholder="Type here"
            value={instructions}
            onChangeText={setInstructions}
            multiline
            numberOfLines={4}
            onFocus={() => {
              // Scroll to top when instructions is focused
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
              }, 300);
            }}
          />
          
          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, { opacity: saveDisabled ? 0.5 : 1 }]}
            disabled={saveDisabled}
            onPress={onSave}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default CollapsibleConfigSection; 