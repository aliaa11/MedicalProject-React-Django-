import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../style/global.css";

export default function UsersList() {
  const [users, setUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all users with role 'patient'
        const usersResponse = await axios.get("http://localhost:3001/users");
        const patients = usersResponse.data.filter(user => user.role === "patient");
        
        // Fetch additional data for each patient
        const enrichedPatients = await Promise.all(
          patients.map(async (user) => {
            try {
              // Get patient details
              const patientResponse = await axios.get(`http://localhost:3001/patients?user_id=${user.id}`);
              const patient = patientResponse.data[0];
              
              // Get patient's appointments
              const appointmentsResponse = await axios.get(`http://localhost:3001/appointments?patient_id=${patient.id}`);
              const appointments = appointmentsResponse.data;
              
              // Get latest appointment
              const latestAppointment = appointments.length > 0 
                ? appointments.reduce((latest, current) => {
                    return new Date(current.date) > new Date(latest.date) ? current : latest;
                  })
                : null;

              return {
                ...user,
                patientId: patient.id,
                latestAppointment
              };
            } catch (error) {
              console.error(`Error fetching data for patient ${user.id}:`, error);
              return {
                ...user,
                patientId: null,
                latestAppointment: null
              };
            }
          })
        );

        setUsers(patients);
        setFilteredUsers(patients);
        setPatientsData(enrichedPatients);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
        setFilteredUsers([]);
        setPatientsData([]);
      }
    }
    
    fetchData();
  }, []);

  useEffect(() => {
    if (users) {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, users]);

  const handleClick = (userId) => {
    navigate(`/doctor/appointments/${userId}`);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (users === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl font-bold text-[var(--color-font)]">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[var(--color-font)]">Users Management</h1>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full px-5 py-3 border-2 border-[var(--color-icon-light)] rounded-lg 
                     focus:outline-none focus:border-[var(--color-hover)] 
                     placeholder-[var(--color-font-light)] text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-4 top-3.5 h-6 w-6 text-[var(--color-icon)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl font-bold text-[var(--color-font)]">
            {searchTerm ? "No matching patients found." : "No patients available."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentUsers.map(user => {
              const patientInfo = patientsData.find(p => p.id === user.id) || {};
              const latestAppointment = patientInfo.latestAppointment;
              
              return (
                <div
                  key={user.id}
                  className="bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all duration-300 
                             hover:shadow-md hover:border-[var(--color-hover-light)] border-2 border-[var(--color-nav-bg)]"
                  onClick={() => handleClick(user.id)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--color-nav-bg)] p-3 rounded-full">
                      <svg className="h-6 w-6 text-[var(--color-icon)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-[var(--color-font)]">{user.username}</h2>
                  </div>

                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-[var(--color-font)]">
                      <svg className="h-5 w-5 text-[var(--color-icon)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p className="flex items-center gap-2 text-[var(--color-font)]">
                      <svg className="h-5 w-5 text-[var(--color-icon)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <span className="font-semibold">Role:</span> {user.role}
                    </p>
                    <p className={`flex items-center gap-2 ${user.is_approved ? "text-green-600" : "text-red-600"}`}>
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">Account Status:</span> {user.is_approved ? "Approved" : "Pending"}
                    </p>
                    {latestAppointment && (
                      <p className={`flex items-center gap-2 ${
                        latestAppointment.status === 'approved' ? 'text-green-600' : 
                        latestAppointment.status === 'rejected' ? 'text-red-600' : 
                        'text-yellow-600'
                      }`}>
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">Appointment:</span> 
                        {latestAppointment.status.charAt(0).toUpperCase() + latestAppointment.status.slice(1)}
                        {latestAppointment.date && (
                          <span className="text-sm ml-1">({new Date(latestAppointment.date).toLocaleDateString()})</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-lg shadow-sm">
                <ul className="flex list-none gap-1">
                  {currentPage > 1 && (
                    <li>
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        className="px-4 py-2 rounded-lg font-bold bg-white text-[var(--color-font)] 
                                 hover:bg-[var(--color-nav-bg)] border border-[var(--color-icon-light)]"
                      >
                        &laquo;
                      </button>
                    </li>
                  )}

                  {Array.from({ length: totalPages }).map((_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 rounded-lg font-bold ${
                          currentPage === index + 1
                            ? "bg-[var(--color-hover)] text-white"
                            : "bg-white text-[var(--color-font)] hover:bg-[var(--color-nav-bg)] border border-[var(--color-icon-light)]"
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}

                  {currentPage < totalPages && (
                    <li>
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        className="px-4 py-2 rounded-lg font-bold bg-white text-[var(--color-font)] 
                                 hover:bg-[var(--color-nav-bg)] border border-[var(--color-icon-light)]"
                      >
                        &raquo;
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}