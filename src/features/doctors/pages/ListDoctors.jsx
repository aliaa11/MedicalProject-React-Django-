import React, { useState, useEffect } from "react"; // Import useState

export default function ListDoctors() {

  const [doctorsList, setDoctorsList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchDoctors = async () => {
      try {

        setIsLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3000/doctors', {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        setDoctorsList(data);

      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError(err.message);
      } finally {
        
        setIsLoading(false); 
      }
    };

    fetchDoctors();

  }, []); 

  if (isLoading) {
    return <div>Loading doctors...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Doctors List</h2>
      {doctorsList.length > 0 ? (
        <ul>
          {doctorsList.map((doctor) => (
            <li key={doctor.id}>
              {doctor.name} - {doctor.specialty || 'No specialty'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No doctors found.</p>
      )}
    </div>
  );
}
