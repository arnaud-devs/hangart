interface StatsCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: "blue" | "green" | "yellow" | "purple";
}

const colorClasses = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label, color }) => {
  const colors = colorClasses[color];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div className="ml-4">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
      </div>
    </div>
  );
};