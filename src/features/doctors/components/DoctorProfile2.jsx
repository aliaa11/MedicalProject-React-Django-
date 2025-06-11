import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const navigate = useNavigate();

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedData = JSON.parse(userData);
        const token = parsedData.token;
        return {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        };
      }
    } catch (error) {
      console.error("Error getting auth headers:", error);
    }

    return {
      "Content-Type": "application/json",
    };
  };

  // Helper function to get user data from localStorage
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem("user");

      if (userData) {
        const parsedData = JSON.parse(userData);

        if (parsedData.token) {
          try {
            const payload = JSON.parse(atob(parsedData.token.split(".")[1]));
            return {
              id: payload.user_id,
              role: parsedData.role,
              token: parsedData.token,
              refreshToken: parsedData.refreshToken,
            };
          } catch (e) {
            console.error("Could not decode token:", e);
          }
        }

        return parsedData;
      }

      return null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  };

  // API base URL
  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    async function fetchData() {
      try {
        // Check authentication first
        const userData = localStorage.getItem("user");
        if (!userData) {
          throw new Error("No authentication data found. Please login again.");
        }

        const parsedUserData = JSON.parse(userData);
        if (!parsedUserData.token) {
          throw new Error("No authentication token found. Please login again.");
        }

        const headers = getAuthHeaders();
        const currentUser = getCurrentUser();
        console.log("Current user from localStorage:", currentUser);

        if (!currentUser || !currentUser.id) {
          throw new Error("Invalid user data. Please login again.");
        }

        if (currentUser.role !== "doctor") {
          toast.error("Only doctors can view this profile");
          navigate("/login");
          return;
        }

        // Fetch doctor profile
        const doctorResponse = await fetch(`${API_BASE_URL}/doctor/profile/`, {
          headers: headers,
        });

        if (!doctorResponse.ok) {
          if (doctorResponse.status === 401) {
            throw new Error("Authentication failed. Please login again.");
          } else if (doctorResponse.status === 404) {
            throw new Error(
              "Doctor profile not found. You may not have a doctor profile set up."
            );
          }
          throw new Error(
            `Failed to fetch doctor profile: ${doctorResponse.status} ${doctorResponse.statusText}`
          );
        }

        const doctorData = await doctorResponse.json();
        console.log("Doctor data:", doctorData);

        // Fetch appointments for the logged-in doctor
        try {
          const response = await axios.get(
            `${API_BASE_URL}/appointments/doctor-appointments/`,
            {
              headers: {
                Authorization: `Bearer ${parsedUserData.token}`,
              },
            }
          );
          console.log("Appointments endpoint response:", response.data);
          let appointmentsData = response.data || [];
          // Enrich with patientName if possible
          appointmentsData = appointmentsData.map((appointment) => {
            let patientName = "";
            if (appointment.patient_data?.name) {
              patientName = appointment.patient_data.name;
            } else if (appointment.patient && appointment.patient.user) {
              const user = appointment.patient.user;
              patientName =
                user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.username || user.email || "";
            } else if (appointment.patient_name) {
              patientName = appointment.patient_name;
            } else if (appointment.patient_id && usersData.length > 0) {
              const patientUser = usersData.find(
                (u) => u.id === appointment.patient_id
              );
              if (patientUser) {
                patientName =
                  patientUser.first_name && patientUser.last_name
                    ? `${patientUser.first_name} ${patientUser.last_name}`
                    : patientUser.username || patientUser.email || "";
              }
            }
            return { ...appointment, patientName };
          });
          setAppointments(appointmentsData);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          toast.error(
            error.response?.data?.detail || "Failed to fetch appointments"
          );
          setAppointments([]);
        }

        // Try different endpoints for users
        let usersData = [];
        const userEndpoints = [
          `${API_BASE_URL}/users/`,
          `${API_BASE_URL}/auth/users/`,
          `${API_BASE_URL}/accounts/users/`,
        ];

        for (const endpoint of userEndpoints) {
          try {
            const usersResponse = await fetch(endpoint, { headers });
            if (usersResponse.ok) {
              usersData = await usersResponse.json();
              if (!Array.isArray(usersData)) usersData = [];
              console.log("Successfully fetched users from:", endpoint);
              break;
            }
          } catch (e) {
            console.warn(`Could not fetch users from ${endpoint}:`, e);
          }
        }

        // Fetch specialties
        const specialtiesResponse = await fetch(`${API_BASE_URL}/specialties/`);
        let specialtiesData = [];
        let doctorSpecialty = null;

        if (specialtiesResponse.ok) {
          specialtiesData = await specialtiesResponse.json();
          doctorSpecialty =
            specialtiesData.find((s) => s.name === doctorData.specialty) || {
              name: doctorData.specialty || "General Practice",
            };
        } else {
          console.warn("Could not fetch specialties");
          doctorSpecialty = {
            name: doctorData.specialty || "General Practice",
          };
        }

        // Try different endpoints for patients
        let patientsData = [];
        const patientEndpoints = [
          `${API_BASE_URL}/patients/`,
          `${API_BASE_URL}/patient/`,
          `${API_BASE_URL}/doctor/${doctorData.id}/patients/`,
        ];

        for (const endpoint of patientEndpoints) {
          try {
            const resPatients = await fetch(endpoint, { headers });
            if (resPatients.ok) {
              patientsData = await resPatients.json();
              if (!Array.isArray(patientsData)) patientsData = [];
              console.log("Successfully fetched patients from:", endpoint);
              break;
            }
          } catch (e) {
            console.warn(`Could not fetch patients from ${endpoint}:`, e);
          }
        }

        // Fetch availability slots
        let availabilityData = [];
        const availabilityEndpoint = `${API_BASE_URL}/availability/public/doctor/${doctorData.id}/slots/`;
        try {
          const resAvailability = await fetch(availabilityEndpoint, { headers });
          if (resAvailability.ok) {
            availabilityData = await resAvailability.json();
            console.log("Availability endpoint response:", availabilityData);
            if (!Array.isArray(availabilityData)) {
              console.warn(
                "Availability data is not an array, falling back to doctorData.slots"
              );
              availabilityData = doctorData.slots || [];
            }
          } else {
            console.warn(
              `Failed to fetch availability from ${availabilityEndpoint}:`,
              resAvailability.status,
              resAvailability.statusText,
            );
            availabilityData = doctorData.slots || [];
          }
        } catch (e) {
          console.error(
            `Error fetching availability from ${availabilityEndpoint}:`,
            e,
          );
          availabilityData = doctorData.slots || [];
        }
        console.log("Final availability data:", availabilityData);
        console.log("Doctor data slots:", doctorData.slots);

        // Get doctor's user info
        let doctorUser = doctorData.user;
        if (!doctorUser && doctorData.user_id) {
          doctorUser = usersData.find((u) => u.id === doctorData.user_id);
        }
        if (!doctorUser) {
          doctorUser = currentUser;
        }

        // Set all data
        setDoctor(doctorData);
        setUser(doctorUser);
        setSpecialty(doctorSpecialty);
        setPatients(patientsData);
        setUsers(usersData);
        setAvailabilitySlots(availabilityData);
        setLoading(false);

        // Set form data with proper names
        const doctorName =
          doctorUser?.first_name && doctorUser?.last_name
            ? `${doctorUser.first_name} ${doctorUser.last_name}`
            : doctorUser?.username || doctorUser?.email || "Doctor";

        setFormData({
          name: doctorName,
          email: doctorUser?.email || doctorData.contact_email || "",
          phone: doctorData.phone || "",
          specialtyName: doctorSpecialty?.name || doctorData.specialty || "",
          bio: doctorData.bio || "",
        });
      } catch (error) {
        console.error("Failed to load data", error);
        setError(error.message);
        setLoading(false);
        toast.error(error.message);
      }
    }

    fetchData();
  }, [navigate]);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    try {
      if (!timeStr) return "Not Available";
      const [h, m] = timeStr.split(":");
      const hour = parseInt(h, 10);
      const suffix = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${m} ${suffix}`;
    } catch (error) {
      return timeStr;
    }
  };

  const getPatientName = (patientId, appointment = null) => {
    if (appointment && appointment.patientName) {
      return appointment.patientName;
    }

    if (!patientId) {
      return "";
    }

    // Try to find patient in patients array
    const patient = patients.find((p) => String(p.id) === String(patientId));
    if (patient) {
      if (patient.user) {
        return patient.user.first_name && patient.user.last_name
          ? `${patient.user.first_name} ${patient.user.last_name}`
          : patient.user.username || patient.user.email || "";
      } else if (patient.name) {
        return patient.name;
      } else if (patient.first_name || patient.last_name) {
        return `${patient.first_name || ""} ${patient.last_name || ""}`.trim();
      }
    }

    // Try to find patient in users array
    const patientUser = users.find((u) => String(u.id) === String(patientId));
    if (patientUser) {
      return patientUser.first_name && patientUser.last_name
        ? `${patientUser.first_name} ${patientUser.last_name}`
        : patientUser.username || patientUser.email || "";
    }

    return "";
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        phone: formData.phone,
        bio: formData.bio,
      };

      const response = await fetch(`${API_BASE_URL}/doctor/profile/`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update profile: ${response.status} ${response.statusText}`
        );
      }

      const updatedDoctor = await response.json();

      setDoctor((prev) => ({ ...prev, ...updatedDoctor }));
      setEditOpen(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(`Failed to update profile: ${error.message}`);
    }
  };

  const handleContactDoctor = () => {
    console.log("Contact doctor functionality");
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  const handleLogin = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const safeAvailabilitySlots = Array.isArray(availabilitySlots)
    ? availabilitySlots
    : [];

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const formatTimeRange = (start, end) => {
    if (!start || !end) return "Closed";
    return `${start.slice(0, 5)} - ${end.slice(0, 5)}`;
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
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button onClick={handleRetry} className="error-button">
              Try Again
            </button>
            {error.includes("Authentication") || error.includes("login") ? (
              <button onClick={handleLogin} className="error-button">
                Login Again
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-profile-container">
        <div className="error-container">
          <User className="error-icon" />
          <h2 className="error-title">Doctor Profile Not Found</h2>
          <p className="error-message">
            No doctor profile found for your account.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="error-button"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const userName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.username || user?.first_name || "Doctor";

  const userEmail = user?.email || doctor?.contact_email || "Not Available";

  return (
    <div className="doctor-profile-container">
      <div className="profile-doctor-header">
        <div className="doctor-header-content">
          <div className="doctor-avatar-container">
            <div className="doctor-avatar">
              <img src={doctorImage} alt={userName} />
            </div>
            <div className="doctor-status-badge"></div>
          </div>

          <div className="doctor-profile-info">
            <h1 className="doctor-name">Dr. {userName}</h1>
            <div className="doctor-specialty">
              <Stethoscope className="w-5 h-5 inline mr-2" />
              {specialty?.name || "General Practice"}
            </div>
            <div className="doctor-experience">
              <Calendar className="w-4 h-4" />
              <span>{doctor.years_of_experience || 0} years of experience</span>
            </div>
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-number">{appointments.length}</div>
                <div className="stat-label">Appointments</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {new Set(appointments.map((a) => a.patient_id)).size}
                </div>
                <div className="stat-label">Patients</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{safeAvailabilitySlots.length}</div>
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
              <span>About Dr. {userName}</span>
            </h2>
            <div className="biography-text">
              {doctor.bio ||
                `Dr. ${userName} is an experienced ${
                  specialty?.name || "medical"
                } specialist with ${
                  doctor.years_of_experience || 0
                } years of experience. Known for providing comprehensive and compassionate care to patients.`}
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
                <span className="info-value">
                  {specialty?.name || "General Practice"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Experience</span>
                <span className="info-value">
                  {doctor.years_of_experience || 0} years
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Gender</span>
                <span className="info-value capitalize">
                  {doctor.gender || "Not Specified"}
                </span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h2 className="card-title">
              <Calendar className="w-5 h-5" />
              <span>Availability Slots</span>
            </h2>
            {safeAvailabilitySlots.length === 0 ? (
              <p className="text-gray-500">No availability slots found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 font-semibold border-b">Day</th>
                      <th className="p-3 font-semibold border-b">Start Time</th>
                      <th className="p-3 font-semibold border-b">End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeAvailabilitySlots.map((slot, idx) => {
                      const dayIndex = parseInt(slot.day, 10);
                      const dayName = !isNaN(dayIndex) && dayIndex >= 0 && dayIndex < daysOfWeek.length
                        ? daysOfWeek[dayIndex]
                        : "Unknown";
                      return (
                        <tr
                          key={slot.id || idx}
                          className="hover:bg-gray-50 border-b border-gray-200"
                        >
                          <td className="p-3">{dayName}</td>
                          <td className="p-3">
                            {slot.start_time ? slot.start_time.slice(0, 5) : "--:--"}
                          </td>
                          <td className="p-3">
                            {slot.end_time ? slot.end_time.slice(0, 5) : "--:--"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
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
                      <td
                        colSpan="4"
                        className="text-center p-4 text-gray-500"
                      >
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr
                        key={appt.id}
                        className="hover:bg-gray-50 border-b border-gray-200"
                      >
                        <td className="p-3">{formatDate(appt.date)}</td>
                        <td className="p-3">{formatTime(appt.time)}</td>
                        <td className="p-3">
                          {appt.patientName || getPatientName(appt.patient_id, appt)}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              appt.status
                            )}`}
                          >
                            {appt.status.charAt(0).toUpperCase() +
                              appt.status.slice(1)}
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
                  <p className="contact-value">
                    {doctor.phone || "Not Available"}
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="contact-details">
                  <p className="contact-label">Email</p>
                  <p className="contact-value">{userEmail}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={() => setEditOpen(true)}
              className="bookbtn"
            >
              <Edit3 className="w-5 h-5" />
              Edit Profile
            </button>

            <button
              onClick={handleContactDoctor}
              className="btn-secondary"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Doctor
            </button>
          </div>
        </div>
      </div>

      {editOpen && (
        <div className="edit-modal-overlay" aria-modal="true" role="dialog" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(30,40,60,0.18)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)',
          transition: 'background 0.3s',
        }}>
          <div className="edit-modal-content" style={{
            background: 'rgba(255,255,255,0.98)',
            border: '2px solid #4f8cff',
            borderRadius: '24px',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 12px 48px 0 rgba(60, 72, 88, 0.22)',
            padding: '2.5rem 2rem 2rem 2rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'center',
            minHeight: 'auto',
            overflow: 'visible',
            fontFamily: 'inherit',
          }}>
            <button
              className="edit-modal-close-btn"
              onClick={() => setEditOpen(false)}
              aria-label="Close Edit Modal"
              style={{
                position: 'absolute',
                top: -18,
                right: -18,
                background: '#fff',
                border: '2px solid #e0e7ef',
                borderRadius: '50%',
                width: 40,
                height: 40,
                boxShadow: '0 2px 8px 0 rgba(60, 72, 88, 0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(60, 72, 88, 0.18)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(60, 72, 88, 0.10)'}
            >
              <X size={24} color="#4f8cff" />
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-primary-600" style={{ textAlign: 'center', letterSpacing: '0.5px', color: '#2563eb' }}>
              Edit Profile
            </h2>
            <div className="space-y-4">
              {["name", "email", "phone", "specialtyName", "bio"].map(
                (field, idx) => (
                  <div key={idx} style={{ marginBottom: 18 }}>
                    <label
                      className="block mb-1 font-medium text-gray-700"
                      htmlFor={field}
                      style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#334155' }}
                    >
                      {field === "specialtyName"
                        ? "Specialty"
                        : field === "name"
                        ? "Name"
                        : field === "email"
                        ? "Email"
                        : field === "phone"
                        ? "Phone"
                        : field === "bio"
                        ? "Biography"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {field === "bio" ? (
                      <textarea
                        id={field}
                        name={field}
                        rows="4"
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                        style={{ background: '#f3f6fa', fontSize: '1rem', color: '#334155', minHeight: 80 }}
                      />
                    ) : (
                      <input
                        id={field}
                        name={field}
                        type={
                          field === "email"
                            ? "email"
                            : field === "phone"
                            ? "tel"
                            : "text"
                        }
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        style={{ background: '#f3f6fa', fontSize: '1rem', color: '#334155' }}
                        disabled={
                          field === "name" ||
                          field === "email" ||
                          field === "specialtyName"
                        }
                      />
                    )}
                  </div>
                )
              )}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  style={{ minWidth: 100, fontWeight: 500, letterSpacing: '0.5px', background: '#f8fafc' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 border border-primary-500 rounded-lg text-white hover:bg-primary-600 transition"
                  style={{ minWidth: 100, fontWeight: 500, letterSpacing: '0.5px', background: '#4f8cff', borderColor: '#4f8cff', boxShadow: '0 2px 8px 0 rgba(60, 72, 88, 0.08)' }}
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