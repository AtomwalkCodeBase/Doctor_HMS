import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
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
  configExpanded,
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
}) => (
  <View style={styles.bottomConfigContainer}>
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
      <View style={styles.configSection}>
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
            <TouchableOpacity style={styles.frequencyDropdown} onPress={() => setShowRepeatDropdown(true)}>
              <Text style={styles.frequencyDropdownText}>{repeatType}</Text>
              <Ionicons name="chevron-down" size={18} color="#0366d6" />
            </TouchableOpacity>
            {showRepeatDropdown && (
              <View style={styles.dropdownModal}>
                {REPEAT_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setShowRepeatDropdown(false);
                      onRepeatTypePress(opt);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {repeatType === 'Daily' && (
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.labelSmall}>No. of Days</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={[styles.stepperBtn, numDays <= 1 && { opacity: 0.5 }]}
                  onPress={() => setNumDays(Math.max(1, numDays - 1))}
                  disabled={numDays <= 1}
                >
                  <MaterialCommunityIcons name="minus" size={20} color="#0366d6" />
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{numDays}</Text>
                <TouchableOpacity
                  style={[styles.stepperBtn, numDays >= 30 && { opacity: 0.5 }]}
                  onPress={() => setNumDays(Math.min(30, numDays + 1))}
                  disabled={numDays >= 30}
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
                  style={[styles.stepperBtn, numWeeks <= 1 && { opacity: 0.5 }]}
                  onPress={() => setNumWeeks(Math.max(1, numWeeks - 1))}
                  disabled={numWeeks <= 1}
                >
                  <MaterialCommunityIcons name="minus" size={20} color="#0366d6" />
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{numWeeks}</Text>
                <TouchableOpacity
                  style={[styles.stepperBtn, numWeeks >= 12 && { opacity: 0.5 }]}
                  onPress={() => setNumWeeks(Math.min(12, numWeeks + 1))}
                  disabled={numWeeks >= 12}
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
        />
        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, { opacity: saveDisabled ? 0.5 : 1 }]}
          disabled={saveDisabled}
          onPress={onSave}
        >
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  </View>
);

export default CollapsibleConfigSection; 