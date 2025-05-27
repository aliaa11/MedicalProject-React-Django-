import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

export default function AvailabilityPage() {
   const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    doctor_id: 1,
    day_of_week: "",
    start_time: "",
    end_time: "",
  });
  const [errors, setErrors] = useState({});
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:3001/availabilitySlots");
      setSlots(res.data);
    } catch (error) {
      toast.error("Failed to fetch slots");
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
      if (editingSlotId) {
        await axios.patch(`http://localhost:3001/availabilitySlots/${editingSlotId}`, formData);
        toast.success("Slot updated successfully");
      } else {
        await axios.post("http://localhost:3001/availabilitySlots", formData);
        toast.success("Slot added successfully");
      }
      setFormData({ doctor_id: 1, day_of_week: "", start_time: "", end_time: "" });
      setEditingSlotId(null);
      await fetchSlots();
      setErrors({});
    } catch (error) {
      toast.error("Error saving slot");
    }
  };

  const handleEdit = (slot) => {
    setEditingSlotId(slot.id);
    setFormData({
      doctor_id: slot.doctor_id,
      day_of_week: slot.day_of_week.toString(),
      start_time: slot.start_time,
      end_time: slot.end_time,
    });
  };

  const handleDelete = (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this slot?</p>
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button
            onClick={async () => {
              await axios.delete(`http://localhost:3001/availabilitySlots/${id}`);
              toast.dismiss();
              toast.success("Slot deleted successfully");
              fetchSlots();
            }}
            style={{
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
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
          {/* Day Select */}
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

          {/* Start Time */}
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

          {/* End Time */}
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
                setFormData({ doctor_id: 1, day_of_week: "", start_time: "", end_time: "" });
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
                  <span className="slot-day">{englishDays[slot.day_of_week]}</span>
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
