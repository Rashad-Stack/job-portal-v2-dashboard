import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { AiOutlineForm } from "react-icons/ai";
import { CiViewTable } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDashboard, MdWorkOutline } from "react-icons/md";
import { Link } from "react-router";
import JobIndexBar from "./JobIndexBar";
import JobsNavbar from "./JobsNavbar";
import SettingsNavbar from "./SettingsNavbar";
function DashboardSidebar({ toggleSidebar }) {
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isJobsOpen, setJobsOpen] = useState(false);
  const [isJobIndexOpen, setJobIndexOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const toggleSettings = () => {
    setSettingsOpen(!isSettingsOpen);
    setJobsOpen(false);
    setJobIndexOpen(false);
  };

  const toggleJobs = () => {
    setJobsOpen(!isJobsOpen);
    setSettingsOpen(false);
    setJobIndexOpen(false);
  };

  const toggleJobIndex = () => {
    setJobIndexOpen(!isJobIndexOpen);
    setSettingsOpen(false);
    setJobsOpen(false);
  };
  useEffect(() => {
    const token = localStorage.getItem("svaAuth");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
        if (decoded.role === "ADMIN") {
          setShowSignUp(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  return (
    <aside className="fixed top-0 left-0 z-40 w-44 h-screen pt-20 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to="/"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white cursor-pointer  hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <MdOutlineDashboard />
              <span className="ms-3">Dashboard</span>
            </Link>
          </li>

          <li>
            <button
              onClick={toggleJobIndex}
              className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <CiViewTable />
              <span className="ms-3">Job Index</span>
            </button>
            {isJobIndexOpen && <JobIndexBar toggleSidebar={toggleSidebar} />}
          </li>

          <li className="">
            <button
              className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white cursor-pointer  hover:bg-gray-100 dark:hover:bg-gray-700 group"
              onClick={toggleJobs}>
              <MdWorkOutline />
              <span className="ms-3">Jobs</span>
            </button>
            {isJobsOpen && (
              <JobsNavbar
                toggleSettings={toggleSettings}
                toggleSidebar={toggleSidebar}
              />
            )}
          </li>

          <li>
            <Link
              to="/jobs/forms"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white cursor-pointer  hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <AiOutlineForm />
              <span className="ms-3">Forms</span>
            </Link>
          </li>

          {showSignUp && (
            <li>
              <button
                onClick={toggleSettings}
                className="flex items-center w-full p-2 cursor-pointer text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <IoSettingsOutline />
                <span className="ms-3">System</span>
              </button>
              {isSettingsOpen && (
                <SettingsNavbar toggleSidebar={toggleSidebar} />
              )}
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
