import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  SafeAreaView,
  Dimensions 
} from 'react-native';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import DropdownPicker from '../components/DropdownPicker';
import RoundedTextInput from '../components/RoundedTextInput';
import PrimaryButton from '../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import DatePickerField from '../components/DatePickerField';
import { getProductCategoryList, getVariationNameList, updateProduct } from '../services/productServices';
import { AppContext } from '../../context/AppContext';
import SuccessModal from '../components/SuccessModal';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const BLUE = '#0366d6';

const PRIORITIES = ['Routine', 'Urgency', 'Emergency'];

const TestPicker = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState(PRIORITIES[0]);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [variationTests, setVariationTests] = useState([]);
  const [loadingVariations, setLoadingVariations] = useState(true);
  const [variationError, setVariationError] = useState(null);
  const { customerId } = useContext(AppContext);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setCategoryError(null);
      try {
        const response = await getProductCategoryList();
        // If response is { data: [...] } or just [...], adjust accordingly
        const categoryList = Array.isArray(response.data) ? response.data : response;
        setCategories(categoryList);
        setSelectedCategory(categoryList[0]?.name || null);
      } catch (error) {
        setCategoryError('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchVariations = async () => {
      setLoadingVariations(true);
      setVariationError(null);
      try {
        const response = await getVariationNameList();
        const variationList = Array.isArray(response.data) ? response.data : response;
        setVariations(variationList);
        if (variationList.length > 0) {
          setSelectedVariation(variationList[0].id);
          setVariationTests(variationList[0].v_list.map(item => item[0]));
        }
      } catch (error) {
        setVariationError('Failed to load variations');
      } finally {
        setLoadingVariations(false);
      }
    };
    fetchVariations();
  }, []);

  useEffect(() => {
    if (!selectedVariation) return;
    const selected = variations.find(v => v.id === selectedVariation);
    if (selected) {
      setVariationTests(
        selected.v_list
          .filter(item => item[0] && item[1] && item[1] !== 'Not Selected')
          .map(item => item[0])
      );
    } else {
      setVariationTests([]);
    }
  }, [selectedVariation, variations]);

  const toggleTest = (id) => {
    setSelectedTests(prev => {
      if (prev.includes(id)) {
        return prev.filter(testId => testId !== id);
      } else if (prev.length < 3) {
        return [...prev, id];
      } else {
        return prev; // Do not allow more than 3
      }
    });
  };

  // Helper to format date as DD-MM-YYYY
  const formatDate = (dateObj) => {
    const d = new Date(dateObj);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Find selected category id
  const getSelectedCategoryId = () => {
    const cat = categories.find(c => c.name === selectedCategory);
    return cat ? cat.id : null;
  };

  // Order Tests handler
  const handleOrderTests = async () => {
    if (!customerId) {
      alert('Customer ID not found.');
      return;
    }
    if (!selectedVariation) {
      alert('Please select a variation.');
      return;
    }
    if (!getSelectedCategoryId()) {
      alert('Please select a category.');
      return;
    }
    if (selectedTests.length === 0) {
      alert('Please select at least one test.');
      return;
    }
    // Prepare up to 3 variation values
    const values = [...selectedTests];
    while (values.length < 3) values.push('');
    const payload = {
      call_mode: 'C',
      category_id: getSelectedCategoryId(),
      customer_id: customerId,
      due_date: formatDate(date),
      id: '',
      lead_id: '',
      product_info: notes,
      task_id: '',
      variation_name_id: selectedVariation,
      variation_name_1_id: selectedVariation,
      variation_name_2_id: selectedVariation,
      variation_value: values[0],
      variation_value_1: values[1],
      variation_value_2: values[2],
    };
    try {
      // console.log('Sending payload to updateProduct:', payload);
      const response = await updateProduct(payload);
      // console.log('API response:', response);
      setSuccessModalVisible(true);
      setSelectedTests([]);
      setNotes('');
    } catch (err) {
      console.log('API error:', err);
      alert('Failed to place order.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title="Order Tests" 
        onBack={() => router.back()} 
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search + Calendar Row (aligned with content) */}
        <View style={styles.searchDateRow}>
          <View style={{ flex: 2, marginRight: 10 }}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search tests..."
              style={[styles.searchBar, { marginTop: 0, height: 48 }]}
              inputStyle={{ fontSize: 15 }}
            />
          </View>
          <View style={{ width: 120, alignSelf: 'center', justifyContent: 'center', height: 48 }}>
            <DatePickerField
              value={date}
              onChange={setDate}
              placeholder="Select date"
              style={{ marginTop: 0, marginBottom: 0, height: 48 }}
            />
          </View>
        </View>

        {/* Categories */}
        {loadingCategories ? (
          <View style={{ padding: 16 }}><Text>Loading categories...</Text></View>
        ) : categoryError ? (
          <View style={{ padding: 16 }}><Text style={{ color: 'red' }}>{categoryError}</Text></View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.name && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(category.name)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.name && styles.activeCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Subcategory Dropdown replaced with Variation Dropdown */}
        <View style={styles.dropdownContainer}>
          {loadingVariations ? (
            <Text>Loading variations...</Text>
          ) : variationError ? (
            <Text style={{ color: 'red' }}>{variationError}</Text>
          ) : (
            <DropdownPicker
              data={variations.map(v => ({ label: v.name, value: v.id }))}
              value={selectedVariation}
              setValue={setSelectedVariation}
              style={styles.dropdown}
              showLabel={false}
              placeholder="Select variation"
            />
          )}
        </View>

        {/* Tests List replaced with Variation Tests */}
        <View style={styles.testsContainer}>
          <Text style={styles.sectionTitle}>Available Tests</Text>
          {variationTests.length > 0 ? (
            variationTests.map((test, idx) => (
              <TouchableOpacity
                key={test + idx}
                style={[
                  styles.testCard,
                  selectedTests.includes(test) && styles.selectedTestCard
                ]}
                onPress={() => toggleTest(test)}
                activeOpacity={0.8}
              >
                <View style={styles.testCheckboxContainer}>
                  <View style={[
                    styles.testCheckbox,
                    selectedTests.includes(test) && styles.checkedTestCheckbox
                  ]}>
                    {selectedTests.includes(test) && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                </View>
                <View style={styles.testInfo}>
                  <Text style={styles.testName}>{test}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="search" size={40} color="#CBD5E1" />
              <Text style={styles.noResultsText}>No tests found</Text>
            </View>
          )}
        </View>

        {/* Priority */}
        <View style={styles.priorityContainer}>
          <Text style={styles.sectionTitle}>Priority Level</Text>
          <View style={styles.priorityButtonRow}>
            {PRIORITIES.map(priority => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityBtn,
                  selectedPriority === priority ? styles.priorityBtnSelected : styles.priorityBtnUnselected
                ]}
                onPress={() => setSelectedPriority(priority)}
                activeOpacity={0.85}
              >
                <Text style={[
                  styles.priorityBtnText,
                  selectedPriority === priority && styles.priorityBtnTextSelected
                ]}>
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesContainer}>
          <Text style={styles.sectionTitle}>Clinical Notes (Optional)</Text>
          <RoundedTextInput
            style={styles.notesInput}
            placeholder="Type your notes here..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      {/* Order Button (fixed at bottom, outside ScrollView) */}
      {selectedTests.length > 0 && (
        <View style={styles.orderContainer}>
          <View style={styles.orderSummary}>
            <Text style={styles.orderCount}>{selectedTests.length}</Text>
            <Text style={styles.orderText}>Tests Selected</Text>
          </View>
          <PrimaryButton 
            style={styles.orderButton}
            onPress={handleOrderTests}
            icon="paper-plane-outline"
          >
            Order Tests
          </PrimaryButton>
        </View>
      )}

      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        message="Order placed successfully!"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  searchDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 0,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 44,
  },
  categoriesContainer: {
    paddingBottom: 8,
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: '#EDF2F7',
  },
  activeCategoryButton: {
    backgroundColor: BLUE,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BLUE,
    height: 48,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  testsContainer: {
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  testCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedTestCard: {
    backgroundColor: '#E6F0FA',
    borderColor: BLUE,
  },
  testCheckboxContainer: {
    marginRight: 16,
  },
  testCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedTestCheckbox: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 16,
  },
  priorityContainer: {
    marginBottom: 8,
    marginTop: 8,
  },
  priorityButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  priorityBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: BLUE,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  priorityBtnSelected: {
    backgroundColor: BLUE,
  },
  priorityBtnUnselected: {
    backgroundColor: '#fff',
  },
  priorityBtnText: {
    color: BLUE,
    fontWeight: '600',
    fontSize: 15,
  },
  priorityBtnTextSelected: {
    color: '#fff',
  },
  notesContainer: {
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 140,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  orderContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 20,
    borderRadius: 0,
  },
  orderSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderCount: {
    fontSize: 20,
    fontWeight: '700',
    color: BLUE,
    marginRight: 8,
  },
  orderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  orderButton: {
    flex: 1,
    marginLeft: 16,
    maxWidth: width * 0.6,
  },
});

export default TestPicker;