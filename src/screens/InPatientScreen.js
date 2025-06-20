import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../components/SearchBar";
import ProgressBar from "../components/ProgressBar";
import Header from "../components/Header";
import AppointmentCard from "../components/AppointmentCard";
import CustomStatusBar from "../components/StatusBar";
import DropdownPicker from "../components/DropdownPicker";
import { useRouter } from "expo-router";

const STATUS_COLORS = {
  "Needs Attention": "#ffe066",
  critical: "#ff6b6b",
  Stable: "#8DD8FF",
  "Round Completed": "#4ade80",
};

const patientsData = [
  {
    id: 23454,
    status: ["Needs Attention"],
    name: "Roshni Singh, 45 yrs. F",
    bed: "Bed 201, Ward B",
    ward: "ward_b",
    avatar: require("../../assets/images/UserIcon.png"),
    completed: false,
  },
  {
    id: 23455,
    status: ["critical"],
    name: "Roshan Singh, 29 yrs. M",
    bed: "Bed 202, Ward B",
    ward: "ward_b",
    avatar: require("../../assets/images/UserIcon.png"),
    completed: false,
  },
  {
    id: 23456,
    status: ["Stable", "Round Completed"],
    name: "Yuvraj Singh, 29 yrs. M",
    bed: "Bed 203, Ward B",
    ward: "ward_b",
    avatar: require("../../assets/images/UserIcon.png"),
    completed: false,
  },
  {
    id: 23457,
    status: ["Stable"],
    name: "Priya Sharma, 32 yrs. F",
    bed: "Bed 101, Ward A",
    ward: "ward_a",
    avatar: require("../../assets/images/UserIcon.png"),
    completed: false,
  },
  {
    id: 23458,
    status: ["Needs Attention"],
    name: "Amit Patel, 28 yrs. M",
    bed: "Bed 102, Ward A",
    ward: "ward_a",
    avatar: require("../../assets/images/UserIcon.png"),
    completed: false,
  },
  {
    id: 23459,
    status: ["critical"],
    name: "Sneha Reddy, 35 yrs. F",
    bed: "Bed 301, Ward C",
    ward: "ward_c",
    avatar: require("../../assets/images/UserIcon.png"),
    completed: false,
  },
];

const StatusBadge = ({ label }) => (
  <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[label] || "#eee" }]}> 
    <Text style={[styles.statusBadgeText, { color: label === "critical" ? "#fff" : "#222" }]}>{label}</Text>
  </View>
);

const InPatientScreen = () => {
  const router = useRouter();
  const [tab, setTab] = useState("Patients");
  const [search, setSearch] = useState("");
  const [ward, setWard] = useState("all");
  const wardOptions = [
    { label: "Select", value: "all" },
    { label: "Ward A", value: "ward_a" },
    { label: "Ward B", value: "ward_b" },
    { label: "Ward C", value: "ward_c" },
    { label: "Ward D", value: "ward_d" },
  ];

  // Filter patients based on search and ward
  const filteredPatients = patientsData.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(search.toLowerCase());
    const matchesWard = ward === "all" || patient.ward === ward;
    return matchesSearch && matchesWard;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <CustomStatusBar />
      <Header title="In-Patient Dashboard" onBack={() => router.back()} />

      {/* Search + Filter Row */}
      <View style={styles.searchRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search patients"
            style={styles.searchBar}
            inputStyle={{ fontSize: 15 }}
          />
        </View>
        <View style={{ width: 140 }}>
          <DropdownPicker
            data={wardOptions}
            value={ward}
            setValue={setWard}
            showLabel={false}
          />
        </View>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, tab === 'Patients' && styles.tabActive]}
          onPress={() => setTab('Patients')}
        >
          <Text style={[styles.tabText, tab === 'Patients' && styles.tabTextActive]}>Patients</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'Surgery' && styles.tabActive]}
          onPress={() => setTab('Surgery')}
        >
          <Text style={[styles.tabText, tab === 'Surgery' && styles.tabTextActive]}>Surgery</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Section */}
      <View style={{ paddingHorizontal: 16 }}>
        <ProgressBar completed={2} total={10} />
      </View>

      {/* Patient Cards List */}
      <ScrollView contentContainerStyle={{ padding: 0, paddingBottom: 32 }}>
        {filteredPatients.map((patient) => (
          <View key={patient.id} style={styles.patientCardWrapper}>
            <AppointmentCard
              id={patient.id}
              name={patient.name}
              date={patient.bed}
              time={null}
              avatar={patient.avatar}
              completed={patient.completed}
              onPress={() => router.push('/InPatientDetails')}
              status={patient.status}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 44,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#111',
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
  tabTextActive: {
    color: '#111',
    fontWeight: 'bold',
  },
  progressSection: {
    paddingHorizontal: 16,
    marginTop: 0,
    marginBottom: 12,
  },
  patientCardWrapper: {
    marginBottom: 2,
    backgroundColor: 'transparent',
  },
  cardWithBadges: {
    backgroundColor: 'transparent',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 2,
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default InPatientScreen; 