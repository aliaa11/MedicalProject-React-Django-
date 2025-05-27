import React, { useEffect } from 'react';
import { Calendar, Phone, MapPin, User, Clock, Stethoscope, Edit3, Heart } from 'lucide-react';
import patientImage from '../../../assets/portrait-smiling-charming-young-man-grey-t-shirt-standing-against-plain-background.jpg';
import headerBg from '../../../assets/2148071818.jpg';
import "../style/patientProfile.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadAppointments, loadPatient } from '../patientsSlice';

const PatientProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPatient, loading, user } = useSelector((state) => state.patient);
  const appointments = useSelector((state) => state.appointments?.items || []);

  useEffect(() => {
    dispatch(loadPatient('04f0'));
    dispatch(loadAppointments('1'));
  }, [dispatch]);

  const handleEditClick = () => {
    navigate(`/edit-profile/${currentPatient.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!currentPatient) {
    return (
      <div className="no-patient-data-container">
        <p>No patient data found</p>
        <button
          onClick={() => navigate('/create-profile')}
          className="create-profile-button"
        >
          Create Profile
        </button>
      </div>
    );
  }

  const patientAppointments = appointments.filter(appt => appt.patient_id === currentPatient.id)
    .map(appt => ({
      ...appt,
      doctorName: "Dr. John",
      doctorSpecialty: "Internal Medicine"
    }));

  return (
    
    <div className="patient-profile-container">
      {/* Header Section */}
      <div className="profile-header" style={{ backgroundImage: `url(${headerBg})` }}>
        <button
          onClick={handleEditClick}
          className="edit-profile-button"
        >
          <Edit3 size={16} />
          Edit Profile
        </button>

        <div className="header-content">
          <div className="patient-image-wrapper">
            <img
              src={patientImage}
              alt="Patient"
              className="patient-profile-image"
            />
          </div>

          <div className="patient-info">
            <div className="name-gender-wrapper">
              <h1 className="patient-name">
                {user?.username || 'Not available'}
              </h1>
              <div className="gender-icon-container">
                <User className="gender-icon" size={20} />
              </div>
            </div>
            
            <h2 className="patient-id">
              #{`P-${currentPatient.id ? currentPatient.id.toString().padStart(5, '0') : '00000'}`}
            </h2>
            
            <p className="patient-email">
              {user?.email || 'Not available'}
            </p>
            
            <p className="join-date">
              <Calendar size={14} className="join-icon" />
              Joined {formatDate(currentPatient.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Details Section */}
      <div className="patient-details-section">
        <div className="details-grid">
          {/* Disease Card */}
          <div className="detail-card disease-card">
            <div className="card-header">
              <div className="card-icon-wrapper disease-icon-wrapper">
                <Heart size={20} className="card-icon" />
              </div>
              <h3 className="card-title">Primary Condition</h3>
            </div>
            <p className="disease-value">
              {currentPatient.disease || 'Not specified'}
            </p>
          </div>

          {/* Contact Info */}
          <div className="detail-card contact-card">
            <h3 className="card-title contact-title">
              <Phone size={18} className="title-icon" />
              Contact Information
            </h3>
            <div className="contact-info">
              <p className="contact-item">
                <strong>Phone:</strong> {currentPatient.phone || 'Not available'}
              </p>
              <p className="contact-item address-item">
                <MapPin size={14} className="address-icon" />
                <span>{currentPatient.address || 'Not available'}</span>
              </p>
              <p className="contact-item">
                <strong>DOB:</strong> {formatDate(currentPatient.date_of_birth)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="story-section">
        <h3 className="story-title">
          <Stethoscope size={24} className="section-icon" />
          Medical History
        </h3>
        <div className="story-content">
          <p className="story-text">
            {currentPatient.medical_history || 'No medical history provided'}
          </p>
        </div>
      </div>

      {/* Appointments Section */}
      <div className="appointments-section">
        <h3 className="appointments-section-title">
          <Calendar size={24} className="section-icon" />
          My Appointments
        </h3>
        
        {patientAppointments.length > 0 ? (
          <div className="appointments-grid">
            {patientAppointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-date-wrapper">
                    <Calendar size={18} className="appointment-icon" />
                    <span className="appointment-date">
                      {formatDate(appointment.date)}
                    </span>
                  </div>
                  <span className={`appointment-status status-${appointment.status}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                
                <div className="appointment-time-wrapper">
                  <Clock size={16} className="appointment-icon" />
                  <span className="appointment-time">
                    {formatTime(appointment.time)}
                  </span>
                </div>
                
                <div className="doctor-info">
                  <p className="doctor-name">
                    {appointment.doctorName}
                  </p>
                  <p className="doctor-specialty">
                    {appointment.doctorSpecialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-appointments-message">
            <Calendar size={48} className="no-appointments-icon" />
            <p>No upcoming appointments scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;