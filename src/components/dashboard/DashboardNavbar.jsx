import React, { useEffect, useState } from "react";
import Logo from "../common/Logo";
import { Link } from "react-router-dom";
import { RiMenuAddFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

function DashboardNavbar({ toggleSidebar }) {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // 👈 correct usage
        setUserInfo(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  const capitalizeFirstLetter = (name) => {
    if (name) return;
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };
  const LogOut = () => {
    localStorage.clear(); // Clears all data in localStorage
    // If you're using cookies for token, clear the cookie as well
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Remove cookie

    // Optional: Redirect to login page (if required)
    window.location.href = "/login"; // or use react-router to navigate
  };

  const handleDropDown = () => {
    setProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="fixed top-0 z-50 w-full sm:px-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              className="text-2xl mb-2 p-2 text-gray-600 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={toggleSidebar}
            >
              <RiMenuAddFill />
            </button>
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3 relative">
              <button className="flex text-2xl" onClick={handleDropDown}>
                <FaUserCircle />
              </button>
              {isProfileOpen && userInfo && (
                <div className="z-50 absolute top-[40px] right-[0px] my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <p>{capitalizeFirstLetter(userInfo?.name)}</p>
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                      {userInfo.email}
                    </p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <Link
                        onClick={() => LogOut()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Sign out
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
