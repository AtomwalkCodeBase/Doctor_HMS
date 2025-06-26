import React, { useState } from 'react';
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

const PatientDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isPressed, setIsPressed] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [prescriptionName, setPrescriptionName] = useState('');
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

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
    if (result.type === 'success') {
      setSelectedFile({ type: 'pdf', uri: result.uri, name: result.name });
    }
  };

  return (
    <View style={styles.container}>
      <CustomStatusBar />
      <Header title="Patient Details" onBack={() => router.back()} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Patient Info */}
        <View style={styles.patientInfo}>
          <Image
            source={require('../../assets/images/UserIcon.png')}
            style={styles.avatar}
          />
          <Text style={styles.patientName}>{params.patientName || 'Unknown'}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <Text style={styles.infoText}>ID: {params.customer_id || 'N/A'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text style={styles.infoText}>{params.appointmentDate || 'No date'}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text style={styles.infoText}>{params.appointmentTime || 'No time'}</Text>
          </View>
        </View>

        {/* Vitals Summary */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.vitalsContainer}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
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

        {/* Upload File Button Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8, marginRight: 16 }}>
          {selectedFile && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, maxWidth: 160 }}>
              {selectedFile.type === 'pdf' && (
                <MaterialCommunityIcons name="file-pdf-box" size={22} color="#d32f2f" style={{ marginRight: 4 }} />
              )}
              <Text
                style={{
                  fontSize: 13,
                  color: selectedFile.type === 'pdf' ? '#d32f2f' : '#222',
                  maxWidth: 120,
                }}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {selectedFile.name}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.uploadFileBtn}
            onPress={() => setShowFileModal(true)}
          >
            <Text style={styles.uploadFileBtnText}>Upload File</Text>
          </TouchableOpacity>
        </View>

        {/* Prescription Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescription Name</Text>
          <TextInput
            style={styles.prescriptionInput}
            placeholder="Enter prescription name..."
            placeholderTextColor="#9CA3AF"
            value={prescriptionName}
            onChangeText={setPrescriptionName}
          />
        </View>

        {/* Remarks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remarks</Text>
          <TextInput
            style={styles.symptomsInput}
            multiline
            placeholder="Enter remarks..."
            placeholderTextColor="#9CA3AF"
            value={remarks}
            onChangeText={setRemarks}
          />
        </View>

        {/* Action Buttons Grid */}
        <View style={styles.actionGrid}>
          <View style={styles.actionRow}>
            <ActionButton
              icon="add-circle-outline"
              label="Add Tasks"
              onPress={() => router.push({
                pathname: '/AddTask',
                params: {
                  patientName: params.patientName,
                  appointmentTime: params.appointmentTime,
                  appointmentDate: params.appointmentDate,
                },
              })}
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
              onPress={() => router.push('/OrderTest')}
            />
            <ActionButton
              icon="document-text-outline"
              label="Test Results"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isPressed && styles.submitButtonPressed,
            (!prescriptionName || !selectedFile) && { opacity: 0.5 }
          ]} 
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={async () => {
            if (!prescriptionName || !selectedFile) return;
            try {
              // 1. Send processBookingData (without remarks)
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
              // console.log('Sending processBookingData:', booking_data);
              const bookingRes = await processBookingData(booking_data);
              // console.log('processBookingData response:', bookingRes);

              // 2. Send uploadDocumentData
              if (selectedFile && prescriptionName) {
                const document_data = {
                  call_mode: 'ADD_DOCUMENT',
                  document_id: 1,
                  customer_id: params.customer_id,
                  doc_file: selectedFile,
                  document_name: prescriptionName,
                  remarks: remarks,
                };
                // console.log('Sending uploadDocumentData:', document_data);
                const uploadRes = await uploadDocumentData(document_data);
                // console.log('uploadDocumentData response:', uploadRes);
              } else {
                console.log('Skipping uploadDocumentData: selectedFile or prescriptionName missing');
              }

              setSuccessModalVisible(true);
            } catch (err) {
              console.log('Error in Submit handler:', err);
              Alert.alert('Error', 'Failed to complete booking or upload document.');
            }
          }}
          activeOpacity={1}
          disabled={!prescriptionName || !selectedFile}
        >
          <Text style={[
            styles.submitButtonText,
            isPressed && styles.submitButtonTextPressed
          ]}>
            Submit
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
              <Text style={styles.fileModalOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fileModalOption} onPress={handleChooseImage}>
              <Text style={styles.fileModalOptionText}>Choose Image from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fileModalOption} onPress={handlePickPDF}>
              <Text style={styles.fileModalOptionText}>Select PDF Document</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <SuccessModal
        visible={successModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
          router.push('/home');
        }}
        message="Booking and document uploaded!"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  patientInfo: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 16,
  },
  vitalsContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    paddingBottom: 8,
    marginTop: 0,
  },
  section: {
    padding: 16,
    marginTop: -8,
    marginBottom: -16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  prescriptionInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    height: 60,
    fontSize: 16,
  },
  symptomsInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  actionGrid: {
    padding: 16,
    marginTop: 0,
    paddingBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  submitButton: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonPressed: {
    backgroundColor: '#0366d6',
    borderColor: '#0366d6',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  submitButtonTextPressed: {
    color: '#fff',
  },
  uploadFileBtn: {
    backgroundColor: '#0366d6',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    marginTop: 8,
    marginBottom: 0,
  },
  uploadFileBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    width: 300,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  fileModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    textAlign: 'center',
  },
  fileModalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fileModalOptionText: {
    fontSize: 16,
    color: '#0366d6',
    textAlign: 'center',
  },
});

export default PatientDetails; 