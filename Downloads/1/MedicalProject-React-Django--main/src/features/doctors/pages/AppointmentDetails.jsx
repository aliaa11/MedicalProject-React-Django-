import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import "../../../style/global.css";

export default function AppointmentDetails() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data: appointmentData } = await axios.get(`http://localhost:3001/appointments/${id}`);
        setAppointment(appointmentData);
        setStatus(appointmentData.status || "");
        setNotes(appointmentData.notes || "");

        const { data: patientData } = await axios.get(`http://localhost:3001/patients/${appointmentData.patient_id}`);
        const { data: userData } = await axios.get(`http://localhost:3001/users/${patientData.user_id}`);

        setPatientName(userData.username);
      } catch (error) {
        console.error("Error fetching appointment or patient data:", error);
        setErrorMessage("Failed to load appointment data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.patch(`http://localhost:3001/appointments/${id}`, {
        status,
        notes,
      });
      setSuccessMessage("Appointment updated successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating appointment:", error);
      setSuccessMessage("");
      setErrorMessage("Failed to update appointment.");
    }

    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 60000);
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!appointment) return <div className="loading">Unable to load appointment details</div>;

  return (
    <div className="appointment-container relative">
      <h1 className="appointment-header">Appointment Details</h1>

      {successMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 px-6 py-3 rounded shadow-lg transition-all z-50">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-800 px-6 py-3 rounded shadow-lg transition-all z-50">
          {errorMessage}
        </div>
      )}

      <div className="appointment-info">
        <div className="info-card">
          <h2 className="info-title">Patient Information</h2>
          <p><strong>Patient Name:</strong> {patientName}</p>
        </div>

        <div className="info-card">
          <h2 className="info-title">Appointment Information</h2>
          <p><strong>Date:</strong> {appointment.date}</p>
          <p><strong>Time:</strong> {appointment.time}</p>
        </div>
       </div>

      <div className="form-group">
        <label className="form-label">Appointment Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="form-select"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="form-textarea"
          placeholder="Add notes here..."
          rows={4}
        />
      </div>

      <button
        onClick={handleUpdate}
        className="submit-btn"
      >
        Update Appointment
      </button>
    </div>
  );
}
