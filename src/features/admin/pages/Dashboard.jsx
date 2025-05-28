import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import StatsCard from '../components/StatsCard';
import '../styles/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const stats = [
    { title: 'Total Users', value: 1245, icon: '👥', trend: 'up', change: '12%' },
    { title: 'Active Doctors', value: 42, icon: '👨‍⚕️', trend: 'up', change: '5%' },
    { title: 'Appointments', value: 389, icon: '📅', trend: 'down', change: '3%' },
    { title: 'Revenue', value: '$12,450', icon: '💰', trend: 'up', change: '24%' }
  ];

  const appointmentsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Appointments',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(63, 81, 181, 0.5)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1,
      },
    ],
  };

  const usersData = {
    labels: ['Patients', 'Doctors', 'Admins'],
    datasets: [
      {
        data: [1200, 42, 3],
        backgroundColor: [
          'rgba(63, 81, 181, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 193, 7, 0.7)'
        ],
        borderColor: [
          'rgba(63, 81, 181, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(255, 193, 7, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
// Add this for animated counter effects
document.querySelectorAll('.stat-card').forEach(card => {
  const valueElement = card.querySelector('.stat-value');
  const targetValue = parseInt(valueElement.textContent);
  let currentValue = 0;
  
  const animateCounter = () => {
    if (currentValue < targetValue) {
      currentValue += Math.ceil(targetValue / 50);
      if (currentValue > targetValue) currentValue = targetValue;
      valueElement.textContent = currentValue.toLocaleString();
      requestAnimationFrame(animateCounter);
    }
  };
  
  // Start animation when card is visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounter();
      observer.unobserve(card);
    }
  });
  
  observer.observe(card);
});
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Appointments Overview</h2>
          </div>
          <div className="p-4">
            <Bar data={appointmentsData} />
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">User Distribution</h2>
          </div>
          <div className="p-4">
            <Pie data={usersData} />
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
        </div>
        <div className="p-4">
          {/* Activity items would go here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;