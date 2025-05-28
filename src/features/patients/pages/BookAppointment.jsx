import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { bookAppointment, clearSelection, resetBookingStatus } from "../appointmentSlice"
import { useNavigate, useLocation } from "react-router-dom"
import { Calendar, Clock, User, Phone, Mail, FileText, Heart, ArrowLeft, Check, X } from 'lucide-react'
import profile_picture from '../../../assets/portrait-smiling-charming-young-man-grey-t-shirt-standing-against-plain-background.jpg';

// Import the specific CSS file
import "../style/book-appointment.css"

const BookAppointment = ({ doctorId = 1 }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedSlot, bookingStatus, bookingError, doctor } = useSelector((state) => state.appointments)

  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    phone: "",
    medicalHistory: "",
    disease: "",
  })

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!selectedSlot) {
      navigate("/available-slots")
    }
  }, [selectedSlot, navigate])

  useEffect(() => {
    if (bookingStatus === "succeeded" || bookingStatus === "failed") {
      setShowConfirmation(true)
    }
  }, [bookingStatus])

  const query = new URLSearchParams(location.search)
  const appointmentDate = query.get("date")

  const validateForm = () => {
    const newErrors = {}

    if (!patientData.name.trim()) {
      newErrors.name = "Full name is required"
    }

    if (!patientData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(patientData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!patientData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{11}$/.test(patientData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPatientData({
      ...patientData,
      [name]: value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const appointment = {
      doctor_id: doctorId,
      patient_id: patientData.id || "guest",
      date: appointmentDate,
      time: selectedSlot.start_time,
      status: "pending",
      notes: patientData.medicalHistory,
      patient_data: patientData,
    }

    dispatch(bookAppointment(appointment))
  }

  const handleCancel = () => {
    dispatch(clearSelection())
    navigate("/available-slots")
  }

  const closeModal = () => {
    setShowConfirmation(false)
    if (bookingStatus === "succeeded") {
      dispatch(clearSelection())
      dispatch(resetBookingStatus())
      navigate("/available-slots")
    }
  }

  if (!selectedSlot) return null

  return (
    <div className="book-appointment-container">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <button onClick={handleCancel} className="back-button">
            <ArrowLeft className="w-5 h-5" />
            Back to Available Slots
          </button>
        <div className="max-w-4xl !m-auto">
        

          <div className="booking-header">
            <h1 className="booking-title">Complete Your Booking</h1>
            <p className="booking-subtitle">Please fill in your details to confirm the appointment</p>
          </div>

          <div>
            {/* Appointment Summary */}
            <div className=" !mb-5">
              <div className="appointment-summary">
                <h3 className="summary-header">Appointment Summary</h3>

                {doctor && (
                    <div className="doctor-summary">
                    <div className="flex">
                        <div className="doctor-avatar">
                            {doctor.profile_picture ? (
                            <img 
                                src={profile_picture} 
                                alt={doctor.username}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            ) : (
                            <User className="w-8 h-8 text-white" />
                            )}
                        </div>
                        <div className="doctors-info">
                            <h2 className="text-lg font-semibold">Dr. {doctor.username}</h2>
                            <p className="text-blue-600">{doctor.specialty}</p>
                            <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{doctor.years_of_experience} years experience</span>
                            </div>
                        </div>
                    </div>
                    </div>
                )}

                <div className="appointment-details">
                  <div className="detail-item">
                    <Calendar className="w-5 h-5 detail-icon" />
                    <div className="detail-content">
                      <p className="label">Date</p>
                      <p className="value">{appointmentDate}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <Clock className="w-5 h-5 detail-icon" />
                    <div className="detail-content">
                      <p className="label">Time</p>
                      <p className="value">
                        {selectedSlot.start_time.slice(0, 5)} - {selectedSlot.end_time.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="!mb-5">
              <div className="booking-form-card">
                <form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="form-section">
                    <h4 className="section-title">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h4>

                    <div className="form-grid">
                      <div className="form-field">
                        <label htmlFor="name" className="form-label">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={patientData.name}
                          onChange={handleInputChange}
                          className={`form-input ${errors.name ? "error" : ""}`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="error-message">{errors.name}</p>}
                      </div>

                      <div className="form-field">
                        <label htmlFor="phone" className="form-label">
                          Phone Number *
                        </label>
                        <div className="input-with-icon">
                          <Phone className="input-icon" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={patientData.phone}
                            onChange={handleInputChange}
                            className={`form-input ${errors.phone ? "error" : ""}`}
                            placeholder="01000000000"
                          />
                        </div>
                        {errors.phone && <p className="error-message">{errors.phone}</p>}
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="email" className="form-label">
                        Email Address *
                      </label>
                      <div className="input-with-icon">
                        <Mail className="input-icon" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={patientData.email}
                          onChange={handleInputChange}
                          className={`form-input ${errors.email ? "error" : ""}`}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="form-section">
                    <h4 className="section-title">
                      <Heart className="w-5 h-5" />
                      Medical Information
                    </h4>

                    <div className="form-field">
                      <label htmlFor="disease" className="form-label">
                        Current Condition
                      </label>
                      <input
                        type="text"
                        id="disease"
                        name="disease"
                        value={patientData.disease}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Describe your current condition"
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="medicalHistory" className="form-label">
                        Medical History & Additional Notes
                      </label>
                      <div className="input-with-icon">
                        <FileText className="input-icon" />
                        <textarea
                          id="medicalHistory"
                          name="medicalHistory"
                          rows={4}
                          value={patientData.medicalHistory}
                          onChange={handleInputChange}
                          className="form-textarea"
                          placeholder="Please provide any relevant medical history, allergies, current medications, or additional information..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="form-actions">
                    <button type="button" onClick={handleCancel} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingStatus === "loading"}
                      className="btn btn-primary"
                    >
                      {bookingStatus === "loading" ? (
                        <>
                          <div className="loading-spinner-btn"></div>
                          Booking...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="modal-overlay">
            <div className="modal-content">
              {bookingStatus === "succeeded" ? (
                <div>
                  <div className="modal-icon success">
                    <Check className="w-8 h-8" />
                  </div>
                  <h2 className="modal-title success">Booking Confirmed!</h2>
                  <p className="modal-message">
                    Your appointment has been successfully booked. A confirmation email has been sent to your email
                    address.
                  </p>
                  <button onClick={closeModal} className="modal-button">
                    Done
                  </button>
                </div>
              ) : (
                <div>
                  <div className="modal-icon error">
                    <X className="w-8 h-8" />
                  </div>
                  <h2 className="modal-title error">Booking Failed</h2>
                  <p className="modal-message">
                    {bookingError || "An error occurred while booking your appointment. Please try again."}
                  </p>
                  <button onClick={closeModal} className="modal-button">
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookAppointment
