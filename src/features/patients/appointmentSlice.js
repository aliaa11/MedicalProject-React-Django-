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
export const fetchAllSpecialties = createAsyncThunk(
  'appointments/fetchAllSpecialties',
  async (doctorId, { rejectWithValue }) => {
    try {
      // First fetch the doctor to get their specialty_id
      const doctorRes = await axios.get(`${API_URL}/doctors/${doctorId}`);
      const specialtyId = doctorRes.data.specialty_id;
      
      // Then fetch all specialties and find the matching one
      const specialtiesRes = await axios.get(`${API_URL}/specialties`);
      const specialty = specialtiesRes.data.find(s => s.id === specialtyId);
      
      return specialty || { name: 'Unknown Specialty' };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch specialties');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointments/bookAppointment',
  async (appointmentData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const existingAtSameTime = state.appointments.patientAppointments.some(
        appt => appt.date === appointmentData.date && appt.time === appointmentData.time
      );

      if (existingAtSameTime) {
        throw new Error('You already have an appointment at this time');
      }

      const response = await axios.post(`${API_URL}/appointments`, appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchPatientAppointmentsWithDoctors = createAsyncThunk(
  'appointments/fetchPatientAppointmentsWithDoctors',
  async (_, { rejectWithValue }) => { 
    try {
      let patientId;
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          throw new Error('No user data found in localStorage');
        }
        const user = JSON.parse(userStr); // Parse the JSON string
        patientId = user.id;
      } catch (parseError) {
        console.error('Error parsing user from localStorage:', parseError);
        throw new Error('Invalid user data in localStorage');
      }
      
      if (!patientId) {
        throw new Error('No patient ID found in user data');
      }
      

      const appointmentsUrl = `${API_URL}/appointments?patient_id=${patientId}`;
      
      const appointmentsResponse = await axios.get(appointmentsUrl);
      const appointments = appointmentsResponse.data || [];
      

      if (appointments.length === 0) {
        return [];
      }
      
      const validAppointments = appointments.filter(app => {
        if (!app.doctor_id) {
          console.warn('Appointment missing doctor_id:', app);
          return false;
        }
        return true;
      });
      
      const invalidAppointments = appointments.filter(app => !app.doctor_id);
    
      
      // Fetch doctor details only for valid appointments
      const appointmentsWithDoctors = await Promise.all(
        validAppointments.map(async (appointment) => {
          try {
            
            const [doctorRes, userRes, specialtiesRes] = await Promise.all([
              axios.get(`${API_URL}/doctors/${appointment.doctor_id}`),
              axios.get(`${API_URL}/users/${appointment.doctor_id}`),
              axios.get(`${API_URL}/specialties`)
            ]);
            
            const doctor = doctorRes.data;
            const user = userRes.data;
            const specialty = specialtiesRes.data.find(s => s.id === doctor.specialty_id);
            
            return {
              ...appointment,
              doctor: {
                ...doctor,
                ...user,
                specialty: specialty?.name || 'Unknown Specialty',
                name: user.username || `Dr. ${user.first_name} ${user.last_name}`
              }
            };
          } catch (error) {
            console.error(`Failed to fetch doctor data for appointment ${appointment.id}:`, error);
            return {
              ...appointment,
              doctor: {
                name: 'Unknown Doctor',
                specialty: 'Unknown Specialty'
              }
            };
          }
        })
      );
      
      const incompleteAppointments = invalidAppointments.map(appointment => ({
        ...appointment,
        doctor: {
          name: 'Doctor information missing',
          specialty: 'Unknown',
          incomplete: true
        }
      }));
      
      const finalResult = [...appointmentsWithDoctors, ...incompleteAppointments];
      
      return finalResult;
    } catch (error) {
      console.error('Error in fetchPatientAppointmentsWithDoctors:', error);
      return rejectWithValue(error.message || 'Failed to fetch patient appointments');
    }
  }
);
export const checkTimeSlotAvailability = createAsyncThunk(
  'appointments/checkTimeSlotAvailability',
  async ({ patientId, date, time }, { rejectWithValue }) => {
    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr)
      patientId = user.id;
      const response = await axios.get(
        `${API_URL}/appointments?patient_id=${patientId}&date=${date}&time=${time}`
      );
      return response.data.length === 0; // Returns true if slot is available
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check time slot');
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
    bookingError: null,
    timeSlotCheck: {
      loading: false,
      available: null,
      error: null
    },
    patientAppointments: [],
    patientAppointmentsLoading: false,
    patientAppointmentsError: null,
  },
  reducers: {
    setAppointments: (state, action) => {
      state.items = action.payload;
    },
    resetTimeSlotCheck: (state) => {
      state.timeSlotCheck = {
        loading: false,
        available: null,
        error: null
      };
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
      })
      .addCase(fetchPatientAppointmentsWithDoctors.pending, (state) => {
        state.patientAppointmentsLoading = true;
        state.patientAppointmentsError = null;
      })
      .addCase(fetchPatientAppointmentsWithDoctors.fulfilled, (state, action) => {
        state.patientAppointmentsLoading = false;
        state.patientAppointments = action.payload;
      })
      .addCase(fetchPatientAppointmentsWithDoctors.rejected, (state, action) => {
        state.patientAppointmentsLoading = false;
        state.patientAppointmentsError = action.payload;
      })
      .addCase(checkTimeSlotAvailability.pending, (state) => {
        state.timeSlotCheck.loading = true;
        state.timeSlotCheck.error = null;
      })
      .addCase(checkTimeSlotAvailability.fulfilled, (state, action) => {
        state.timeSlotCheck.loading = false;
        state.timeSlotCheck.available = action.payload;
      })
      .addCase(checkTimeSlotAvailability.rejected, (state, action) => {
        state.timeSlotCheck.loading = false;
        state.timeSlotCheck.error = action.payload;
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
  clearPatientAppointments, 
  updateAppointmentStatus,
  resetTimeSlotCheck
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;