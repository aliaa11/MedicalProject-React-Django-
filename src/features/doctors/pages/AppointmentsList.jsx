import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 4;
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem("user"));
        
        if (!userData || userData.role !== "doctor") {
          toast.error("Only doctors can view appointments");
          navigate('/login');
          return;
        }

        // استخدم endpoint الخاص بمواعيد الطبيب فقط
        const response = await axios.get(
          `http://localhost:8000/api/appointments/doctor-appointments/`, 
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            }
          }
        );
        
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error(error.response?.data?.detail || "Failed to fetch appointments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const filteredAppointments = appointments.filter(app =>
    app.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const goToDetails = (id) => {
    navigate(`/doctor/appointments/${id}`);
  };

  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  // Function to determine status color
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="!p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 !mb-6">My Appointments</h1>
      
      <div className="bg-white rounded-lg shadow-md !p-6 !mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 md:mb-0">Upcoming Appointments</h2>
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by date or status..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {currentAppointments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentAppointments.map(appointment => (
                <div 
                  key={appointment.id} 
                  className="bg-blue-50 border border-blue-100 p-5 rounded-xl cursor-pointer hover:bg-blue-100 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
                  onClick={() => goToDetails(appointment.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-blue-800">Appointment #{appointment.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <strong>Date:</strong> <span className="ml-1">{appointment.date}</span>
                    </p>
                    <p className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <strong>Time:</strong> <span className="ml-1">{appointment.time}</span>
                    </p>
                    {appointment.patient_data && (
                      <p className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <strong>Patient:</strong> <span className="ml-1">{appointment.patient_data.name}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 border ${
                        currentPage === i + 1 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      } ${i === 0 ? 'rounded-l-md' : ''} ${i === totalPages - 1 ? 'rounded-r-md' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-gray-500">You don't have any appointments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;