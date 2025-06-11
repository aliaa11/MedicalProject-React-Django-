import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import "../../../style/global.css";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem("user"));
        
        if (!userData || !['doctor', 'admin'].includes(userData.role)) {
          toast.error("You don't have permission to view this appointment");
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/appointments/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );

        setAppointment(response.data);
        setStatus(response.data.status);
        setNotes(response.data.notes || "");
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        toast.error(error.response?.data?.detail || "Failed to load appointment details");
        navigate('/doctor/appointments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id, navigate]);

  const handleUpdate = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      
      await axios.patch(
        `http://localhost:8000/api/appointments/update-status/${id}/`,
        { status, notes },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success("Appointment updated successfully!");
      const response = await axios.get(
        `http://localhost:8000/api/appointments/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      setAppointment(response.data);
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error(error.response?.data?.detail || "Failed to update appointment");
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!appointment) return <div className="loading">Unable to load appointment details</div>;

  const isBooked =
    appointment.patient &&
    appointment.patient.user?.username &&
    appointment.patient.user?.email;

  return (
    <div className="appointment-container">
      <h1 className="appointment-header">Appointment Details</h1>

      <div className="appointment-info">
        <div className="info-card">
          <h2 className="info-title">Patient Information</h2>
          {appointment.patient ? (
            <>
              <p><strong>Name:</strong> 
                {appointment.patient.user?.username || 'Not Booked..'} 
                {appointment.patient.user?.last_name && ' ' + appointment.patient.user.last_name}
              </p>
              <p><strong>Email:</strong> {appointment.patient.user?.email || 'Not Booked..'}</p>
            </>
          ) : (
            <div className="not-booked-message">
              <p className="not-booked">Not Booked Yet</p>
              <p className="booking-status">This appointment slot is available</p>
            </div>
          )}
        </div>

        <div className="info-card">
          <h2 className="info-title">Appointment Information</h2>
          <p><strong>Date:</strong> {appointment.date}</p>
          <p><strong>Time:</strong> {appointment.time}</p>
          <p><strong>Status:</strong> 
            <span className={`status-badge ${appointment.status.toLowerCase()}`}>
              {appointment.status}
            </span>
          </p>
        </div>
      </div>

      {['doctor', 'admin'].includes(JSON.parse(localStorage.getItem("user"))?.role) && (
        <div className="form-section">
          <div className="form-group">
            <label className="form-label">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-select"
            >
              
              <option value="confirmed">Confirmed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Doctor Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
              placeholder="Add your notes here..."
              rows={4}
            />
          </div>

          {isBooked ? (
            <button onClick={handleUpdate} className="submit-btn">
              Update Appointment
            </button>
          ) : (
            <button className="submit-btn disabled" disabled>
              Cannot Update - Not Booked
            </button>
          )}
        </div>
      )}
    </div>
  );
}
