import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../style/style.css";

export default function AvailabilityPage() {
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    day_of_week: "",
    start_time: "",
    end_time: "",
  });
  const [errors, setErrors] = useState({});
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    
    if (!userData || userData?.role !== "doctor") {
      toast.error("Only doctors can manage availability slots");
      navigate('/login');
      return;
    }
  
    fetchSlots(userData.token);
  }, [navigate]);

  const fetchSlots = async (token) => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:8000/api/availability/slots/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSlots(res.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate('/login');
      } else {
        toast.error("Failed to fetch slots");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.day_of_week) newErrors.day_of_week = "Day is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";
    else if (formData.end_time <= formData.start_time)
      newErrors.end_time = "End time must be after start time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || userData.role !== "doctor") {
        toast.error("Only doctors can manage availability slots");
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          'Content-Type': 'application/json'
        },
      };

      const payload = {
        day: parseInt(formData.day_of_week),
        start_time: formData.start_time,
        end_time: formData.end_time,
      };

      if (editingSlotId) {
        // For update, include the ID in the payload if your backend requires it
        const updatePayload = {
          ...payload,
          id: editingSlotId
        };
        
        await axios.put(
          `http://localhost:8000/api/availability/slots/${editingSlotId}/`,
          updatePayload,
          config
        );
        toast.success("Slot updated successfully");
      } else {
        await axios.post(
          "http://localhost:8000/api/availability/slots/",
          payload,
          config
        );
        toast.success("Slot added successfully");
      }

      setFormData({ day_of_week: "", start_time: "", end_time: "" });
      setEditingSlotId(null);
      fetchSlots(userData.token);
      setErrors({});
    } catch (error) {
      console.error("Error saving slot:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.day?.[0] || 
                            error.response?.data?.detail || 
                            "Error saving slot";
        toast.error(errorMessage);
      }
    }
  };

  const handleEdit = (slot) => {
    console.log("Editing slot:", slot); // Debug log
    
    setEditingSlotId(slot.id);
    
    // Handle both possible field names (day or day_of_week)
    const dayValue = slot.day !== undefined ? slot.day : slot.day_of_week;
    
    setFormData({
      day_of_week: dayValue?.toString() || "",
      start_time: slot.start_time || "",
      end_time: slot.end_time || "",
    });
  };

  const handleDelete = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this slot?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={async () => {
              toast.dismiss();
              try {
                const userData = JSON.parse(localStorage.getItem("user"));
                await axios.delete(`http://localhost:8000/api/availability/slots/${id}/`, {
                  headers: {
                    Authorization: `Bearer ${userData.token}`,
                  },
                });
                toast.success("Slot deleted successfully");
                fetchSlots(userData.token);
              } catch (error) {
                console.error("Error deleting slot:", error);
                toast.error(error.response?.data?.detail || "Error deleting slot");
              }
            }}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 15px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Yes, Delete
          </button>
          <button 
            onClick={() => toast.dismiss()}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '5px 15px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
      }
    );
  };
  const daysOfWeek = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
  ];

  const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="availability-container">
      <ToastContainer />
      <h1 className="availability-header">Manage Availability Slots</h1>

      <form onSubmit={handleSubmit} className="availability-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Day</label>
            <select
              name="day_of_week"
              value={formData.day_of_week}
              onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
              className={`form-select ${errors.day_of_week ? "border-red-500" : ""}`}
            >
              <option value="">Select Day</option>
              {daysOfWeek.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
            {errors.day_of_week && <p className="text-red-600 text-sm mt-1">{errors.day_of_week}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Start Time</label>
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className={`form-input ${errors.start_time ? "border-red-500" : ""}`}
            />
            {errors.start_time && <p className="text-red-600 text-sm mt-1">{errors.start_time}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">End Time</label>
            <input
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className={`form-input ${errors.end_time ? "border-red-500" : ""}`}
            />
            {errors.end_time && <p className="text-red-600 text-sm mt-1">{errors.end_time}</p>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingSlotId ? "Update Slot" : "Add Slot"}
          </button>
          {editingSlotId && (
            <button
              type="button"
              onClick={() => {
                setEditingSlotId(null);
                setFormData({ day_of_week: "", start_time: "", end_time: "" });
                setErrors({});
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="slots-section">
        <h2 className="slots-header">Current Availability Slots</h2>
        {slots.length === 0 ? (
          <p className="no-slots">No slots available</p>
        ) : (
          <ul className="slots-list">
            {slots.map((slot) => (
              <li key={slot.id} className="slot-card">
                <div className="slot-info">
                  <span className="slot-day">
                    {englishDays[slot.day || slot.day_of_week]}
                  </span>
                  <span className="slot-time">
                    From {slot.start_time} to {slot.end_time}
                  </span>
                </div>
                <div className="slot-actions">
                  <button onClick={() => handleEdit(slot)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(slot.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}