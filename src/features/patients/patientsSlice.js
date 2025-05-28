import { createSlice } from '@reduxjs/toolkit';
import { setAppointments } from './appointmentSlice';

const initialState = {
  currentPatient: null,
  user: null,
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
      }
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

const API_URL = 'http://localhost:3001';

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
    const response = await fetch(`${API_URL}/appointments`);
    const data = await handleApiError(response);
    dispatch(setAppointments(data));
  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loadPatient = (patientId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`${API_URL}/patients/${patientId}`);
    const patient = await handleApiError(response);
    dispatch(setPatient(patient));

    const userResponse = await fetch(`${API_URL}/users/${patient.user_id}`);
    const user = await handleApiError(userResponse);
    dispatch(setUser(user));

  } catch (err) {
    dispatch(setError(err.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updatePatient = (updatedData) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  try {
    const { currentPatient } = getState().patient;
    
    const response = await fetch(`${API_URL}/patients/${currentPatient.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gender: updatedData.gender,
        date_of_birth: updatedData.date_of_birth,
        address: updatedData.address,
        phone: updatedData.phone,
        medical_history: updatedData.medical_history,
        disease: updatedData.disease,
        updated_at: new Date().toISOString()
      }),
    });
    
    const updatedPatient = await handleApiError(response);
    dispatch(updatePatientSuccess(updatedPatient));
    return { success: true, data: updatedPatient };
  } catch (err) {
    dispatch(setError(err.message));
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};

export const createPatient = (patientData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: patientData.user_id,
        gender: patientData.gender,
        date_of_birth: patientData.date_of_birth,
        address: patientData.address,
        phone: patientData.phone,
        medical_history: patientData.medical_history || '',
        disease: patientData.disease || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }),
    });
    
    const newPatient = await handleApiError(response);
    dispatch(createPatientSuccess(newPatient));
    return { success: true, data: newPatient };
  } catch (err) {
    dispatch(setError(err.message));
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};

export default patientSlice.reducer;