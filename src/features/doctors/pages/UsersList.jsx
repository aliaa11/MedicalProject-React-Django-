import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        const usersResponse = await axios.get("http://localhost:3001/users");
        const patients = usersResponse.data.filter(user => user.role === "patient");
        
        const enrichedPatients = await Promise.all(
          patients.map(async (user) => {
            try {
              const patientResponse = await axios.get(`http://localhost:3001/patients?user_id=${user.id}`);
              const patient = patientResponse.data[0];
              const appointmentsResponse = await axios.get(`http://localhost:3001/appointments?patient_id=${patient.id}`);
              const appointments = appointmentsResponse.data;
              
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
        <p className="text-xl font-bold text-gray-700">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Patients Management</h1>
        <input
          type="text"
          placeholder="Search patients..."
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     placeholder-gray-400 text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl font-bold text-gray-700">
            {searchTerm ? "No matching patients found." : "No patients available."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentUsers.map(user => {
              const patientInfo = patientsData.find(p => p.id === user.id) || {};
              const latestAppointment = patientInfo.latestAppointment;
              
              return (
                <div
                key={user.id}
                className="bg-white rounded-lg shadow-md px-6 py-8 cursor-pointer hover:shadow-lg border border-gray-200 transition space-y-2"

                onClick={() => handleClick(user.id)}
              >
              
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                    {user.username}
                  </h2>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className={`mb-1 font-semibold ${
                    user.is_approved ? "text-green-600" : "text-red-600"
                  }`}>
                    Status: {user.is_approved ? "Approved" : "Pending"}
                  </p>
                  {latestAppointment && (
                    <p className={`text-sm ${
                      latestAppointment.status === 'approved' ? 'text-green-600' : 
                      latestAppointment.status === 'rejected' ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>
                      Last Appointment: {latestAppointment.status.charAt(0).toUpperCase() + latestAppointment.status.slice(1)}
                      {latestAppointment.date && (
                        <span className="ml-1 text-gray-500">({new Date(latestAppointment.date).toLocaleDateString()})</span>
                      )}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = index + 1;
                  } else if (currentPage <= 3) {
                    pageNum = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + index;
                  } else {
                    pageNum = currentPage - 2 + index;
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => paginate(pageNum)}
                      className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}