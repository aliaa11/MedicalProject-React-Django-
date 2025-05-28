import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const fetchAvailabilitySlots = createAsyncThunk(
  'appointments/fetchAvailabilitySlots',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/availabilitySlots?doctor_id=${doctorId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/appointments`, appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchDoctorProfile = createAsyncThunk(
    'appointments/fetchDoctorProfile',
    async (doctorId, { rejectWithValue }) => {
      try {
        const [doctorRes, userRes, specialtiesRes] = await Promise.all([
          axios.get(`${API_URL}/doctors/${doctorId}`),
          axios.get(`${API_URL}/users/${doctorId}`), // Fetch user data
          axios.get(`${API_URL}/specialties`)
        ]);
        
        const doctor = doctorRes.data;
        const user = userRes.data;
        const specialty = specialtiesRes.data.find(s => s.id === doctor.specialty_id);
        
        return {
          ...doctor,
          ...user, 
          specialty: specialty?.name || 'Unknown Specialty',
          name: user.username // Use username as name if needed
        };
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    items: [],          // Existing appointments
    slots: [],          // Available time slots
    selectedSlot: null, // Currently selected slot
    loading: false,
    error: null,
    bookingStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    bookingError: null
  },
  reducers: {
    setAppointments: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    selectSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    clearSelection: (state) => {
      state.selectedSlot = null;
    },
    resetBookingStatus: (state) => {
      state.bookingStatus = 'idle';
      state.bookingError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailabilitySlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailabilitySlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload;
      })
      .addCase(fetchAvailabilitySlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch slots';
      })
      .addCase(bookAppointment.pending, (state) => {
        state.bookingStatus = 'loading';
      })
      .addCase(bookAppointment.fulfilled, (state) => {
        state.bookingStatus = 'succeeded';
        state.selectedSlot = null;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookingStatus = 'failed';
        state.bookingError = action.payload || 'Booking failed';
      })
      .addCase(fetchDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.doctor = action.payload;
      })
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch doctor';
      });
  }
});

export const { 
  setAppointments, 
  setLoading, 
  setError, 
  selectSlot, 
  clearSelection,
  resetBookingStatus,
  setDoctorProfile,
  setBookingError
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;