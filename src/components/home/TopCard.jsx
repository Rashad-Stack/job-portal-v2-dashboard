import { FaBriefcase, FaList, FaMousePointer, FaUserCheck } from 'react-icons/fa';

const getIcon = (title) => {
  switch (title) {
    case 'Total Jobs':
      return <FaBriefcase className="text-2xl md:text-3xl" />;
    case 'Categories':
      return <FaList className="text-2xl md:text-3xl" />;
    case 'Total Clicks':
      return <FaMousePointer className="text-2xl md:text-3xl" />;
    case 'Applications':
      return <FaUserCheck className="text-2xl md:text-3xl" />;
    default:
      return null;
  }
};

export default function TopCard({ title, num }) {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 group border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-indigo-50 dark:bg-gray-700 rounded-xl w-16 h-16 flex items-center justify-center text-[#00ab0c]">
          {getIcon(title)}
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-lg md:text-xl mb-1">
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
