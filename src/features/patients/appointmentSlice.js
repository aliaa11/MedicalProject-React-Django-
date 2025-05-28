import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const fetchAvailabilitySlots = createAsyncThunk(
  'appointments/fetchAvailabilitySlots',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/availabilitySlots?doctor_id=${doctorId}`);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch availability slots');
    }
  }
);

export const fetchDoctorProfile = createAsyncThunk(
  'appointments/fetchDoctorProfile',
  async (doctorId, { rejectWithValue }) => {
    try {
      const [doctorRes, userRes, specialtiesRes] = await Promise.all([
        axios.get(`${API_URL}/doctors/${doctorId}`),
        axios.get(`${API_URL}/users/${doctorId}`),
        axios.get(`${API_URL}/specialties`)
      ]);
      
      const doctor = doctorRes.data;
      const user = userRes.data;
      const specialty = specialtiesRes.data.find(s => s.id === doctor.specialty_id);
      
      return {
        ...doctor,
        ...user,
        specialty: specialty?.name || 'Unknown Specialty',
        name: user.username || `Dr. ${user.first_name} ${user.last_name}`
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctor profile');
    }
  }
);

export const fetchBookedAppointments = createAsyncThunk(
  'appointments/fetchBookedAppointments',
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/appointments?doctor_id=${doctorId}`);
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booked appointments');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to book appointment');
    }
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState: {
    doctor: null,
    loading: false,
    error: null,
    availabilitySlots: [],
    slotsLoading: false,
    slotsError: null,
    bookedAppointments: [],
    appointmentsLoading: false,
    appointmentsError: null,
    selectedSlot: null,
    bookingStatus: 'idle',
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
        state.error = action.payload;
      })
      .addCase(fetchAvailabilitySlots.pending, (state) => {
        state.slotsLoading = true;
        state.slotsError = null;
      })
      .addCase(fetchAvailabilitySlots.fulfilled, (state, action) => {
        state.slotsLoading = false;
        state.availabilitySlots = action.payload;
      })
      .addCase(fetchAvailabilitySlots.rejected, (state, action) => {
        state.slotsLoading = false;
        state.slotsError = action.payload;
      })
      .addCase(fetchBookedAppointments.pending, (state) => {
        state.appointmentsLoading = true;
        state.appointmentsError = null;
      })
      .addCase(fetchBookedAppointments.fulfilled, (state, action) => {
        state.appointmentsLoading = false;
        state.bookedAppointments = action.payload;
      })
      .addCase(fetchBookedAppointments.rejected, (state, action) => {
        state.appointmentsLoading = false;
        state.appointmentsError = action.payload;
      })
      .addCase(bookAppointment.pending, (state) => {
        state.bookingStatus = 'loading';
        state.bookingError = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.bookingStatus = 'succeeded';
        // Add the new appointment to the booked appointments
        state.bookedAppointments.push(action.payload);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookingStatus = 'failed';
        state.bookingError = action.payload;
      });
  }
});

export const { 
  setAppointments, 
  setLoading, 
  setError, 
  selectSlot, 
  clearSelection,
  resetBookingStatus
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;