import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiX, FiSearch, FiUser } from 'react-icons/fi';
import { 
  fetchDoctors, 
  updateDoctorApproval, 
  deleteDoctor, 
  fetchUsers, 
  fetchSpecialties,
  updateUserApproval,
  updateDoctor
} from '../services/api';
import Table from '../components/Table';
import '../styles/tables.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editFormData, setEditFormData] = useState({
    bio: '',
    contact_email: '',
    phone: '',
    years_of_experience: '',
    specialty_id: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorsData, usersData, specialtiesData] = await Promise.all([
          fetchDoctors(),
          fetchUsers(),
          fetchSpecialties()
        ]);
        
        setDoctors(doctorsData);
        setUsers(usersData);
        setSpecialties(specialtiesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleApprove = async (doctorId, isApproved) => {
    try {
      await updateDoctorApproval(doctorId, { is_approved: { is_approved: isApproved } });
      
      const doctor = doctors.find(d => d.id === doctorId);
      if (doctor && doctor.user_id) {
        await updateUserApproval(doctor.user_id, isApproved);
      }
      
      setDoctors(doctors.map(d => 
        d.id === doctorId ? { ...d, is_approved: { is_approved: isApproved } } : d
      ));
      
      if (doctor && doctor.user_id) {
        setUsers(users.map(u => 
          u.id === doctor.user_id ? { ...u, is_approved: isApproved } : u
        ));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (doctorId) => {
    try {
      await deleteDoctor(doctorId);
      setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor.id);
    setEditFormData({
      bio: doctor.bio || '',
      contact_email: doctor.contact_email || '',
      phone: doctor.phone || '',
      years_of_experience: doctor.years_of_experience || '',
      specialty_id: doctor.specialty_id || ''
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleCancelClick = () => {
    setEditingDoctor(null);
  };

  const handleSaveClick = async (doctorId) => {
    try {
      await updateDoctor(doctorId, editFormData);
      setDoctors(doctors.map(doctor => 
        doctor.id === doctorId ? { ...doctor, ...editFormData } : doctor
      ));
      setEditingDoctor(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const user = users.find(u => u.id.toString() === doctor.user_id.toString());
    return (
      (doctor.bio && doctor.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user && user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (loading) return <div className="text-center py-8">Loading doctors...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctors Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search doctors..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="search-icon" />
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
            <th className="table-header-cell">Doctor</th>
            <th className="table-header-cell">Contact</th>
            <th className="table-header-cell">Specialty</th>
            <th className="table-header-cell">Experience</th>
            <th className="table-header-cell">Status</th>
            <th className="table-header-cell text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDoctors.map((doctor) => {
            const user = users.find(u => u.id.toString() === doctor.user_id.toString());
            const specialty = specialties.find(s => s.id.toString() === doctor.specialty_id?.toString());
            
            return (
              <tr key={doctor.id} className="table-row">
                <td className="table-cell">
                  <div className="avatar-cell">
                    <div className="avatar avatar-purple">
                      <FiUser size={18} />
                    </div>
                    <div className="cell-content">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.username || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">{doctor.gender || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  {editingDoctor === doctor.id ? (
                    <div className="space-y-2">
                      <input
                        type="email"
                        name="contact_email"
                        value={editFormData.contact_email}
                        onChange={handleEditFormChange}
                        className="edit-input"
                        placeholder="Email"
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditFormChange}
                        className="edit-input"
                        placeholder="Phone"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-gray-900">{doctor.contact_email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{doctor.phone || 'N/A'}</div>
                    </>
                  )}
                </td>
                <td className="table-cell">
                  {editingDoctor === doctor.id ? (
                    <select
                      name="specialty_id"
                      value={editFormData.specialty_id}
                      onChange={handleEditFormChange}
                      className="edit-input"
                    >
                      <option value="">Select Specialty</option>
                      {specialties.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {specialty?.name || 'N/A'}
                    </span>
                  )}
                </td>
                <td className="table-cell">
                  {editingDoctor === doctor.id ? (
                    <input
                      type="number"
                      name="years_of_experience"
                      value={editFormData.years_of_experience}
                      onChange={handleEditFormChange}
                      className="edit-input"
                      placeholder="Years of experience"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">
                      {doctor.years_of_experience ? `${doctor.years_of_experience} years` : 'N/A'}
                    </span>
                  )}
                </td>
                <td className="table-cell">
                  <span className={`status-badge ${
                    doctor.is_approved?.is_approved ? 'status-approved' : 'status-pending-approval'
                  }`}>
                    {doctor.is_approved?.is_approved ? 'Approved' : 'Pending Approval'}
                  </span>
                </td>
                <td className="table-cell text-right">
                  <div className="actions-cell">
                    {editingDoctor === doctor.id ? (
                      <>
                        <button
                          onClick={() => handleSaveClick(doctor.id)}
                          className="action-btn approve-btn"
                          title="Save"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="action-btn delete-btn"
                          title="Cancel"
                        >
                          <FiX size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        {!doctor.is_approved?.is_approved && (
                          <button
                            onClick={() => handleApprove(doctor.id, true)}
                            className="action-btn approve-btn"
                            title="Approve"
                          >
                            <FiCheck size={18} />
                          </button>
                        )}
                        {doctor.is_approved?.is_approved && (
                          <button
                            onClick={() => handleApprove(doctor.id, false)}
                            className="action-btn delete-btn"
                            title="Disapprove"
                          >
                            <FiX size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditClick(doctor)}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor.id)}
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

export default Doctors;