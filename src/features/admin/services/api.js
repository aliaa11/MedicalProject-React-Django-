const API_BASE_URL = 'http://localhost:3001';

// Helper function for API calls
const fetchData = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return response.json();
};

const updateData = async (endpoint, id, data) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update ${endpoint}/${id}`);
  }
  return response.json();
};

const deleteData = async (endpoint, id) => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete ${endpoint}/${id}`);
  }
  return id;
};

// Users API
export const fetchUsers = () => fetchData('users');
export const updateUserApproval = (id, isApproved) => updateData('users', id, { is_approved: isApproved });
export const deleteUser = (id) => deleteData('users', id);

// Doctors API
export const fetchDoctors = () => fetchData('doctors');
export const updateDoctor = (id, data) => updateData('doctors', id, data);
export const updateDoctorApproval = (id, data) => updateData('doctors', id, data);
export const deleteDoctor = (id) => deleteData('doctors', id);

// Patients API
export const fetchPatients = () => fetchData('patients');
export const deletePatient = (id) => deleteData('patients', id);

// Specialties API
export const fetchSpecialties = () => fetchData('specialties');
export const createSpecialty = (data) => {
  return fetch(`${API_BASE_URL}/specialties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
};
export const updateSpecialty = (id, data) => updateData('specialties', id, data);
export const deleteSpecialty = (id) => deleteData('specialties', id);

// Appointments API
export const fetchAppointments = () => fetchData('appointments');
export const updateAppointmentStatus = (id, status) => updateData('appointments', id, { status });
export const deleteAppointment = (id) => deleteData('appointments', id);

// Availability Slots API
export const fetchAvailabilitySlots = () => fetchData('availabilitySlots');
export const deleteAvailabilitySlot = (id) => deleteData('availabilitySlots', id);
// Add this to your existing api.js exports
export const updateUser = (id, data) => updateData('users', id, data);