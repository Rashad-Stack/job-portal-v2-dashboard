import {
  FaBriefcase,
  FaList,
  FaMousePointer,
  FaUserCheck,
} from "react-icons/fa";

const getIcon = (title) => {
  switch (title) {
    case "Total Jobs":
      return <FaBriefcase className="text-2xl md:text-3xl" />;
    case "Categories":
      return <FaList className="text-2xl md:text-3xl" />;
    case "Total Clicks":
      return <FaMousePointer className="text-2xl md:text-3xl" />;
    case "Applications":
      return <FaUserCheck className="text-2xl md:text-3xl" />;
    default:
      return null;
  }
};

export default function TopCard({ title, num }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-indigo-50 rounded-xl w-16 h-16 flex items-center justify-center text-[#00ab0c] group-hover:bg-indigo-100 transition-colors duration-300">
          {getIcon(title)}
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 text-lg md:text-xl mb-1">
            {title}
          </h2>
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00ab0c] to-[#01860a] bg-clip-text text-transparent">
            {num}
          </p>
        </div>
      </div>
    </div>
  );
}
