const API_URL = 'http://127.0.0.1:8000/api';

const handleApiError = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

export const fetchAllDoctors = async () => {
  const response = await fetch(`${API_URL}/doctors/`);
  return handleApiError(response);
};

export const fetchAllSpecialties = async () => {
  const response = await fetch(`${API_URL}/admin/specialties/`);
  return handleApiError(response);
};

// export const fetchAllUsers = async () => {
//   const response = await fetch(`${API_URL}/users`);
//   return handleApiError(response);
// };


// Fetch doctor by ID
// export const fetchDoctorById = async (id) => {
//   try {
//     const response = await fetch(`${API_URL}/doctors/${id}`);
//     return await handleApiError(response);
//   } catch (err) {
//     console.error(`Failed to fetch doctor ${id}:`, err);
//     throw err;
//   }
// };

// // Fetch approved doctors
// export const fetchApprovedDoctors = async () => {
//   try {
//     const response = await fetch(`${API_URL}/doctors?approved=true`);
//     return await handleApiError(response);
//   } catch (err) {
//     console.error('Failed to fetch approved doctors:', err);
//     throw err;
//   }
// };

// Fetch doctors by specialty
// export const fetchDoctorsBySpecialty = async (specialtyId) => {
//   try {
//     const response = await fetch(`${API_URL}/doctors?specialty_id=${specialtyId}`);
//     return await handleApiError(response);
//   } catch (err) {
//     console.error(`Failed to fetch doctors for specialty ${specialtyId}:`, err);
//     throw err;
//   }
// };

// // Create a new doctor
// export const createNewDoctor = async (doctorData) => {
//   try {
//     const response = await fetch(`${API_URL}/doctors`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(doctorData),
//     });
//     return await handleApiError(response);
//   } catch (err) {
//     console.error('Failed to create doctor:', err);
//     throw err;
//   }
// };

// // Update a doctor
// export const updateExistingDoctor = async (id, updatedData) => {
//   try {
//     const response = await fetch(`${API_URL}/doctors/${id}`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updatedData),
//     });
//     return await handleApiError(response);
//   } catch (err) {
//     console.error(`Failed to update doctor ${id}:`, err);
//     throw err;
//   }
// };