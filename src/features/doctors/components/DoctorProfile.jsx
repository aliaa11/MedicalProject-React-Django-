// import React, { useState, useEffect } from "react";
// import doctorImage from "../../../assets/doctor.jpg";
// import {
//   Mail,
//   Phone,
//   Calendar,
//   FileText,
//   Stethoscope,
//   Clock,
//   Star,
// } from "lucide-react";
// import "../style/doctor.css";

// const DoctorProfile = () => {
//   const [doctor, setDoctor] = useState(null);
//   const [user, setUser] = useState(null);
//   const [specialty, setSpecialty] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const resDoctors = await fetch("http://localhost:3001/doctors");
//         const doctorsData = await resDoctors.json();
//         console.log("Doctors Data:", doctorsData);
//         const doctor = doctorsData.length > 0 ? doctorsData[0] : null;
//         if (!doctor) throw new Error("Doctor not found");

//         const resUsers = await fetch("http://localhost:3001/users");
//         const usersData = await resUsers.json();
//         const user = usersData.find(
//           (u) => String(u.id) === String(doctor.user_id)
//         );

//         const resSpecialties = await fetch("http://localhost:3001/specialties");
//         const specialtiesData = await resSpecialties.json();
//         const specialty = specialtiesData.find(
//           (s) => String(s.id) === String(doctor.specialty_id)
//         );

//         const resAppointments = await fetch("http://localhost:3001/appointments");
//         const allAppointments = await resAppointments.json();
//         const doctorAppointments = allAppointments.filter(
//           (appt) => String(appt.doctor_id) === String(doctor.id)
//         );

//         const resPatients = await fetch("http://localhost:3001/patients");
//         const patientsData = await resPatients.json();

//         setDoctor(doctor);
//         setUser(user);
//         setSpecialty(specialty);
//         setAppointments(doctorAppointments);
//         setPatients(patientsData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to load data", error);
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   if (loading)
//     return (
//       <div className="text-center text-blue-600 animate-pulse py-8">Loading...</div>
//     );

//   if (!doctor || !user || !specialty)
//     return (
//       <div className="text-center text-red-500 py-8">Doctor profile not found.</div>
//     );

//   const getPatientName = (patientId) => {
//     const patient = patients.find((p) => String(p.id) === String(patientId));
//     return patient ? `Patient #${patient.id}` : "Unknown";
//   };

//   const formatDate = (dateStr) => {
//     return new Date(dateStr).toLocaleDateString();
//   };

//   const formatTime = (timeStr) => {
//     const [h, m] = timeStr.split(":");
//     return `${h}:${m}`;
//   };

