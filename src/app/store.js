import { configureStore } from '@reduxjs/toolkit';
import patientReducer from '../features/patients/patientsSlice';
import appointmentReducer from '../features/patients/appointmentSlice';
export const store = configureStore({
  reducer: {
    patient: patientReducer,
    appointments: appointmentReducer,
  },
});