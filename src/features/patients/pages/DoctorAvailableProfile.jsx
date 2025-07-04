import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  Phone,
  Mail,
  Stethoscope,
  Award,
  Clock,
  MapPin,
  Star,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { fetchDoctorProfile, fetchAvailabilitySlots, fetchAllSpecialties } from "../appointmentSlice";
import "../style/doctor-profile.css";
import profile_picture from '../../../assets/woman-doctor-wearing-lab-coat-with-stethoscope-isolated.jpg';

const DoctorAvailableProfile = ({ doctorId: propDoctorId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctorId = propDoctorId || params?.doctorId;
  console.log("Doctor ID:", doctorId);
  const { 
    doctor, 
    loading, 
    error,
    availabilitySlots,
    slotsLoading,
    slotsError,
    specialties,
    specialtiesLoading,
    specialtiesError
  } = useSelector((state) => state.appointments);
  console.log("Doctor Profile Data:", doctor);
  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorProfile(doctorId));
      dispatch(fetchAvailabilitySlots(doctorId));
      dispatch(fetchAllSpecialties(doctorId))
    }
  }, [dispatch, doctorId]);

  const handleBookAppointment = () => {
    navigate(`/available-slots?doctorId=${doctorId}`);
  };

  const handleContactDoctor = () => {
    console.log("Contact doctor functionality");
  };

  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber] || 'Unknown';
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="doctor-profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-profile-container">
        <div className="error-container">
          <AlertCircle className="error-icon" />
          <h2 className="error-title">Error Loading Profile</h2>
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="error-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-profile-container">
        <div className="error-container">
          <User className="error-icon" />
          <h2 className="error-title">Doctor Not Found</h2>
          <p className="error-message">The requested doctor profile could not be found.</p>
          <button onClick={() => navigate("/")} className="error-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-profile-container">
      <div className="doctor-profile-wrapper">
        <div className="profile-doctor-header">
          <div className="doctor-header-content">
            <div className="doctor-avatar-container">
              <div className="doctor-avatar">
                {doctor.profile_picture ? (
                  <img src={profile_picture} alt={doctor.user} />
                ) : (
                  <User />
                )}
              </div>
              <div className="doctor-status-badge"></div>
            </div>

            {/* Doctor Info */}
            <div className="doctor-profile-info">
              <h1 className="doctor-name">{doctor.user}</h1>
              <div className="doctor-specialty">
                <Stethoscope className="w-5 h-5 inline mr-2" />
                {doctor.specialty}
              </div>
              <div className="doctor-experience">
                <Award className="w-4 h-4" />
                <span>{doctor.years_of_experience} years experience</span>
                <div className="doctor-rating ml-4">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span className="rating-text">4.9 (127 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          {/* Main Content */}
          <div className="space-y-6">
            {/* About Section */}
            <div className="info-card">
              <h2 className="card-title">
                <User className="w-5 h-5" />
                <span>About {doctor.user.username}</span>
              </h2>
              <div className="biography-text">
                {doctor.bio ||
                  `Dr. ${doctor.user.username} is a highly experienced ${doctor.specialty} specialist with ${doctor.years_of_experience} years of practice. Known for providing compassionate and comprehensive care to patients of all ages.`}
              </div>
            </div>

            {/* Professional Information */}
              <div className="info-card">
                <h2 className="card-title">
                  <Stethoscope className="w-5 h-5" />
                  <span>Professional Information</span>
                </h2>
                <div className="info-grid grid md:grid-cols-2 gap-4">
                  <div className="info-item">
                    <span className="info-label">Specialty</span>
                    <span className="info-value">
                      {doctor.specialty}
                      {specialties && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({specialties.name || 'Loading specialties...'})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Experience</span>
                    <span className="info-value">{doctor.years_of_experience} years</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Gender</span>
                    <span className="info-value capitalize">{doctor.gender || "Not specified"}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Consultation Fee</span>
                    <span className="info-value font-semibold">$150</span>
                  </div>
                </div>
              </div>

            {/* Availability Schedule */}
              <div className="info-card">
                <h2 className="card-title">
                  <Calendar className="w-5 h-5" />
                  <span>Availability Schedule</span>
                </h2>
                {slotsError ? (
                  <div className="error-message p-4 bg-red-50 text-red-600 rounded">
                    <AlertCircle className="inline mr-2" />
                    {slotsError}
                    <button 
                      onClick={() => dispatch(fetchAvailabilitySlots(doctorId))}
                      className="ml-4 text-blue-600 hover:underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : slotsLoading ? (
                  <div className="loading-text p-4">Loading availability...</div>
                ) : (
                  <div className="schedule-grid">
                    {[0, 1, 2, 3, 4, 5, 6].map((dayNumber) => {
                      const slot = availabilitySlots?.find(s => 
                        parseInt(s.day_of_week) === dayNumber
                      );
                      const isAvailable = !!slot;
                      
                  return (
                    <div 
                      key={dayNumber} 
                      className={`schedule-item ${isAvailable ? 'available' : 'unavailable'}`}
                    >
                      <span className="schedule-day">{getDayName(dayNumber)}</span>
                      {isAvailable ? (
                        <div className="schedule-details">
                          <span className="schedule-time">
                            {`${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`}
                          </span>
                          {slot.is_available && (
                            <span className="available-badge">Available</span>
                          )}
                        </div>
                      ) : (
                        <span className="schedule-time closed">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          </div>

          <div className="space-y-6">
            {/* Contact Information */}
            <div className="info-card">
              <h2 className="card-title">
                <Phone className="w-5 h-5" />
                <span>Contact Information</span>
              </h2>
              <div className="space-y-4">
                <div className="contact-item">
                  <div className="contact-icon">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="contact-details">
                    <p className="contact-label">Phone</p>
                    <p className="contact-value">{doctor.phone || "Not available"}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="contact-details">
                    <p className="contact-label">Email</p>
                    <p className="contact-value">{doctor.contact_email || doctor.email || "Not available"}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="contact-details">
                    <p className="contact-label">Location</p>
                    <p className="contact-value">Medical Center, Floor 3</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Specialties Section */}
              <div className="info-card">
                <h2 className="card-title">
                  <Stethoscope className="w-5 h-5" />
                  <span>Specialties</span>
                </h2>
                {specialtiesError ? (
                  <div className="error-message p-4 bg-red-50 text-red-600 rounded">
                    <AlertCircle className="inline mr-2" />
                    {specialtiesError}
                    <button 
                      onClick={() => dispatch(fetchAllSpecialties(doctorId))}
                      className="ml-4 text-blue-600 hover:underline"
                    >
                      Retry
                    </button>
                  </div>
                ) : specialtiesLoading ? (
                  <div className="loading-text p-4">Loading specialties...</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(specialties) ? (
                      specialties.map(specialty => (
                        <span key={specialty.id} className="specialty-badge">
                          {specialty.name}
                        </span>
                      ))
                    ) : (
                      <span className="specialty-badge">
                        {doctor.specialty}
                      </span>
                    )}
                  </div>
                )}
              </div>
            {/* Action Buttons */}
            <div className="action-buttons">
              <button onClick={handleBookAppointment} className="bookbtn">
                <Calendar className="w-5 h-5" />
                Book Appointment
              </button>

              <button onClick={handleContactDoctor} className="btn-secondary">
                <MessageCircle className="w-5 h-5" />
                Contact Doctor
              </button>
            </div>

            {/* Important Notes */}
            <div className="info-card border-l-4 border-l-amber-400 bg-amber-50">
              <h3 className="card-title text-amber-800">
                <Clock className="w-4 h-4" />
                Important Notes
              </h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>Please arrive 15 minutes early</li>
                <li>Bring a valid ID and insurance card</li>
                <li>Bring any relevant medical records</li>
                <li>Consultation fee: $150</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailableProfile;