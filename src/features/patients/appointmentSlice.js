import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';
export const fetchAvailabilitySlots = createAsyncThunk(
  'appointments/fetchAvailabilitySlots',
  async (doctorId, { rejectWithValue }) => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const token = user?.token;
      const response = await axios.get(`${API_URL}/availability/public/doctor/${doctorId}/slots/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          } 
        }
      );
      const formattedSlots = response.data.map(slot => ({
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: true
      }));
      
      return formattedSlots;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch slots');
    }
  }
);

export const fetchDoctorProfile = createAsyncThunk(
  'appointments/fetchDoctorProfile',
  async (doctorId, { rejectWithValue }) => {
    try {
      // Only fetch the doctor profile
      const response = await axios.get(`${API_URL}/doctor/profile/${doctorId}`);
      return response.data;
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
  async ({ doctorId, appointmentId, ...appointmentData }, { rejectWithValue }) => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.post(
        `${API_URL}/appointments/book/${doctorId}/${appointmentId}/`,
        appointmentData,
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Booking failed');
    }
  }
);
export const fetchAvailableDays = createAsyncThunk(
  'appointments/fetchAvailableDays',
  async (doctorId, { rejectWithValue }) => {
    try {
      // Uses: /doctors/<int:doctor_id>/available-appointment-days/
      const response = await axios.get(
        `${API_URL}/doctors/${doctorId}/available-appointment-days/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available days');
    }
  }
);
export const fetchAvailableAppointmentsByDay = createAsyncThunk(
  'appointments/fetchAvailableAppointmentsByDay',
  async ({ doctorId, date }, { rejectWithValue }) => {
    try {
      // Uses: /doctors/<int:doctor_id>/available-appointments/
      const response = await axios.get(
        `${API_URL}/doctors/${doctorId}/available-appointments/?date=${date}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);
export const fetchPatientAppointmentsWithDoctors = createAsyncThunk(
  'appointments/fetchPatientAppointmentsWithDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData?.token) {
        throw new Error('Authentication token not found');
      }

      // First get appointments
      const appointmentsResponse = await axios.get(
        `${API_URL}/appointments/patient-appointments/`, 
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        }
      );

      // Get unique doctor IDs from appointments
      const doctorIds = [...new Set(
        appointmentsResponse.data.map(appt => appt.doctor)
      )];

      // Fetch details for each doctor
      const doctorsResponse = await Promise.all(
        doctorIds.map(id => 
          axios.get(`${API_URL}/doctors/${id}/`, {
            headers: {
              'Authorization': `Bearer ${userData.token}`
            }
          })
        )
      );

      const doctorsData = doctorsResponse.reduce((acc, response) => {
        acc[response.data.id] = response.data;
        return acc;
      }, {});

      // Enhance appointments with doctor data
      const enhancedAppointments = appointmentsResponse.data.map(appt => ({
        ...appt,
        doctor: doctorsData[appt.doctor] || { name: appt.doctor_name }
      }));

      localStorage.setItem('patientAppointments', JSON.stringify(enhancedAppointments));
      return enhancedAppointments;
      
    } catch (error) {
      // Fallback to localStorage if available
      const localAppointments = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
      if (localAppointments.length > 0) {
        return localAppointments;
      }
      return rejectWithValue(error.response?.data?.message || error.message);
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
  availableDays: [],
  availableAppointmentsByDay: {},
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
       .addCase(fetchAvailableDays.fulfilled, (state, action) => {
      state.availableDays = action.payload;
    })
    .addCase(fetchAvailableAppointmentsByDay.fulfilled, (state, action) => {
      state.availableAppointmentsByDay = {
        ...state.availableAppointmentsByDay,
        [action.meta.arg.date]: action.payload
      };
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
        localStorage.setItem('appointments', JSON.stringify(action.payload));
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