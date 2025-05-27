import { configureStore } from '@reduxjs/toolkit';
import availabilityReducer from '../features/doctors/availabilitySlice';

export const store = configureStore({
  reducer: {
    availability: availabilityReducer,
  },
});
