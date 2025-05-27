// src/pages/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-[#274760] mb-6 text-center">Welcome to boxdoc</h1>
        <div className="flex flex-col space-y-4">
          <Link 
            to="/login" 
            className="px-4 py-2 bg-[#3072B2] text-white rounded-md hover:bg-[#4892d7] text-center"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-4 py-2 border border-[#3072B2] text-[#274760] rounded-md hover:bg-[#BDDBF2] text-center"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;