import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import ProgressBar from '../components/ProgressBar';
import AppointmentCard from '../components/AppointmentCard';
import CustomStatusBar from '../components/StatusBar';
import { Ionicons } from '@expo/vector-icons';
import { getbookedlistview } from '../services/productServices';
import { getProfileInfo } from '../services/authServices';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Drawer from '../components/Drawer';
import { useIsFocused } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';

const defaultAvatar = require('../../assets/images/UserIcon.png');

const HomeScreen = () => {
  const router = useRouter();
  const { setCustomerId } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [progressInfo, setProgressInfo] = useState({ completed: 0, total: 0 });

  const isFocused = useIsFocused();

  const fetchAppointments = useCallback(async () => {
    try {
      // First try to get employee name from AsyncStorage
      let employeeName = await AsyncStorage.getItem('profilename');
      
      // If not in AsyncStorage, try to fetch from API
      if (!employeeName) {
        try {
          const profileResponse = await getProfileInfo();
          employeeName = profileResponse?.data?.[0]?.name;
          
          // If we got the name from API, store it
          if (employeeName) {
            await AsyncStorage.setItem('profilename', employeeName);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      
      if (!employeeName) {
        console.error('Could not get employee name');
        setLoading(false);
        return;
      }

      const response = await getbookedlistview(false);
      let bookings = response.data || response || [];
      if (!Array.isArray(bookings) && Array.isArray(response)) {
        bookings = response;
      }

      // console.log('Raw bookings:', bookings);

      // Get today's date in DD-MM-YYYY format
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      const todayString = `${day}-${month}-${year}`;

      const filtered = bookings.filter(item => {
        // Check if it's a valid booking with required data
        if (!item.equipment_data || !item.customer_data || !item.booking_date) {
          return false;
        }
        // Check if equipment name matches employee name and booking date matches today
        return item.equipment_data.name === employeeName && item.booking_date === todayString;
      });

      // console.log('Filtered bookings:', filtered.map(b => ({ booking_id: b.booking_id, status_display: b.status_display, customer_id: b.customer_data?.id })));

      const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

      const getDisplayStatus = (statusDisplay) => {
        if (!statusDisplay) return 'Pending';
        if (statusDisplay.toLowerCase() === 'booked') return 'Pending';
        return capitalizeFirst(statusDisplay);
      };

      const mapped = filtered.map(item => ({
        name: item.customer_data?.name || 'Unknown',
        date: item.booking_date || '',
        startTime: item.start_time || '',
        endTime: item.end_time || '',
        customer_id: item.customer_data?.id || null,
        equipment_id: item.equipment_data?.id || null,
        booking_date: item.booking_date || '',
        start_time: item.start_time || '',
        end_time: item.end_time || '',
        duration: item.duration || '',
        booking_id: item.booking_id || '',
        remarks: item.remarks || '',
        avatar: item.customer_data?.image && item.customer_data.image.trim() !== '' 
          ? { uri: item.customer_data.image } 
          : defaultAvatar,
        completed: item.status_display && item.status_display.toLowerCase() === 'completed',
        status: [getDisplayStatus(item.status_display)],
      }));

      // console.log('Mapped appointments:', mapped.map(a => ({ booking_id: a.booking_id, status: a.status, completed: a.completed })));

      // Convert 24-hour format to 12-hour format
      const convertTo12Hour = (time24) => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes}${ampm}`;
      };

      // Format date from DD-MM-YYYY to DD Month, YYYY
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('-');
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${day} ${months[parseInt(month) - 1]}, ${year}`;
      };

      // Sort appointments by status (Pending first, then Completed, then others), then by start time
      const statusOrder = (statusArr) => {
        const status = statusArr && statusArr[0] ? statusArr[0].toLowerCase() : '';
        if (status === 'pending') return 0;
        if (status === 'completed') return 1;
        return 2;
      };

      // Sort by status first, then by start time
      const sortedAppointments = mapped.sort((a, b) => {
        const statusDiff = statusOrder(a.status) - statusOrder(b.status);
        if (statusDiff !== 0) return statusDiff;
        // If same status, sort by start time
        const convertToMinutes = (time) => {
          const [hours, minutes] = time.split(':').map(Number);
          return hours * 60 + minutes;
        };
        return convertToMinutes(a.startTime) - convertToMinutes(b.startTime);
      });

      // Convert times to 12-hour format and format date after sorting
      const formattedAppointments = sortedAppointments.map(appt => ({
        ...appt,
        startTime: convertTo12Hour(appt.startTime),
        endTime: convertTo12Hour(appt.endTime),
        date: formatDate(appt.date)
      }));

      // console.log('Final formattedAppointments:', formattedAppointments.map(a => ({ booking_id: a.booking_id, status: a.status, completed: a.completed })));

      setAppointments(formattedAppointments);
      // Calculate completed and total appointments for progress bar
      const totalAppointments = formattedAppointments.length;
      const completedAppointments = formattedAppointments.filter(appt => appt.completed).length;
      setProgressInfo({ completed: completedAppointments, total: totalAppointments });
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchAppointments();
    }
  }, [isFocused, fetchAppointments]);

  const handleSeeDetails = (appointment) => {
    setCustomerId(appointment.customer_id);
    router.push({
      pathname: '/PatientList',
      params: {
        patientName: appointment.name,
        appointmentTime: `${appointment.startTime} - ${appointment.endTime}`,
        appointmentDate: appointment.date,
        customer_id: appointment.customer_id,
        equipment_id: appointment.equipment_id,
        booking_date: appointment.booking_date,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        duration: appointment.duration,
        booking_id: appointment.booking_id,
        remarks: appointment.remarks,
        avatarUrl: appointment.avatar && appointment.avatar.uri ? appointment.avatar.uri : null,
        isCompleted: appointment.completed,
      }
    });
  };

  const handleDrawerNavigate = (screen) => {
    setDrawerVisible(false);
    setTimeout(() => {
      if (screen === 'home') router.push('/home');
      else if (screen === 'profile') router.push('/profile');
      else if (screen === 'inpatients') router.push('/inpatients');
    }, 250);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CustomStatusBar />
      <View style={styles.blueHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerVisible(true)}>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Doctor App</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={{ flex: 1 }} />
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#6B7280"
            />
            <TouchableOpacity style={styles.filterButton} onPress={() => {}}>
              <Ionicons name="options" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ProgressBar completed={progressInfo.completed} total={progressInfo.total} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Today's Appointments</Text>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
        ) : appointments.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No appointments for today.</Text>
        ) : (
          appointments.map((appt, idx) => (
            <AppointmentCard
              key={idx}
              name={appt.name}
              id={appt.customer_id}
              date={appt.date}
              time={`${appt.startTime} - ${appt.endTime}`}
              avatar={appt.avatar}
              completed={appt.completed}
              status={appt.status}
              onPress={() => handleSeeDetails(appt)}
            />
          ))
        )}
        <View style={{ height: 80 }} />
      </ScrollView>
      <Drawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onNavigate={handleDrawerNavigate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  blueHeader: {
    backgroundColor: '#0366d6',
    paddingTop: 24,
    paddingBottom: 0,
    height: 160,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 0,
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    marginHorizontal: 16,
  },
  menuButton: {
    position: 'absolute',
    left: 0,
    zIndex: 2,
    padding: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 0.2,
  },
  searchBarWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 48,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    paddingLeft: 12,
    paddingRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    paddingVertical: 0,
  },
  filterButton: {
    backgroundColor: '#000',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  scroll: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
});

export default HomeScreen;