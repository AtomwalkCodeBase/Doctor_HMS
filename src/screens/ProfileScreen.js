import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Switch, SafeAreaView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { AppContext } from '../../context/AppContext';
import { getProfileInfo } from '../services/authServices';
import { useNavigation, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmationModal from '../components/ConfirmationModal';
import Loader from '../components/Loader';
import Header from '../components/Header';

const ProfileScreen = () => {
  const { logout } = useContext(AppContext);
  const [profile, setProfile] = useState({});
  const [userPin, setUserPin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricModalVisible, setIsBiometricModalVisible] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pendingBiometricValue, setPendingBiometricValue] = useState(null);

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await getProfileInfo();
        setProfile(res?.data[0]);
        await AsyncStorage.setItem('profilename', res?.data[0].name);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchUserData = async () => {
      try {
        const storedPin = await AsyncStorage.getItem('userPin');
        setUserPin(storedPin);
        const biometric = await AsyncStorage.getItem('userBiometric');
        setBiometricEnabled(biometric === 'true');
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    fetchUserData();
    fetchProfile();
  }, []);

  const handleBackPress = () => navigation.goBack();
  const handlePressPassword = () => router.push({ pathname: 'ResetPassword' });

  const handleBiometricToggle = (value) => {
    setPendingBiometricValue(value);
    setIsBiometricModalVisible(true);
  };
  const confirmBiometricToggle = async () => {
    try {
      setBiometricEnabled(pendingBiometricValue);
      if (pendingBiometricValue) {
        await AsyncStorage.setItem('userBiometric', 'true');
      } else {
        await AsyncStorage.removeItem('userBiometric');
      }
    } catch (error) {
      console.error('Error updating biometric setting:', error);
      setBiometricEnabled(!pendingBiometricValue);
    } finally {
      setIsBiometricModalVisible(false);
      setPendingBiometricValue(null);
    }
  };
  const cancelBiometricToggle = () => {
    setIsBiometricModalVisible(false);
    setPendingBiometricValue(null);
  };

  const handleImageError = () => {
    return require('../../assets/images/default-profile.jpg');
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <Header title="Profile" onBack={handleBackPress} />
      {isLoading ? (
        <Loader visible={isLoading} />
      ) : (
        <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={{ ...styles.container, flexGrow: 1, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <Image
                source={profile?.image ? { uri: profile.image } : require('../../assets/images/default-profile.jpg')}
                style={styles.avatar}
                onError={handleImageError}
                defaultSource={require('../../assets/images/default-profile.jpg')}
              />
              <Text style={styles.name}>{profile?.name || 'Dr. Nitin Menon'}</Text>
              <Text style={styles.designation}>{profile?.grade_name || 'Cardiologist'}</Text>
              <Text style={styles.hospital}>{profile?.department_name || 'City General Hospital'}</Text>
            </View>

            {/* Settings Section */}
            <Text style={styles.settingsTitle}>Settings</Text>
            <View style={styles.settingsList}>
              <SettingsItem
                icon={<MaterialIcons name="notifications" size={22} color="#4A6FA5" />}
                label="Notifications"
                onPress={() => {}}
              />
              <SettingsItem
                icon={<MaterialIcons name="lock" size={22} color="#4A6FA5" />}
                label="Change Password"
                onPress={handlePressPassword}
              />
              <SettingsItem
                icon={<MaterialIcons name="logout" size={22} color="#e74c3c" />}
                label="Logout"
                onPress={async () => {
                  await AsyncStorage.removeItem('authToken');
                  logout();
                }}
                labelStyle={{ color: '#e74c3c' }}
              />
            </View>

            {/* Biometric Authentication */}
            <View style={styles.optionItem}>
              <View style={styles.optionIconContainer}>
                <MaterialIcons name="fingerprint" size={22} color="#4A6FA5" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionText}>Biometric Authentication</Text>
                <Text style={styles.optionDescription}>Use fingerprint to log in</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={handleBiometricToggle}
                trackColor={{ false: "#eee", true: "#4A6FA5" }}
                thumbColor={biometricEnabled ? "#fff" : "#FFFFFF"}
              />
            </View>
            <ConfirmationModal
              visible={isBiometricModalVisible}
              message={`Are you sure you want to ${pendingBiometricValue ? 'enable' : 'disable'} biometric authentication?`}
              onConfirm={confirmBiometricToggle}
              onCancel={cancelBiometricToggle}
              confirmText={pendingBiometricValue ? 'Enable' : 'Disable'}
              cancelText="Cancel"
            />
          </ScrollView>
          <View style={styles.footerButtonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={handlePressPassword}
            >
              <MaterialIcons name="lock" size={20} color="#fff" />
              <Text style={styles.buttonText}>{userPin ? 'UPDATE SECURITY PIN' : 'SET SECURITY PIN'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const SettingsItem = ({ icon, label, onPress, labelStyle }) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.settingsIcon}>{icon}</View>
    <Text style={[styles.settingsLabel, labelStyle]}>{label}</Text>
    <MaterialIcons name="chevron-right" size={22} color="#b0b0b0" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e6e6e6',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  designation: {
    fontSize: 16,
    color: '#4A6FA5',
    fontWeight: '500',
    marginBottom: 2,
  },
  hospital: {
    fontSize: 15,
    color: '#8e99a3',
    fontWeight: '400',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  settingsList: {
    marginBottom: 0,
    paddingHorizontal: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    marginBottom: 10,
  },
  settingsIcon: {
    width: 36,
    alignItems: 'center',
    marginRight: 8,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    marginTop: 0,
  },
  optionIconContainer: {
    width: 36,
    alignItems: 'center',
    marginRight: 8,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  optionDescription: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 2,
  },
  footerButtonContainer: {
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 16,
    backgroundColor: '#0366d6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 15,
  },
});

export default ProfileScreen;