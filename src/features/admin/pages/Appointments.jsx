import { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiClock, FiUser, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { 
  fetchAppointments, 
  updateAppointmentStatus, 
  deleteAppointment,
  updateAppointment,
  fetchDoctors,
  fetchPatients,
  fetchUsers
} from '../services/api';
import Table from '../components/Table';
import '../styles/tables.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    time: '',
    doctor_id: '',
    patient_id: '',
    status: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apptsData, docsData, patsData, usersData] = await Promise.all([
          fetchAppointments(),
          fetchDoctors(),
          fetchPatients(),
          fetchUsers()
        ]);
        
        setAppointments(apptsData);
        setDoctors(docsData);
        setPatients(patsData);
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(appointments.map(appt => 
        appt.id === appointmentId ? { ...appt, status: newStatus } : appt
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
      setAppointments(appointments.filter(appt => appt.id !== appointmentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (appointment) => {
    setEditingAppointment(appointment.id);
    setEditFormData({
      date: appointment.date || '',
      time: appointment.time || '',
      doctor_id: appointment.doctor_id || '',
      patient_id: appointment.patient_id || '',
      status: appointment.status || 'pending'
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
  };

  const handleSaveEdit = async (appointmentId) => {
    try {
      await updateAppointment(appointmentId, editFormData);
      setAppointments(appointments.map(appt => 
        appt.id === appointmentId ? { ...appt, ...editFormData } : appt
      ));
      setEditingAppointment(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredAppointments = appointments.filter(appt => {
    const doctor = doctors.find(d => d.id.toString() === appt.doctor_id?.toString());
    const patient = patients.find(p => p.id.toString() === appt.patient_id?.toString());
    const patientUser = patient ? users.find(u => u.id.toString() === patient.user_id?.toString()) : null;
    const doctorUser = doctor ? users.find(u => u.id.toString() === doctor.user_id?.toString()) : null;
    
    const matchesSearch = 
      (doctorUser && doctorUser.username && doctorUser.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patientUser && patientUser.username && patientUser.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === 'all' || appt.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="text-center py-8">Loading appointments...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments Management</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search appointments..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="search-icon" />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Table>
        <thead>
          <tr>
            <th className="table-header-cell">Appointment</th>
            <th className="table-header-cell">Doctor</th>
            <th className="table-header-cell">Patient</th>
            <th className="table-header-cell">Status</th>
            <th className="table-header-cell text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appt) => {
            const doctor = doctors.find(d => d.id.toString() === appt.doctor_id?.toString());
            const patient = patients.find(p => p.id.toString() === appt.patient_id?.toString());
            const patientUser = patient ? users.find(u => u.id.toString() === patient.user_id?.toString()) : null;
            const doctorUser = doctor ? users.find(u => u.id.toString() === doctor.user_id?.toString()) : null;
            
            return (
              <tr key={appt.id} className="table-row">
                <td className="table-cell">
                  <div className="avatar-cell">
                    <div className="avatar avatar-blue">
                      <FiCalendar size={18} />
                    </div>
                    <div className="cell-content">
                      {editingAppointment === appt.id ? (
                        <>
                          <input
                            type="date"
                            name="date"
                            value={editFormData.date}
                            onChange={handleEditFormChange}
                            className="edit-input mb-1"
                          />
                          <input
                            type="time"
                            name="time"
                            value={editFormData.time}
                            onChange={handleEditFormChange}
                            className="edit-input"
                          />
                        </>
                      ) : (
                        <>
                          <div className="text-sm font-medium text-gray-900">
                            {appt.date ? new Date(appt.date).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiClock className="mr-1" size={14} />
                            {appt.time ? appt.time.substring(0, 5) : 'N/A'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  {editingAppointment === appt.id ? (
                    <select
                      name="doctor_id"
                      value={editFormData.doctor_id}
                      onChange={handleEditFormChange}
                      className="edit-input"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(d => {
                        const docUser = users.find(u => u.id.toString() === d.user_id?.toString());
                        return (
                          <option key={d.id} value={d.id}>
                            {docUser?.username || `Doctor ${d.id}`}
                          </option>
                        );
                      })}
                    </select>
                  ) : doctorUser ? (
                    <div className="avatar-cell">
                      <div className="avatar avatar-purple">
                        <FiUser size={14} />
                      </div>
                      <div className="cell-content">
                        <div className="text-sm font-medium text-gray-900">
                          {doctorUser.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {doctor?.bio || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ) : 'N/A'}
                </td>
                <td className="table-cell">
                  {editingAppointment === appt.id ? (
                    <select
                      name="patient_id"
                      value={editFormData.patient_id}
                      onChange={handleEditFormChange}
                      className="edit-input"
                    >
                      <option value="">Select Patient</option>
                      {patients.map(p => {
                        const patUser = users.find(u => u.id.toString() === p.user_id?.toString());
                        return (
                          <option key={p.id} value={p.id}>
                            {patUser?.username || `Patient ${p.id}`}
                          </option>
                        );
                      })}
                    </select>
                  ) : patientUser ? (
                    <div className="avatar-cell">
                      <div className="avatar avatar-green">
                        <FiUser size={14} />
                      </div>
                      <div className="cell-content">
                        <div className="text-sm font-medium text-gray-900">{patientUser.username}</div>
                        <div className="text-xs text-gray-500">{patient?.disease || 'N/A'}</div>
                      </div>
                    </div>
                  ) : 'N/A'}
                </td>
                <td className="table-cell">
                  {editingAppointment === appt.id ? (
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditFormChange}
                      className={`status-badge ${
                        editFormData.status === 'pending' ? 'status-pending' :
                        editFormData.status === 'confirmed' ? 'status-confirmed' :
                        editFormData.status === 'completed' ? 'status-completed' :
                        editFormData.status === 'rejected' ? 'status-cancelled' :
                        'status-cancelled'
                      } border-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  ) : (
                    <select
                      value={appt.status || 'pending'}
                      onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      className={`status-badge ${
                        appt.status === 'pending' ? 'status-pending' :
                        appt.status === 'confirmed' ? 'status-confirmed' :
                        appt.status === 'completed' ? 'status-completed' :
                        appt.status === 'rejected' ? 'status-cancelled' :
                        'status-cancelled'
                      } border-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  )}
                </td>
                <td className="table-cell text-right">
                  <div className="actions-cell">
                    {editingAppointment === appt.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(appt.id)}
                          className="action-btn approve-btn"
                          title="Save"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="action-btn delete-btn"
                          title="Cancel"
                        >
                          <FiX size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(appt)}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(appt.id)}
                          className="action-btn delete-btn"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Appointments;