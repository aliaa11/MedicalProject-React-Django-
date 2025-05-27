import { createSlice } from '@reduxjs/toolkit';

const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState: {
      items: [],
      loading: false,
      error: null
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
      }
    }
  });
export const { setAppointments, setLoading, setError } = appointmentsSlice.actions;
 export default appointmentsSlice.reducer