//   return (
//     <div className="profile-container">
//       <div className="profile-grid">
//         <div className="profile-content">
//           {/* باقي المعلومات ... */}
//           {/* جدول المواعيد الجديد */}
//           <div className="section-card">
//             <h3 className="appointments-title">Appointments</h3>
//             <table className="appointments-table">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Time</th>
//                   <th>Patient</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {appointments.map((appt) => (
//                   <tr key={appt.id}>
//                     <td>{formatDate(appt.date)}</td>
//                     <td>{formatTime(appt.time)}</td>
//                     <td>{getPatientName(appt.patient_id)}</td>
//                     <td>
//                       <span className={`status ${appt.status}`}>
//                         {appt.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* باقي الكارت بتاع البروفايل */}
//         <div className="appointments-card">
//           <h3 className="appointments-title">Next 3</h3>
//           <ul className="text-sm text-gray-700 space-y-3">
//             {appointments
//               .filter(
//                 (a) => a.status === "pending" || a.status === "confirmed"
//               )
//               .slice(0, 3)
//               .map((a) => (
//                 <li key={a.id}>
//                   <span className="font-medium">{formatDate(a.date)}</span> at{" "}
//                   {formatTime(a.time)}
//                 </li>
//               ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorProfile;
import React, { useState, useEffect } from "react";
import doctorImage from "../../../assets/doctor.jpg";
import {
  Mail,
  Phone,
  Calendar,
  Stethoscope,
  X,
  Edit3,
} from "lucide-react";
import "../style/doctor.css";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [user, setUser] = useState(null);
  const [specialty, setSpecialty] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialtyName: "",
    bio: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const resDoctors = await fetch("http://localhost:3001/doctors");
        const doctorsData = await resDoctors.json();
        const doctor = doctorsData[0];

        if (!doctor) throw new Error("Doctor not found");

        const resUsers = await fetch("http://localhost:3001/users");
        const usersData = await resUsers.json();
        const user = usersData.find(u => String(u.id) === String(doctor.user_id));

        const resSpecialties = await fetch("http://localhost:3001/specialties");
        const specialtiesData = await resSpecialties.json();
        const specialty = specialtiesData.find(s => String(s.id) === String(doctor.specialty_id));

        const resAppointments = await fetch("http://localhost:3001/appointments");
        const allAppointments = await resAppointments.json();
        const doctorAppointments = allAppointments.filter(appt => String(appt.doctor_id) === String(doctor.id));

        const resPatients = await fetch("http://localhost:3001/patients");
        const patientsData = await resPatients.json();

        setDoctor(doctor);
        setUser(user);
        setSpecialty(specialty);
        setAppointments(doctorAppointments);
        setPatients(patientsData);
        setLoading(false);

        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: doctor?.phone || "",
          specialtyName: specialty?.name || "",
          bio: doctor?.bio || "",
        });
      } catch (error) {
        console.error("Failed to load data", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${suffix}`;
  };

  const getPatientName = (id) => {
    const patient = patients.find(p => String(p.id) === String(id));
    return patient?.name || `Patient #${id}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser(prev => ({ ...prev, name: formData.name, email: formData.email }));
    setDoctor(prev => ({ ...prev, phone: formData.phone, bio: formData.bio }));
    setSpecialty(prev => ({ ...prev, name: formData.specialtyName }));
    setEditOpen(false);
  };

  if (loading) return <div className="text-center text-blue-600 py-8 animate-pulse">Loading...</div>;
  if (!doctor || !user || !specialty) return <div className="text-center text-red-500 py-8">Doctor profile not found.</div>;

  return (
    <div className={`profile-container ${!editOpen ? "fullscreen" : ""}`}>
      <div className="max-w-4xl mx-auto">
        {/* بطاقة واحدة شاملة كل شيء */}
        <div className="profile-card bg-white p-10 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-12">

          {/* رأس البروفايل */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <img
              src={doctorImage}
              alt="Doctor"
              className="w-60 h-60 rounded-full object-cover border-4 border-blue-300 shadow-md"
            />
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-5xl font-bold text-gray-800">{user.name}</h2>
                <button
                  className="primary-button px-5 py-2 rounded-md flex items-center gap-2"
                  onClick={() => setEditOpen(true)}
                >
                  <Edit3 size={18} /> Edit Profile
                </button>
              </div>
              <p className="flex items-center gap-3 text-blue-600 text-xl font-semibold">
                <Stethoscope size={24} /> {specialty.name}
              </p>
              <p className="flex items-center gap-2 text-gray-700 text-lg">
                <Phone size={20} /> {doctor.phone}
              </p>
              <p className="flex items-center gap-2 text-gray-700 text-lg">
                <Mail size={20} /> {user.email}
              </p>
              <p className="flex items-center gap-2 text-gray-700 text-lg">
                <Calendar size={20} /> Gender: {doctor.gender}
              </p>
            </div>
          </div>

          {/* قسم النبذة */}
          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">About</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {doctor.bio || "No bio provided."}
            </p>
          </div>

          {/* جدول المواعيد */}
          <div className="overflow-x-auto">
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">Appointments</h3>
            <table className="min-w-full text-left text-gray-700 text-base border border-gray-200 rounded-lg">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-4 font-semibold border-b">Date</th>
                  <th className="p-4 font-semibold border-b">Time</th>
                  <th className="p-4 font-semibold border-b">Patient</th>
                  <th className="p-4 font-semibold border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">No appointments found.</td>
                  </tr>
                ) : (
                  appointments.map(appt => (
                    <tr key={appt.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="p-4">{formatDate(appt.date)}</td>
                      <td className="p-4">{formatTime(appt.time)}</td>
                      <td className="p-4">{getPatientName(appt.patient_id)}</td>
                      <td className="p-4">
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                          appt.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* مودال التعديل */}
      {editOpen && (
        <div
          className="edit-modal-overlay"
          aria-modal="true"
          role="dialog"
        >
          <div className="edit-modal-content">
            <button
              className="edit-modal-close-btn"
              onClick={() => setEditOpen(false)}
              aria-label="Close Edit Modal"
            >
              <X size={28} />
            </button>
            <h2 className="text-3xl font-semibold mb-8 text-blue-600">Edit Profile</h2>
            <div className="space-y-6">
              {["name", "email", "phone", "specialtyName", "bio"].map((field, idx) => (
                <div key={idx}>
                  <label className="block mb-2 font-semibold text-gray-700" htmlFor={field}>
                    {field === "specialtyName" ? "Specialty" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "bio" ? (
                    <textarea
                      id={field}
                      name={field}
                      rows="4"
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      id={field}
                      name={field}
                      type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-6 mt-8">
              <button
  type="button"
  onClick={() => setEditOpen(false)}
  className="cancel-button"
>
  Cancel
</button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="primary-button px-8 py-3 rounded-lg"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
