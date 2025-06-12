import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { 
  selectSlot, 
  fetchDoctorProfile, 
  fetchAvailableDays,
  fetchAvailableAppointmentsByDay
} from "../appointmentSlice";
import { format, addDays, isToday, isAfter, startOfWeek, parse, isSameDay } from "date-fns"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react'
import profile_picture from  '../../../assets/woman-doctor-wearing-lab-coat-with-stethoscope-isolated.jpg';
import "../style/available-slots.css"

const AvailableSlots = ({ doctorId: propDoctorId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = propDoctorId || searchParams.get('doctorId');

  const { 
    slotsLoading, 
    slotsError, 
    doctor,
    availableDays = [],
    availableAppointmentsByDay = {}
  } = useSelector((state) => state.appointments);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchDoctorProfile(doctorId));
      dispatch(fetchAvailableDays(doctorId));
    }
  }, [dispatch, doctorId]);

  useEffect(() => {
    if (doctorId && selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      dispatch(fetchAvailableAppointmentsByDay({ doctorId, date: formattedDate }));
    }
  }, [dispatch, doctorId, selectedDate]);

  const getAvailableSlots = () => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const slots = availableAppointmentsByDay[formattedDate] || [];
    return slots.map(slot => ({
      id: slot.id,
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_available: true
    }));
  };

  const handleDateChange = (date) => setSelectedDate(date);

  const handleSlotSelect = (slot) => {
    const slotData = {
      id: slot.id,
      start_time: slot.start_time,
      end_time: slot.end_time,
      date: format(selectedDate, "yyyy-MM-dd"),
      doctorId: doctorId
    };
    dispatch(selectSlot(slotData));
    navigate(`/book-appointment?date=${format(selectedDate, "yyyy-MM-dd")}&doctorId=${doctorId}&appointmentId=${slot.id}`);
  };

  const navigateWeek = (direction) => {
    const newWeekStart = addDays(currentWeekStart, direction * 7);
    setCurrentWeekStart(newWeekStart);
    setSelectedDate(newWeekStart);
  };
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const isPastDate = isAfter(new Date(), selectedDate) && !isToday(selectedDate);
  const availableSlots = getAvailableSlots();

  if (!doctorId) {
    return (
      <div className="error-container">
        <p>Error: Doctor ID is missing</p>
      </div>
    );
  }

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
                    const formattedDate = format(date, "yyyy-MM-dd");
                    const isSelected = isSameDay(date, selectedDate);
                    const isPast = isAfter(new Date(), date) && !isToday(date);
                    const isAvailable = Array.isArray(availableDays) && availableDays.includes(formattedDate);

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleDateChange(date)}
                        disabled={isPast || !isAvailable}
                        className={`date-button 
                          ${isSelected ? "selected" : ""} 
                          ${isPast ? "past" : ""} 
                          ${!isAvailable ? "unavailable" : ""}`}
                      >
                        <div className="date-info">
                          <div className="date-text">
                            <div className="day-name">{format(date, "EEEE")}</div>
                            <div className="date-number">{format(date, "MMM d")}</div>
                          </div>
                        </div>
                      </button>
                    );
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
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.id || `${slot.start_time}-${slot.end_time}`}
                            onClick={() => handleSlotSelect(slot)}
                            className="time-slot-button"
                            disabled={!slot.is_available}
                          >
                            <div className="slot-time">{format(parse(slot.start_time, "HH:mm", new Date()), "h:mm a")}</div>
                            <div className="slot-duration">{format(parse(slot.end_time, "HH:mm", new Date()), "h:mm a")}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <Clock className="w-12 h-12" />
                        <h3> No available slots for this day</h3>
                        <p> Please select another date</p>
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