import React, { useState, useEffect } from "react"; // Import useState
import '../style/style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
export default function ListDoctors() {

  const [doctorsList, setDoctorsList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchSpecialities = async ()=>{
      try{

        const res = await fetch('http://localhost:3000/specialties',{
          headers:{
            'Content-Type': 'application/json'
          }
        })

        const data = await res.json()
        console.log(data) 

      }catch(error){
        console.log(error)
      }

    }

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

  // if (isLoading) {
  //   return <div>Loading doctors...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <div className=" m-4" style={{width:'100%'}}>
      <div className="rounded-md shadow-md p-3.5 flex justify-between">
        <p className="title font-extrabold text-base">Our Doctors</p>
        <div className="flex align-baseline items-center">
          <FontAwesomeIcon icon={faBell} className="text-black w-6 h-6 !me-4" />
          <span>|</span>
          <img 
            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg" 
            
            className="w-16 h-16 rounded-full object-cover ms-3"
          />  
          <span className="mx-4">
            <p className="font-bold">User</p>  
            <p className="">Role</p>  
          </span>      
        </div>
      </div>
      <div className="flex justify-between items-center mb-4 p-4 bg-slate-100 rounded-lg">
        {/* Pagination */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-800">1-10</span> of <span className="font-medium text-gray-800">30</span>
        </div>

        {/* Improved Search Bar */}
        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg 
              className=" text-gray-500" 
              fill="none" 
              viewBox="0 0 20 20"
            >
              <path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full py-3 pl-10 pr-4 text-base text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Search doctors..."
          />
        </div>

      </div>
      <div class="grid grid-cols-4 gap-4">
        {
          doctorsList.map(doctor=>{
            return (
              <div className="p-4 rounded-md shadow-lg flex justify-center">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg" 
                  
                  className="w-30 rounded-full object-cover ms-3"
                />  
                <p>
                  {doctor.id}
                </p>
              </div>     
            )
          })
        }
      </div>

    </div>
  );
}
