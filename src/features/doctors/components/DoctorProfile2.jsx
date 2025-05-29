import React, { useState, useEffect } from "react";
import doctorImage from "../../../assets/doctor.jpg";
import {
  Mail,
  Phone,
  Calendar,
  Stethoscope,
  X,
  Edit3,
  User,
  AlertCircle,
  Clock,
  MessageCircle,
} from "lucide-react";
import "../../patients/style/doctor-profile.css";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [user, setUser] = useState(null);
  const [specialty, setSpecialty] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]); 
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialtyName: "",
    bio: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const resDoctors = await fetch("http://localhost:3001/doctors");
        const doctorsData = await resDoctors.json();
        const doctor = doctorsData[0];
        if (!doctor) throw new Error("Doctor not found");

        const resUsers = await fetch("http://localhost:3001/users");
        const usersData = await resUsers.json();
        const user = usersData.find(u => String(u.id) === String(doctor.user_id));

        const resSpecialties = await fetch("http://localhost:3001/specialties");
        const specialtiesData = await resSpecialties.json();
        const specialty = specialtiesData.find(s => String(s.id) === String(doctor.specialty_id));

        const resAppointments = await fetch("http://localhost:3001/appointments");
        const allAppointments = await resAppointments.json();
        const doctorAppointments = allAppointments.filter(appt => String(appt.doctor_id) === String(doctor.id));

        const resPatients = await fetch("http://localhost:3001/patients");
        const patientsData = await resPatients.json();

        const resAvailability = await fetch("http://localhost:3001/availabilitySlots");
        const availabilityData = await resAvailability.json();
        const doctorAvailability = availabilityData.filter(slot => String(slot.doctor_id) === String(doctor.id));

        setDoctor(doctor);
        setUser(user);
        setSpecialty(specialty);
        setAppointments(doctorAppointments);
        setPatients(patientsData);
        setUsers(usersData); 
        setAvailabilitySlots(doctorAvailability);
        setLoading(false);

        setFormData({
          name: user?.username || "",
          email: user?.email || "",
          phone: doctor?.phone || "",
          specialtyName: specialty?.name || "",
          bio: doctor?.bio || "",
        });
      } catch (error) {
        console.error("Failed to load data", error);
        setError(error.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${suffix}`;
  };

  const getPatientName = (id) => {
    const patient = patients.find(p => String(p.id) === String(id));
    if (patient) {
      const patientUser = users.find(u => String(u.id) === String(patient.user_id));
      return patientUser ? patientUser.username : `Patient #${id}`;
    }
    return `Patient #${id}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser(prev => ({ ...prev, username: formData.name, email: formData.email }));
    setDoctor(prev => ({ ...prev, phone: formData.phone, bio: formData.bio }));
    setSpecialty(prev => ({ ...prev, name: formData.specialtyName }));
    setEditOpen(false);
  };

  const handleContactDoctor = () => {
    console.log("Contact doctor functionality");
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

  if (!doctor || !user || !specialty) {
    return (
      <div className="doctor-profile-container">
        <div className="error-container">
          <User className="error-icon" />
          <h2 className="error-title">Doctor Not Found</h2>
          <p className="error-message">The requested doctor profile could not be found.</p>
          <button onClick={() => window.location.href="/"} className="error-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const schedule = availabilitySlots.map(slot => ({
    day: daysOfWeek[slot.day_of_week],
    time: `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`,
    available: true,
  }));

  const allDays = daysOfWeek.map(day => {
    const slot = schedule.find(s => s.day === day);
    return slot || { day, time: "Closed", available: false };
  });

  return (
    <div className="doctor-profile-container">
      <div className="profile-doctor-header">
        <div className="doctor-header-content">
          <div className="doctor-avatar-container">
            <div className="doctor-avatar">
              <img src={doctorImage} alt={user.username} />
            </div>
            <div className="doctor-status-badge"></div>
          </div>

          <div className="doctor-profile-info">
            <h1 className="doctor-name">{user.username}</h1>
            <div className="doctor-specialty">
              <Stethoscope className="w-5 h-5 inline mr-2" />
              {specialty.name}
            </div>
            <div className="doctor-experience">
              <Calendar className="w-4 h-4" />
              <span>{doctor.years_of_experience} years experience</span>
            </div>
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-number">{appointments.length}</div>
                <div className="stat-label">Appointments</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{new Set(appointments.map(a => a.patient_id)).size}</div>
                <div className="stat-label">Patients</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{availabilitySlots.length}</div>
                <div className="stat-label">Availability Slots</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="space-y-6">
          <div className="info-card">
            <h2 className="card-title">
              <User className="w-5 h-5" />
              <span>About Dr. {user.username}</span>
            </h2>
            <div className="biography-text">
              {doctor.bio || `Dr. ${user.username} is a highly experienced ${specialty.name} specialist with ${doctor.years_of_experience} years of practice. Known for providing compassionate and comprehensive care to patients.`}
            </div>
          </div>

          <div className="info-card">
            <h2 className="card-title">
              <Stethoscope className="w-5 h-5" />
              <span>Professional Information</span>
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Specialty</span>
                <span className="info-value">{specialty.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Experience</span>
                <span className="info-value">{doctor.years_of_experience} years</span>
              </div>
              <div className="info-item">
                <span className="info-label">Gender</span>
                <span className="info-value capitalize">{doctor.gender || "Not specified"}</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h2 className="card-title">
              <Calendar className="w-5 h-5" />
              <span>Availability Schedule</span>
            </h2>
            <div className="schedule-grid">
              {allDays.map((schedule, index) => (
                <div key={index} className={`schedule-item ${!schedule.available ? "unavailable" : "available"}`}>
                  <span className="schedule-day">{schedule.day}</span>
                  <span className="schedule-time">{schedule.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-card">
            <h2 className="card-title">
              <Calendar className="w-5 h-5" />
              <span>Appointments</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 font-semibold border-b">Date</th>
                    <th className="p-3 font-semibold border-b">Time</th>
                    <th className="p-3 font-semibold border-b">Patient</th>
                    <th className="p-3 font-semibold border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-4 text-gray-500">No appointments found.</td>
                    </tr>
                  ) : (
                    appointments.map(appt => (
                      <tr key={appt.id} className="hover:bg-gray-50 border-b border-gray-100">
                        <td className="p-3">{formatDate(appt.date)}</td>
                        <td className="p-3">{formatTime(appt.time)}</td>
                        <td className="p-3">{getPatientName(appt.patient_id)}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            appt.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : appt.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
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
                  <p className="contact-value">{doctor.contact_email || user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={() => setEditOpen(true)} className="bookbtn">
              <Edit3 className="w-5 h-5" />
              Edit Profile
            </button>

            <button onClick={handleContactDoctor} className="btn-secondary">
              <MessageCircle className="w-5 h-5" />
              Contact Doctor
            </button>
          </div>
        </div>
      </div>

      {editOpen && (
        <div className="edit-modal-overlay" aria-modal="true" role="dialog">
          <div className="edit-modal-content">
            <button
              className="edit-modal-close-btn"
              onClick={() => setEditOpen(false)}
              aria-label="Close Edit Modal"
            >
              <X size={28} />
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-primary-600">Edit Profile</h2>
            <div className="space-y-4">
              {["name", "email", "phone", "specialtyName", "bio"].map((field, idx) => (
                <div key={idx}>
                  <label className="block mb-1 font-medium text-gray-700" htmlFor={field}>
                    {field === "specialtyName" ? "Specialty" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "bio" ? (
                    <textarea
                      id={field}
                      name={field}
                      rows="4"
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <input
                      id={field}
                      name={field}
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;