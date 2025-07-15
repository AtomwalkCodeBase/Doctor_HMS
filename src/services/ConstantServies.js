import AsyncStorage from '@react-native-async-storage/async-storage';

const getDbName = async (path) => {
  let dbData = await AsyncStorage.getItem('dbName');
  return dbData
};
const localhost = "https://crm.atomwalk.com"
const oldlocalhost = "https://www.atomwalk.com"
const apiURL = "/api";
const newApiURL = "/hr_api"
export const endpoint = `${oldlocalhost}${apiURL}`;
export const newEndpoint = `${localhost}${newApiURL}`;
export const newEndpoint2 = `${localhost}${apiURL}`;

export const companyInfoURL = async () => {
  const db_name = await getDbName();
  return `${endpoint}/company_info/${db_name}/`;
};

export const profileDtlURL = async () => {
  const db_name = await getDbName();
  return `${endpoint}/get_employee_list/${db_name}/`;
}

export const getActivities = async () => {
  const db_name = await getDbName();
  return `${endpoint}/get_user_activity/${db_name}/`;
}

export const updateTaskURL = async () => {
    const db_name = await getDbName();
    return `${endpoint}/update_task/${db_name}/`;
}

export const userTaskListURL =  async () => {
    const db_name = await getDbName();
    return `${endpoint}/user_task/${db_name}/`;
}

export const empLoginURL = async () => {
  const db_name = await getDbName();
  return `${newEndpoint}/emp_user_login/${db_name}/`;
}; 

export const getDbList = `${endpoint}/get_applicable_site/`;

export const setUserPinURL =  async () => {
  const db_name = await getDbName();
  return `${endpoint}/set_user_pin/${db_name}/`;
} 

export const forgetEmpPinURL =  async () => {
  const db_name = await getDbName();
  return `${newEndpoint}/emp_forget_pin/${db_name}/`;
}

export const getbookedList = async () => {
  const db_name = await getDbName();
  return `${newEndpoint2}/get_facility_booking_list/${db_name}/`;
}

export const postDocument = async () => {
  const db_name = await getDbName();
  return `${newEndpoint2}/process_cust_document_data/${db_name}/`;
}

export const processbookingdata = async () => {
  const db_name = await getDbName();
  return `${newEndpoint2}/process_booking_data/${db_name}/`;
}

export const uploadDocumentURL = async () => {
  const db_name = await getDbName();
  return `${newEndpoint2}/process_cust_document_data/${db_name}/`;
}
export const getProductCategoryListURL = async () => {
  const db_name = await getDbName();
  return `${newEndpoint2}/product_category_list/${db_name}/`;
}
export const getVariationNameListURL = async () => {
  const db_name = await getDbName();
  return `${newEndpoint2}/variation_name_list/${db_name}/`;
}
export const updateProductURL = async () => {
  const db_name = await getDbName();
  return `${newEndpoint2}/update_task_interest/${db_name}/`;
}
export const getInPatientListURL = async () => {
  const db_name = await getDbName();
  return `${newEndpoint}/get_project_list/${db_name}/`;
}