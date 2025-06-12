import { createSlice } from '@reduxjs/toolkit';
import { setAppointments } from './appointmentSlice';

// Helper function to get user from localStorage
const getStoredUser = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};

const initialState = {
  currentPatient: null,
  user: getStoredUser(),
  loading: false,
  error: null
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        role: action.payload.role,
        token: action.payload.token,               // ✅ إضافة التوكن
        refreshToken: action.payload.refreshToken  // ✅ إضافة الريفريش توكن
      };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    setPatient: (state, action) => {
      state.currentPatient = {
        id: action.payload.id,
        user_id: action.payload.user_id,
        gender: action.payload.gender,
        date_of_birth: action.payload.date_of_birth,
        address: action.payload.address,
        phone: action.payload.phone,
        medical_history: action.payload.medical_history,
        disease: action.payload.disease,
        created_at: action.payload.created_at,
        updated_at: action.payload.updated_at
      };
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updatePatientSuccess: (state, action) => {
      state.currentPatient = action.payload;
    },
    createPatientSuccess: (state, action) => {
      state.currentPatient = action.payload;
    },
    clearPatient: (state) => {
      state.currentPatient = null;
      state.user = null;
      localStorage.removeItem('user');
    }
  }
});

export const {
  setLoading,
  setPatient,
  setUser,
  setError,
  updatePatientSuccess,
  createPatientSuccess,
  clearPatient
} = patientSlice.actions;

const API_URL = 'http://localhost:8000/api';
const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

export const loadAppointments = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
  const userData = JSON.parse(localStorage.getItem("user"));
  const response = await fetch(`${API_URL}/patient/profile`, { // Note: removed trailing slash
    headers: {
      'Authorization': `Bearer ${userData.token}`
    }
  });
   
    const data = await handleApiError(response);
    dispatch(setAppointments(data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};



export const loadPatient = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    
    if (!userData?.token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_URL}/patient/profile`, {
      headers: {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await handleApiError(response);
    
    // فقط بنحدث بيانات المريض، ومش هنلمس user
    dispatch(setPatient(data));
    
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};


export const updatePatient = (updatedData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
   const userData = JSON.parse(localStorage.getItem("user"));
const token = userData?.token;
if (!token) throw new Error("Authentication token not found");

    
    if (!userData.token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`http://localhost:8000/api/patient/profile`, { // تم إزالة الشرطة المائلة الأخيرة
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
      },
      body: JSON.stringify({
        gender: updatedData.gender,
        date_of_birth: updatedData.date_of_birth,
        address: updatedData.address,
        phone: updatedData.phone,
        medical_history: updatedData.medical_history,
        disease: updatedData.disease,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update patient profile');
    }

    const updatedPatient = await response.json();
    
    dispatch(updatePatientSuccess(updatedPatient));
    return { success: true, data: updatedPatient };
  } catch (err) {
    dispatch(setError(err.message));
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};




// Action to initialize user from localStorage
export const initializeAuth = () => (dispatch) => {
  const user = getStoredUser();
  if (user) {
    dispatch(setUser(user));
    dispatch(loadPatient());
  }
};

export default patientSlice.reducer;