import { MdOutlineDashboard } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogin } from 'react-icons/md';
import { AiOutlineForm } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SettingsNavbar from './SettingsNavbar';
import { MdWorkOutline } from 'react-icons/md';
import JobsNavbar from './JobsNavbar';

function DashboardSidebar({ toggleSidebar }) {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isJobsOpen, setJobsOpen] = useState(false);

  const toggleSettings = () => {
    setSettingsOpen(!isSettingsOpen);
    setJobsOpen(false);
  };

  const toggleJobs = () => {
    setJobsOpen(!isJobsOpen);
    setSettingsOpen(false);
  };

  function handleOnClick() {
    setSettingsOpen(false);
    if (isMobile) {
      toggleSidebar(false);
    }
  }

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to="/"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              onClick={handleOnClick}
            >
              <MdOutlineDashboard />
              <span className="ms-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/profile"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              onClick={handleOnClick}
            >
              <FaRegUser />
              <span className="ms-3">Profile</span>
            </Link>
          </li>
          <li>
            <button
              className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              onClick={toggleJobs}
            >
              <MdWorkOutline />
              <span className="ms-3">Jobs</span>
            </button>
            {isJobsOpen && (
              <JobsNavbar toggleSettings={toggleSettings} toggleSidebar={toggleSidebar} />
            )}
          </li>
          <li>
            <button
              onClick={toggleSettings}
              className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <IoSettingsOutline />
              <span className="ms-3">Settings</span>
            </button>
            {isSettingsOpen && <SettingsNavbar toggleSidebar={toggleSidebar} />}
          </li>
          <li>
            <Link
              to="/login"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <MdLogin />
              <span className="ms-3">Sign in</span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <AiOutlineForm />
              <span className="ms-3">Sign up</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
