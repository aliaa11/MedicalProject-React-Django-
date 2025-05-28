import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faTimes, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function ListDoctors() {
  const [doctorsList, setDoctorsList] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [specialties, setSpecialties] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination setup
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch specialties
        const specialtiesResponse = await fetch('http://localhost:3000/specialties');
        if (!specialtiesResponse.ok) throw new Error('Failed to fetch specialties');
        const specialtiesData = await specialtiesResponse.json();
        const specialtyMap = specialtiesData.reduce((acc, spec) => {
          acc[spec.id] = spec.name;
          return acc;
        }, {});
        setSpecialties(specialtyMap);

        // Fetch users
        const usersResponse = await fetch('http://localhost:3000/users');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        const userMap = usersData.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
        setUsersMap(userMap);

        // Fetch doctors
        const doctorsResponse = await fetch('http://localhost:3000/doctors');
        if (!doctorsResponse.ok) throw new Error('Failed to fetch doctors');
        const doctorsData = await doctorsResponse.json();
        setDoctorsList(doctorsData);
        setFilteredDoctors(doctorsData);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDoctors(doctorsList);
      return;
    }

    const filtered = doctorsList.filter(doctor => {
      const user = usersMap[doctor.user_id];
      const doctorName = user ? user.username : '';
      const specialtyName = specialties[doctor.specialty_id] || '';
      
      const searchTermLower = searchTerm.toLowerCase();
      
      switch (searchBy) {
        case 'name':
          return doctorName.toLowerCase().includes(searchTermLower);
        case 'specialty':
          return specialtyName.toLowerCase().includes(searchTermLower);
        case 'all':
        default:
          return doctorName.toLowerCase().includes(searchTermLower) || 
                 specialtyName.toLowerCase().includes(searchTermLower);
      }
    });
    
    setFilteredDoctors(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, searchBy, doctorsList, usersMap, specialties]);

  // Pagination functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchBy('all');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-700">Loading doctors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="!p-4 !sm:p-6 !lg:p-8 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center !mb-6 !p-4 bg-white rounded-lg shadow-sm">
        {/* Search Section */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 !mb-4 !sm:mb-0">
          {/* Search Filter Dropdown */}
          <select 
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="!px-3 !py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="name">Name</option>
            <option value="specialty">Specialty</option>
          </select>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-2 flex items-center !pl-3 pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full !py-2 !pl-10 !pr-12 text-base text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Search doctors by ${searchBy === 'all' ? 'name or specialty' : searchBy}...`}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center !pr-3 text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Showing</span>
          <span className="font-medium text-gray-800 !ml-2">
            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDoctors.length)}
          </span>
          <span className="!mx-2">of</span>
          <span className="font-medium text-gray-800">{filteredDoctors.length}</span>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="!p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === page 
                    ? 'bg-[var(--color-icon)] text-white' 
                    : 'hover:bg-gray-200 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="!p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faAngleRight} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="!mb-4 !p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-700">
              {filteredDoctors.length > 0 ? (
                <>
                  Found <span className="font-semibold">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''} 
                  {searchBy !== 'all' && <span> by {searchBy}</span>} 
                  matching "<span className="font-semibold">{searchTerm}</span>"
                </>
              ) : (
                <>No doctors found matching "<span className="font-semibold">{searchTerm}</span>"</>
              )}
            </div>
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Doctors Grid */}
      {currentDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentDoctors.map(doctor => {
            const user = usersMap[doctor.user_id];
            const doctorName = user ? `Dr. ${user.username}` : 'Dr. Unknown';
            const specialtyName = specialties[doctor.specialty_id] || "General Practitioner";

            return (
              <div key={doctor.id} className="relative !p-6 bg-white rounded-lg shadow-md flex flex-col items-center text-center border border-gray-200 hover:shadow-lg">
                {/* Doctor Image */}
                <img
                  src="https://placehold.co/100x100/A7D9F8/274760?text=Dr"
                  alt={doctorName}
                  className="w-24 h-24 rounded-full object-cover !mb-4 border-4 border-white shadow-sm"
                />

                {/* Doctor Info */}
                <h3 className="text-xl font-semibold text-gray-900 !mb-1">
                  {doctorName}
                </h3>
                <p className="text-sm text-gray-500 !mb-1">
                  #{doctor.id}
                </p>
                <p className="text-md font-medium text-blue-600 !mb-1">
                  {specialtyName}
                </p>
                <p className="text-sm text-gray-500 !mb-3">
                  Trust Hospitals
                </p>

                {/* Contact Button */}
                <Link to={`/doctors/${doctor.id}`}>
                  <button className="w-full !py-2 !px-4 bg-[var(--color-icon)] text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    Book Appointment
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center !py-12 text-center">
          <div className="w-24 h-24 !mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faSearch} className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 !mb-2">
            {searchTerm ? "No matching doctors found" : "No doctors available"}
          </h3>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="!px-4 !py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Show all doctors
            </button>
          )}
        </div>
      )}

      {/* Bottom Pagination (for mobile) */}
      <div className="flex justify-center !mt-8 sm:hidden">
        <div className="flex items-center space-x-4">
          <button 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="!p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faAngleLeft} className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="!p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faAngleRight} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}