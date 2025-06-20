import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InPatientScreen from "../../src/screens/InPatientScreen";


const InPatients = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <InPatientScreen />
    </SafeAreaView>
  );
};

export default InPatients; 