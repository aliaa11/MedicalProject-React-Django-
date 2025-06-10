import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { loadPatient, updatePatient } from '../patientsSlice';
import "../style/patientForm.css";

const PatientForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentPatient, loading, error } = useSelector((state) => state.patient);

  const [formData, setFormData] = React.useState({
    gender: '',
    date_of_birth: '',
    address: '',
    phone: '',
    medical_history: '',
    disease: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(loadPatient(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPatient && id) {
      setFormData({
        gender: currentPatient.gender || '',
        date_of_birth: currentPatient.date_of_birth || '',
        address: currentPatient.address || '',
        phone: currentPatient.phone || '',
        medical_history: currentPatient.medical_history || '',
        disease: currentPatient.disease || ''
      });
    } else if (!id) {
        setFormData({
            gender: '',
            date_of_birth: '',
            address: '',
            phone: '',
            medical_history: '',
            disease: ''
        });
    }
  }, [currentPatient, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentPatient) {
        // Update existing patient
        await dispatch(updatePatient(formData));
      }
      
      // Navigate to profile page on success
      navigate('/patient/profile');
      
    } catch (err) {
      console.error('Failed to save patient:', err);
      alert(`Error: ${err.message || 'Could not save profile. Please try again.'}`);
    }
  };

  if (loading && id && !currentPatient?.id) {
    return (
      <div className="initial-loading-spinner-container">
        <div className="initial-loading-spinner"></div>
      </div>
    );
  }

  if (!loading && id && !currentPatient?.id && !error) {
    return (
        <div className="no-patient-data-container">
            <p>Patient not found or could not be loaded.</p>
            <button
                onClick={() => navigate('/create-profile')}
                className="create-profile-button"
            >
                Create Profile
            </button>
        </div>
    );
  }

  return (
    <div className="patient-form-container">
      <h2 className="form-title">
        {currentPatient ? 'Edit Profile' : 'Create Patient Profile'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label className="form-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="full-span">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="full-span">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="form-textarea"
              required
            ></textarea>
          </div>

          <div className="full-span">
            <label className="form-label">Medical History</label>
            <textarea
              name="medical_history"
              rows={5}
              value={formData.medical_history}
              onChange={handleChange}
              className="form-textarea"
            ></textarea>
          </div>

          <div className="full-span">
            <label className="form-label">Disease</label>
            <input
              type="text"
              name="disease"
              value={formData.disease}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? 'submit-button-loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Processing...
              </>
            ) : currentPatient ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;