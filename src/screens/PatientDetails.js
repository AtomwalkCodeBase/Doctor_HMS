import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomStatusBar from '../components/StatusBar';
import VitalCard from '../components/VitalCard';
import ActionButton from '../components/ActionButton';
import Header from '../components/Header';
import { processBookingData, uploadDocumentData } from '../services/productServices';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import SuccessModal from '../components/SuccessModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PatientDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isPressed, setIsPressed] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [prescriptionName, setPrescriptionName] = useState('');
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate a unique key for storing this booking's data
  const getBookingStorageKey = () => {
    return `booking_${params.customer_id}_${params.booking_date}_${params.start_time}`;
  };

  // Check if booking is completed and load stored data
  useEffect(() => {
    const checkBookingStatus = async () => {
      try {
        // First check if completion status is passed from route params
        if (params.isCompleted === 'true' || params.isCompleted === true) {
          setIsCompleted(true);
        }
        
        const storageKey = getBookingStorageKey();
        const storedData = await AsyncStorage.getItem(storageKey);
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setIsCompleted(true);
          setPrescriptionName(parsedData.prescriptionName || '');
          setRemarks(parsedData.remarks || '');
          setSelectedFile(parsedData.selectedFile || null);
        }
      } catch (error) {
        console.error('Error checking booking status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBookingStatus();
  }, [params.customer_id, params.booking_date, params.start_time, params.isCompleted]);

  // Store booking data locally
  const storeBookingData = async (data) => {
    try {
      const storageKey = getBookingStorageKey();
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error storing booking data:', error);
    }
  };

  // Permissions for camera
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take a photo.');
      return false;
    }
    return true;
  };

  // Permissions for media library
  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media library permission is required to select an image.');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    setShowFileModal(false);
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedFile({ type: 'image', uri: result.assets[0].uri, name: result.assets[0].fileName || 'photo.jpg' });
    }
  };

  const handleChooseImage = async () => {
    setShowFileModal(false);
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedFile({ type: 'image', uri: result.assets[0].uri, name: result.assets[0].fileName || 'image.jpg' });
    }
  };

  const handlePickPDF = async () => {
    setShowFileModal(false);
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setSelectedFile({
        type: 'pdf',
        uri: file.uri,
        name: file.name || (file.uri ? file.uri.split('/').pop() : 'Document.pdf'),
      });
    }
  };

  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <Header title="Patient Details" onBack={() => router.back()} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Patient Info */}
          <View style={styles.patientInfoSection}>
            <Image
              source={params.avatarUrl ? { uri: params.avatarUrl } : require('../../assets/images/UserIcon.png')}
              style={styles.avatar}
            />
            <View style={styles.patientInfoTextCol}>
              <Text style={styles.patientName}>{params.patientName || 'Unknown'}</Text>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={18} color="#6B7280" style={styles.infoIcon} />
                <Text style={styles.infoText}>ID: {params.customer_id || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={18} color="#6B7280" style={styles.infoIcon} />
                <Text style={styles.infoText}>Date: {params.appointmentDate || 'No date'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={18} color="#6B7280" style={styles.infoIcon} />
                <Text style={styles.infoText}>Time: {params.appointmentTime || 'No time'}</Text>
              </View>
              {isCompleted && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.completedText}>Completed</Text>
                </View>
              )}
            </View>
          </View>

          {/* Vitals Summary - Exactly like previous version */}
          <View style={styles.vitalsOuterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.vitalsScrollView}
              contentContainerStyle={styles.vitalsContentContainer}
            >
              <VitalCard
                icon="heart"
                label="Heart Rate"
                value="72 bpm"
                iconColor="#EF4444"
                backgroundColor="#fff"
              />
              <VitalCard
                icon="thermometer"
                label="Temperature"
                value="98.6°F"
                iconColor="#F59E0B"
                backgroundColor="#fff"
              />
              <VitalCard
                icon="water"
                label="BP"
                value="120/80"
                iconColor="#3B82F6"
                backgroundColor="#fff"
              />
              <VitalCard
                icon="pulse"
                label="SpO2"
                value="98%"
                iconColor="#10B981"
                backgroundColor="#fff"
              />
            </ScrollView>
          </View>

          {/* Document Upload Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Upload Document</Text>
            <View style={styles.uploadSection}>
              {selectedFile ? (
                <View style={styles.selectedFileContainer}>
                  {selectedFile.type === 'pdf' ? (
                    <MaterialCommunityIcons name="file-pdf-box" size={24} color="#d32f2f" />
                  ) : (
                    <MaterialCommunityIcons name="image" size={24} color="#4CAF50" />
                  )}
                  <Text style={styles.selectedFileName} numberOfLines={1} ellipsizeMode="middle">
                    {selectedFile.name}
                  </Text>
                  {!isCompleted && (
                    <TouchableOpacity onPress={() => setSelectedFile(null)}>
                      <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.uploadPlaceholder, isCompleted && styles.disabledPlaceholder]}
                  onPress={() => !isCompleted && setShowFileModal(true)}
                  disabled={isCompleted}
                >
                  <Ionicons name="cloud-upload-outline" size={32} color={isCompleted ? "#9CA3AF" : "#0366d6"} />
                  <Text style={[styles.uploadPlaceholderText, isCompleted && styles.disabledText]}>
                    {isCompleted ? 'Document uploaded' : 'Tap to upload document'}
                  </Text>
                </TouchableOpacity>
              )}
              {!isCompleted && (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => setShowFileModal(true)}
                >
                  <Text style={styles.uploadButtonText}>
                    {selectedFile ? 'Change File' : 'Select File'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Prescription Name */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Prescription Name</Text>
            <TextInput
              style={[styles.input, isCompleted && styles.disabledInput]}
              placeholder="Enter prescription name..."
              placeholderTextColor="#9CA3AF"
              value={prescriptionName}
              onChangeText={setPrescriptionName}
              editable={!isCompleted}
            />
          </View>

          {/* Remarks */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Remarks</Text>
            <TextInput
              style={[styles.input, styles.remarksInput, isCompleted && styles.disabledInput]}
              multiline
              placeholder="Enter remarks..."
              placeholderTextColor="#9CA3AF"
              value={remarks}
              onChangeText={setRemarks}
              editable={!isCompleted}
            />
          </View>

          {/* Action Buttons Grid */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <View style={styles.actionRow}>
                <ActionButton
                  icon="add-circle-outline"
                  label="Add Tasks"
                  disabled={isCompleted}
                  onPress={() => {
                    if (!isCompleted) {
                      router.push({
                        pathname: '/AddTask',
                        params: {
                          patientName: params.patientName,
                          appointmentTime: params.appointmentTime,
                          appointmentDate: params.appointmentDate,
                        },
                      });
                    }
                  }}
                />
                <ActionButton
                  icon="list-outline"
                  label="View Tasks"
                  onPress={() => {}}
                />
              </View>
              <View style={styles.actionRow}>
                <ActionButton
                  icon="flask-outline"
                  label="Order Tests"
                  disabled={isCompleted}
                  onPress={() => {
                    if (!isCompleted) {
                      router.push('/OrderTest');
                    }
                  }}
                />
                <ActionButton
                  icon="document-text-outline"
                  label="Test Results"
                  onPress={() => {}}
                />
              </View>
            </View>
            {isCompleted && (
              <Text style={styles.disabledNote}>
                Note: Add Tasks and Order Tests are disabled for completed bookings to maintain data integrity.
              </Text>
            )}
          </View>

          {/* Submit Button with proper spacing */}
          {!isCompleted && (
            <View style={styles.submitButtonContainer}>
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  isPressed && styles.submitButtonPressed,
                  (!prescriptionName || !selectedFile) && styles.submitButtonDisabled
                ]} 
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                onPress={async () => {
                  if (!prescriptionName || !selectedFile) return;
                  try {
                    const booking_data = {
                      customer_id: params.customer_id,
                      equipment_id: params.equipment_id,
                      booking_date: params.booking_date,
                      start_time: params.start_time,
                      end_time: params.end_time,
                      duration: params.duration,
                      call_mode: 'COMPLETE',
                      status: 'COMPLETE',
                      booking_id: params.booking_id,
                    };
                    const bookingRes = await processBookingData(booking_data);
                    if (selectedFile && prescriptionName) {
                      const document_data = {
                        call_mode: 'ADD_DOCUMENT',
                        document_id: 1,
                        customer_id: params.customer_id,
                        doc_file: selectedFile,
                        document_name: prescriptionName,
                        remarks: remarks,
                      };
                      const uploadRes = await uploadDocumentData(document_data);
                    }
                    
                    // Store the submitted data locally
                    await storeBookingData({
                      prescriptionName,
                      remarks,
                      selectedFile,
                      submittedAt: new Date().toISOString()
                    });
                    
                    setSuccessModalVisible(true);
                  } catch (err) {
                    Alert.alert('Error', 'Failed to complete booking or upload document.');
                  }
                }}
                activeOpacity={0.8}
                disabled={!prescriptionName || !selectedFile}
              >
                <Text style={styles.submitButtonText}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* File Upload Action Sheet/Modal */}
      <Modal
        visible={showFileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFileModal(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowFileModal(false)}>
          <View style={styles.fileModalContainer}>
            <Text style={styles.fileModalTitle}>Select File Type</Text>
            <TouchableOpacity style={styles.fileModalOption} onPress={handleTakePhoto}>
              <Ionicons name="camera-outline" size={20} color="#0366d6" style={styles.fileModalOptionIcon} />
              <Text style={styles.fileModalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fileModalOption} onPress={handleChooseImage}>
              <Ionicons name="image-outline" size={20} color="#0366d6" style={styles.fileModalOptionIcon} />
              <Text style={styles.fileModalOptionText}>Choose Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fileModalOption} onPress={handlePickPDF}>
              <MaterialCommunityIcons name="file-pdf-box" size={20} color="#d32f2f" style={styles.fileModalOptionIcon} />
              <Text style={styles.fileModalOptionText}>Select PDF</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <SuccessModal
        visible={successModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
          router.push({ pathname: '/home', params: { refresh: Date.now() } });
        }}
        message="Booking and document uploaded!"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0366d6',
  },
  patientInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 12,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  patientInfoTextCol: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F3E8',
    borderRadius: 8,
    padding: 4,
    marginTop: 8,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  // Vitals section - exactly like previous version
  vitalsOuterContainer: {
    marginTop: 6,
    marginBottom: 6,
  },
  vitalsScrollView: {
    flexDirection: 'row',
    paddingTop: 2,
    paddingBottom: 1,
  },
  vitalsContentContainer: {
    paddingLeft: 12,
    paddingRight: 6,
  },
  // Rest of the styles
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0366d6',
    marginBottom: 8,
  },
  uploadSection: {
    marginTop: 6,
  },
  uploadPlaceholder: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadPlaceholderText: {
    color: '#6B7280',
    marginTop: 6,
    fontSize: 14,
  },
  disabledPlaceholder: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  selectedFileName: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    color: '#374151',
    fontSize: 14,
  },
  uploadButton: {
    backgroundColor: '#0366d6',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    color: '#9CA3AF',
  },
  remarksInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  actionGrid: {
    marginTop: 6,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBuffer: 8,
  },
  submitButtonContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: '#0366d6',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0366d6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonPressed: {
    backgroundColor: '#0258b8',
    transform: [{ scale: 0.98 }],
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowColor: '#9CA3AF',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  fileModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    width: '100%',
    maxWidth: 400,
    padding: 16,
  },
  fileModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  fileModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  fileModalOptionIcon: {
    marginRight: 10,
  },
  fileModalOptionText: {
    fontSize: 16,
    color: '#111827',
  },
  disabledNote: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PatientDetails;