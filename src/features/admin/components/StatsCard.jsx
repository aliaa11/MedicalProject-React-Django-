const StatsCard = ({ title, value, icon, trend, change }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className={`mt-4 text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change} {trend === 'up' ? '↑' : '↓'} from last month
        </div>
      </div>
    </div>
  );
};

export default StatsCard;