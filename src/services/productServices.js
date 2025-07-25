import AsyncStorage from "@react-native-async-storage/async-storage";
import { getActivities, userTaskListURL, empLoginURL, updateTaskURL, setUserPinURL, forgetEmpPinURL, getbookedList, processbookingdata, uploadDocumentURL, getProductCategoryListURL, getVariationNameListURL, updateProductURL, getInPatientListURL } from "../services/ConstantServies";
import { authAxios, authAxiosPost, publicAxiosRequest, authAxiosFilePost } from "./HttpMethod";

export async function getUserTasks(task_type, customer_id, lead_id) {
  const url = await userTaskListURL();
  let data = {};
  
  // Fetch emp_id asynchronously
  const emp_id = await AsyncStorage.getItem('empId');

  if (task_type) {
    data['task_type'] = task_type;
  }
  if (customer_id) {
    data['customer_id'] = customer_id;
  }
  if (emp_id) {
    data['emp_id'] = emp_id;
  }
  if (lead_id) {
    data['lead_id'] = lead_id;
  }
  return authAxios(url, data);
}

  export async function getActivityList() { 
    const url = await getActivities();
    
    return authAxios(url)
  }

  export async function getManagerActivityList(res) {
    const url = await getActivities(); 
    let data = {
      'call_mode': res.call_mode 
    };
    return authAxios(url,data)
  }

  export async function empLoginPrc(res) {
    const url = await empLoginURL();
    let data = {};
    if (res) {
      data['login_data'] = res;
    }
    return authAxiosPost(url, data)
  
  }


  export async function updateTask(task_data, is_completed='N', assign_user='N') {
    // console.log('updateTask', task_data, is_completed, assign_user)
    let data = {};
    data['task_data'] = task_data
    data['is_completed'] = is_completed; 
    data['assign_user'] = assign_user; 
    console.log("On call data===",data)
    const url = await updateTaskURL();
    
    return authAxiosPost(url, data);
}

export async function setUserPinView(o_pin, n_pin, employeeId) {
    
    const effectiveEmpoyeeId = employeeId;

    let data = {
      u_id: effectiveEmpoyeeId,
      o_pin: o_pin,
      n_pin: n_pin,
      user_type: "EMP",
    };
    const url = await setUserPinURL();
    return authAxiosPost(url, data);
  }

export async function forgetUserPinView(data) {
    console.log("Data to be sent--->", data);
    const url = await forgetEmpPinURL();
    return publicAxiosRequest.post(url, data);
}

export async function getbookedlistview() {
  const url = await getbookedList(); 
  // let data = payload;
  return authAxios(url);
}

export async function processBookingData(booking_data) {
  const url = await processbookingdata();
  return authAxiosPost(url, { booking_data });
}

export async function uploadDocumentData(document_data) {
  const url = await uploadDocumentURL();
  const formData = new FormData();

  formData.append('call_mode', document_data.call_mode);
  formData.append('document_id', document_data.document_id);
  formData.append('customer_id', document_data.customer_id);
  formData.append('document_name', document_data.document_name);
  formData.append('remarks', document_data.remarks);

  if (document_data.doc_file) {
    formData.append('doc_file', {
      uri: document_data.doc_file.uri,
      type: document_data.doc_file.type === 'pdf' ? 'application/pdf' : 'image/jpeg',
      name: document_data.doc_file.name || 'file',
    });
  }

  return authAxiosFilePost(url, formData);
}

export async function getProductCategoryList() {
  const url = await getProductCategoryListURL();
  return authAxios(url);
}

export async function getVariationNameList() {
  const url = await getVariationNameListURL();
  return authAxios(url);
}

export async function updateProduct(task_interest_data) {
  const url = await updateProductURL();
  return authAxiosPost(url, { task_interest_data });
}

export async function getInPatientList() {
  const url = await getInPatientListURL();
  return authAxios(url);
}