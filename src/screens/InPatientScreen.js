import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../components/SearchBar";
import ProgressBar from "../components/ProgressBar";
import Header from "../components/Header";
import AppointmentCard from "../components/AppointmentCard";
import CustomStatusBar from "../components/StatusBar";
import DropdownPicker from "../components/DropdownPicker";
import { useRouter } from "expo-router";
import DatePickerField from "../components/DatePickerField";
import { AppContext } from "../../context/AppContext";
import { getInPatientList } from "../services/productServices";

const STATUS_COLORS = {
  "Needs Attention": "#ffe066",
  critical: "#ff6b6b",
  Stable: "#8DD8FF",
  "Round Completed": "#4ade80",
};

const surgeryData = [
  {
    id: 1,
    status: "Scheduled",
    name: "Shreyas Iyer",
    surgery: "Knee Surgery",
    time: "10:00 AM - 11:00 AM",
    ot: "OT 2",
    avatar: require("../../assets/images/UserIcon.png"),
    date: new Date(2025, 0, 8),
  },
  {
    id: 2,
    status: "Scheduled",
    name: "Deepika P.",
    surgery: "Knee Surgery",
    time: "12:00 PM - 01:00 PM",
    ot: "OT 2",
    avatar: require("../../assets/images/UserIcon.png"),
    date: new Date(2025, 0, 8),
  },
  {
    id: 3,
    status: "Completed",
    name: "MS Dhoni",
    surgery: "Knee Surgery",
    time: "03:00 PM - 04:00 PM",
    ot: "OT 2",
    avatar: require("../../assets/images/UserIcon.png"),
    date: new Date(2025, 0, 8),
  },
];

const StatusBadge = ({ label }) => (
  <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[label] || "#eee" }]}> 
    <Text style={[styles.statusBadgeText, { color: label === "critical" ? "#fff" : "#222" }]}>{label}</Text>
  </View>
);

const InPatientScreen = () => {
  const router = useRouter();
  const { employeeId } = useContext(AppContext);
  const [tab, setTab] = useState("Patients");
  const [search, setSearch] = useState("");
  const [ward, setWard] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 0, 8));
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const wardOptions = [
    { label: "Select", value: "all" },
    { label: "Ward A", value: "ward_a" },
    { label: "Ward B", value: "ward_b" },
    { label: "Ward C", value: "ward_c" },
    { label: "Ward D", value: "ward_d" },
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      if (!employeeId) return;
      setLoading(true);
      try {
        const response = await getInPatientList();
        // Assume response.data is the array
        const filtered = (response.data || []).filter(
          (item) =>
            item.additional_fld_list &&
            item.additional_fld_list.includes(employeeId)
        );
        // Map to patient card format, keep other fields hardcoded
        const mapped = filtered.map((item, idx) => ({
          id: item.id,
          name: item.title,
          bed: "Bed 201, Ward B", // hardcoded for now
          ward: "ward_b", // hardcoded for now
          avatar: require("../../assets/images/UserIcon.png"),
          status: ["Stable"], // hardcoded for now
          completed: false,
          start_date: item.start_date,
        }));
        setPatients(mapped);
      } catch (e) {
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [employeeId]);

  // Filter patients based on search and ward
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(search.toLowerCase());
    const matchesWard = ward === "all" || patient.ward === ward;
    return matchesSearch && matchesWard;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <CustomStatusBar />
      <Header title="In-Patient Dashboard" onBack={() => router.back()} />

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

      {tab === 'Patients' && (
        <>
          {/* ProgressBar just below subtab */}
          <ProgressBar completed={filteredPatients.length} total={10} />

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
            <View style={[{ width: 110, marginTop: 2 }]}> 
              <DropdownPicker
                data={wardOptions}
                value={ward}
                setValue={setWard}
                showLabel={false}
              />
            </View>
          </View>

          {/* Patient Cards List */}
          {loading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
              <Text>Loading...</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 0, paddingBottom: 32 }}>
              {filteredPatients.map((patient) => (
                <View key={patient.id} style={styles.patientCardWrapper}>
                  <AppointmentCard
                    id={patient.id}
                    name={patient.name}
                    date={patient.bed}
                    time={patient.start_date}
                    avatar={patient.avatar}
                    completed={patient.completed}
                    onPress={() => router.push('/InPatientDetails')}
                    status={patient.status}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </>
      )}

      {tab === 'Surgery' && (
        <>
          {/* Search + Calendar Row */}
          <View style={[styles.searchRow, { alignItems: 'center', marginBottom: 10, minHeight: 48, paddingTop: 16 }]}> 
            <View style={{ flex: 2, marginRight: 10 }}>
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Search patients"
                style={[styles.searchBar, { marginTop: 0, height: 48 }]}
                inputStyle={{ fontSize: 15 }}
              />
            </View>
            <View style={{ width: 120, alignSelf: 'center', justifyContent: 'center', height: 48 }}>
              <DatePickerField
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Select date"
                style={{ marginTop: 0, marginBottom: 0, height: 48 }}
              />
            </View>
          </View>
          {/* Surgery Cards List */}
          <ScrollView contentContainerStyle={{ padding: 0, paddingBottom: 32 }}>
            {surgeryData
              .filter(item =>
                (!search || item.name.toLowerCase().includes(search.toLowerCase())) &&
                (!selectedDate || (item.date && item.date.toDateString() === selectedDate.toDateString()))
              )
              .map((item) => (
                <View key={item.id} style={styles.patientCardWrapper}>
                  <AppointmentCard
                    id={item.id}
                    name={item.name}
                    date={`${item.surgery} | ${item.ot}`}
                    time={item.time}
                    avatar={item.avatar}
                    status={[item.status]}
                    onPress={() => router.push({ pathname: '/SurgeryDetails', params: { name: item.name, status: item.status, details: '35, Male · Bed 201, Ward A', avatar: item.avatar, procedure: 'Appedectomy', notes: 'Patient has acute appendicitis. Prepare for laparoscopic surgery.', surgeryType: 'Laparoscopic', category: 'Emergency', attachments: JSON.stringify([{ name: 'Lab Results.pdf' }, { name: 'Imaging Report.pdf' }]) } })}
                  />
                </View>
              ))}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 2,
    marginBottom: 14,
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
    marginBottom: -5,
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