import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAvailabilitySlots, selectSlot, fetchDoctorProfile, fetchBookedAppointments } from "../appointmentSlice"
import { format, addDays, isToday, isAfter, startOfWeek, parse, addMinutes, isSameDay } from "date-fns"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Calendar, Clock, User, Stethoscope, ChevronLeft, ChevronRight } from 'lucide-react'
import profile_picture from '../../../assets/portrait-smiling-charming-young-man-grey-t-shirt-standing-against-plain-background.jpg';

import "../style/available-slots.css"

const AvailableSlots = ({ doctorId: propDoctorId }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Get doctorId from props, URL params, or default to 1
  const doctorId = propDoctorId || searchParams.get('doctorId') || '1'
  
  const { availabilitySlots, slotsLoading, slotsError, doctor, bookedAppointments } = useSelector((state) => state.appointments)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchAvailabilitySlots(doctorId))
      dispatch(fetchDoctorProfile(doctorId))
      dispatch(fetchBookedAppointments(doctorId))
    }
  }, [dispatch, doctorId])

  const generateTimeSlots = (startTime, endTime) => {
    const slots = []
    let currentTime = parse(startTime, "HH:mm", new Date())
    const end = parse(endTime, "HH:mm", new Date())

    while (currentTime < end) {
      const slotStart = format(currentTime, "HH:mm")
      const slotEnd = format(addMinutes(currentTime, 30), "HH:mm")
      slots.push({ start_time: slotStart, end_time: slotEnd })
      currentTime = addMinutes(currentTime, 30)
    }
    return slots
  }

  const getAvailableSlots = () => {
    // Return empty array if availabilitySlots is not loaded yet
    if (!availabilitySlots || !Array.isArray(availabilitySlots)) {
      return []
    }

    const dayOfWeek = selectedDate.getDay()
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
    
    // Filter slots for the selected day of week
    const daySlots = availabilitySlots.filter((slot) => 
      parseInt(slot.day_of_week) === dayOfWeek
    )

    let availableSlots = []
    daySlots.forEach((slot) => {
      const timeSlots = generateTimeSlots(slot.start_time, slot.end_time)
      availableSlots = [...availableSlots, ...timeSlots]
    })

    // Get booked slots from database instead of static data
    const bookedSlots = bookedAppointments ? bookedAppointments.map(appointment => ({
      date: appointment.date,
      time: appointment.time
    })) : []

    return availableSlots.filter(
      (slot) => !bookedSlots.some((booked) => 
        booked.date === selectedDateStr && booked.time === slot.start_time
      ),
    )
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  const handleSlotSelect = (slot) => {
    const slotData = {
      ...slot,
      date: format(selectedDate, "yyyy-MM-dd"),
      doctorId: doctorId
    }
    dispatch(selectSlot(slotData))
    navigate(`/book-appointment?date=${format(selectedDate, "yyyy-MM-dd")}&doctorId=${doctorId}&time=${slot.start_time}`)
  }

  const navigateWeek = (direction) => {
    const newWeekStart = addDays(currentWeekStart, direction * 7)
    setCurrentWeekStart(newWeekStart)
    setSelectedDate(newWeekStart)
  }

  // Generate dates for the current week
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))
  const isPastDate = isAfter(new Date(), selectedDate) && !isToday(selectedDate)
  const availableSlots = getAvailableSlots()

  return (
    <div className="available-slots-container">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="doctor-page-header">
          <h1 className="doctor-page-title">Book Your Appointment</h1>
          <p className="page-subtitle">Choose your preferred date and time slot</p>
        </div>

        {/* Doctor Info Card */}
        {doctor && (
          <div className="doctor-card">
            <div className="flex">
              <div className="doctor-avatar">
                {doctor.profile_picture ? (
                  <img 
                    src={profile_picture} 
                    alt={doctor.name || doctor.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="doctors-info">
                <h2 className="text-lg font-semibold">{doctor.name || doctor.username}</h2>
                <p className="text-blue-600">{doctor.specialty}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{doctor.years_of_experience} years experience</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Date Selection */}
            <div className="lg:col-span-1">
              <div className="date-selection-card">
                <div className="section-header">
                  <Calendar className="w-5 h-5" />
                  <span>Select Date</span>
                </div>

                {/* Week Navigation */}
                <div className="week-navigation">
                  <button onClick={() => navigateWeek(-1)} className="nav-button" aria-label="Previous week">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="week-label">{format(currentWeekStart, "MMM yyyy")}</span>
                  <button onClick={() => navigateWeek(1)} className="nav-button" aria-label="Next week">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Date Grid */}
                <div className="space-y-2">
                  {weekDates.map((date) => {
                    const isSelected = isSameDay(date, selectedDate)
                    const isPast = isAfter(new Date(), date) && !isToday(date)

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleDateChange(date)}
                        disabled={isPast}
                        className={`date-button ${isSelected ? "selected" : ""} ${isPast ? "past" : ""}`}
                      >
                        <div className="date-info">
                          <div className="date-text">
                            <div className="day-name">{format(date, "EEEE")}</div>
                            <div className="date-number">{format(date, "MMM d")}</div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="lg:col-span-2">
              <div className="time-slots-card">
                <div className="slots-header">
                  <h3 className="section-header">
                    <Clock className="w-5 h-5" />
                    <span>Available Times</span>
                  </h3>
                  <div className="selected-date-info">{format(selectedDate, "EEEE, MMMM do yyyy")}</div>
                </div>

                {slotsLoading && (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading available slots...</p>
                  </div>
                )}

                {slotsError && (
                  <div className="error-container">
                    <p>Error: {slotsError}</p>
                  </div>
                )}

                {isPastDate && (
                  <div className="warning-container">
                    <p>Cannot book appointments for past dates</p>
                  </div>
                )}

                {!slotsLoading && !slotsError && !isPastDate && (
                  <>
                    {availableSlots.length > 0 ? (
                      <div className="time-slots-grid">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={`${slot.start_time}-${index}`}
                            onClick={() => handleSlotSelect(slot)}
                            className="time-slot-button"
                          >
                            <div className="slot-time">{slot.start_time.slice(0, 5)}</div>
                            <div className="slot-duration">{slot.end_time.slice(0, 5)}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <Clock className="w-12 h-12" />
                        <h3>No available slots for this day</h3>
                        <p>Please select another date</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvailableSlots