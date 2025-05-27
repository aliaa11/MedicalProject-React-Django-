import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  doctors: [
    {
      id: 1,
      user_id: 1,
      specialty_id: 1,
      gender: "male",
      phone: "01000000000",
      bio: "Expert in internal medicine.",
      profile_picture: "profile1.jpg",
      contact_email: "contact.john@example.com",
      years_of_experience: 10,
    },
  ],
  users: [
    { id: 1, username: "dr_john", email: "john@example.com", role: "doctor" },
    { id: 2, username: "patient_ali", email: "ali@example.com", role: "patient" },
  ],
  specialties: [
    { id: 1, name: "Internal Medicine" },
    { id: 2, name: "Pediatrics" },
  ],
  currentDoctorId: 1,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    updateDoctorProfile: (state, action) => {
      const updatedFields = action.payload;
      const doctorIndex = state.doctors.findIndex(d => d.id === state.currentDoctorId);
      if (doctorIndex !== -1) {
        state.doctors[doctorIndex] = { ...state.doctors[doctorIndex], ...updatedFields };
      }
    },
    // يمكنك اضافة ريديوسرات أخرى حسب الحاجة
  },
});

export const { updateDoctorProfile } = doctorSlice.actions;
export default doctorSlice.reducer;
