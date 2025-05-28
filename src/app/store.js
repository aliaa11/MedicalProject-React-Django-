import { configureStore } from '@reduxjs/toolkit';
import availabilityReducer from '../features/doctors/availabilitySlice';
import patientReducer from '../features/patients/patientsSlice';
import appointmentReducer from '../features/patients/appointmentSlice';
import doctorReducer from '../features/doctors/doctorSlice';
export const store = configureStore({
  reducer: {
    availability: availabilityReducer,
    patient: patientReducer,
    appointments: appointmentReducer,
    doctor: doctorReducer,

}});
