import { useState, useEffect } from "react";
import { fetchAllDoctors, fetchAllUsers, fetchAllSpecialties } from "../dataSlice";
import styles from "../style/DoctorsSection.module.css";
import doctorImage from "../../../assets/portrait-smiling-charming-young-man-grey-t-shirt-standing-against-plain-background.jpg"; 
import { useNavigate } from "react-router-dom";

export default function DoctorsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [doctorsPerPage] = useState(3);
  const [combinedDoctors, setCombinedDoctors] = useState([]);
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctors, users, specialties] = await Promise.all([
          fetchAllDoctors(),
          fetchAllUsers(),
          fetchAllSpecialties()
        ]);

        const enrichedDoctors = doctors.map(doctor => {
          const user = users.find(u => u.id === doctor.user_id);
          const specialty = specialties.find(s => s.id === doctor.specialty_id);
          return {
            ...doctor,
            username: user?.username || "Unknown",
            specialtyName: specialty?.name || "General"
          };
        });

        setCombinedDoctors(enrichedDoctors);
        setAllSpecialties(specialties);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter doctors by specialty
  const filteredDoctors = selectedSpecialty === "all" 
    ? combinedDoctors 
    : combinedDoctors.filter(doctor => doctor.specialtyName === selectedSpecialty);

  // Pagination logic
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const currentDoctors = filteredDoctors.slice(
    currentPage * doctorsPerPage,
    (currentPage + 1) * doctorsPerPage
  );
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.subtitle}>MEET OUR DOCTORS ({filteredDoctors.length} Total)</p>
          <h2 className={styles.title}>
            <span className={styles.titleHighlight}>Professional</span> & Enthusiastic
          </h2>
          
          {/* Specialty Filter Dropdown */}
          <div className={styles.filterContainer}>
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                setCurrentPage(0); // Reset to first page when filter changes
              }}
              className={styles.filterDropdown}
            >
              <option value="all">All Specialties</option>
              {allSpecialties.map(specialty => (
                <option key={specialty.id} value={specialty.name}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.doctorsGrid}>
          {currentDoctors.map((doctor) => (
            <div key={doctor.id} className={styles.doctorCard}>
               <div className={styles.cardContent}>
              <img src={doctorImage} alt={doctor.username} className={styles.doctorImage} />
              <h3 className={styles.doctorName}>
                  <span className={styles.nameHighlight}>{doctor.username}</span>  
              </h3>
              <p className={styles.specialty}>{doctor.specialtyName}</p>
              <p className={styles.bio}>{doctor.bio}</p>
              <div className={styles.details}>
                <p>{doctor.years_of_experience} years of experience</p>
                <p>{doctor.phone}</p>
              </div>
              <button 
                onClick={() => navigate(`/patient/available-doctors`)}
                className={styles.readMoreButton}
              >
                READ MORE
              </button>
            </div>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`${styles.paginationDot} ${
                index === currentPage ? styles.active : ""
              }`}
            >
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}