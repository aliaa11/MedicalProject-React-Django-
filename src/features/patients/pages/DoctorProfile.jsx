"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDoctorProfile } from "../appointmentSlice"
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
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import "../style/doctor-profile.css"
import profile_picture from '../../../assets/portrait-smiling-charming-young-man-grey-t-shirt-standing-against-plain-background.jpg';

const DoctorProfile = ({ doctorId: propDoctorId }) => {
  const params = useParams()
  const doctorId = propDoctorId || params?.doctorId || "1"
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { doctor, loading, error } = useSelector((state) => state.appointments)

  useEffect(() => {
    dispatch(fetchDoctorProfile(doctorId))
  }, [dispatch, doctorId])

  const handleBookAppointment = () => {
    navigate(`/available-slots?doctorId=${doctorId}`)
  }

  const handleContactDoctor = () => {
    console.log("Contact doctor functionality")
  }

  if (loading) {
    return (
      <div className="doctor-profile-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading doctor profile...</p>
        </div>
      </div>
    )
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
    )
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
    )
  }

  return (
    <div className="doctor-profile-container">
      <div className="profile-wrapper max-w-6xl">
        {/* Doctor Header Section */}
        <div className="profile-header">
          <div className="doctor-header-content">
            {/* Doctor Avatar */}
            <div className="doctor-avatar-container">
              <div className="doctor-avatar">
                {doctor.profile_picture ? (
                  <img src={profile_picture} alt={doctor.name} />
                ) : (
                  <User />
                )}
              </div>
              <div className="status-badge"></div>
            </div>

            {/* Doctor Info */}
            <div className="doctor-profile-info">
              <h1 className="doctor-name">{doctor.name}</h1>
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
                <span>About Dr. {doctor.name}</span>
              </h2>
              <div className="biography-text">
                {doctor.bio ||
                  `Dr. ${doctor.name} is a highly experienced ${doctor.specialty} specialist with ${doctor.years_of_experience} years of practice. Known for providing compassionate and comprehensive care to patients of all ages.`}
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
                  <span className="info-value">{doctor.specialty}</span>
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
              <div className="schedule-grid">
                {[
                  { day: "Monday", time: "9:00 AM - 5:00 PM", available: true },
                  { day: "Tuesday", time: "9:00 AM - 5:00 PM", available: true },
                  { day: "Wednesday", time: "9:00 AM - 5:00 PM", available: true },
                  { day: "Thursday", time: "9:00 AM - 5:00 PM", available: true },
                  { day: "Friday", time: "9:00 AM - 5:00 PM", available: true },
                  { day: "Saturday", time: "10:00 AM - 2:00 PM", available: true },
                  { day: "Sunday", time: "Closed", available: false },
                ].map((schedule) => (
                  <div key={schedule.day} className={`schedule-item ${!schedule.available ? "unavailable" : ""}`}>
                    <span className="schedule-day">{schedule.day}</span>
                    <span className="schedule-time">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
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
                    <p className="contact-value">{doctor.phone}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="contact-details">
                    <p className="contact-label">Email</p>
                    <p className="contact-value">{doctor.contact_email || doctor.email}</p>
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

            {/* Action Buttons */}
            <div className="action-buttons">
              <button onClick={handleBookAppointment} className="btn-primary">
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
  )
}

export default DoctorProfile
