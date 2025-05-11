import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { AiOutlineForm } from "react-icons/ai";
import { FaUsersCog } from "react-icons/fa";
import useDeviceSize from "../../hooks/useDeviceSize";

export default function SettingsNavbar({ toggleSidebar }) {
  const isMobile = useDeviceSize();

  const handleOnClick = () => {
    if (isMobile) {
      toggleSidebar(false);
    }
  };

  return (
    <nav>
      <ul className="pl-6 mt-2 space-y-2">
        <li>
          <Link
            to="/moderator/register"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            onClick={handleOnClick}
          >
            <AiOutlineForm />
            <span className="ms-3">Create Moderator</span>
          </Link>
        </li>

        <li>
          <Link
            to="/setting/manage_moderator"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            onClick={handleOnClick}
          >
            <FaUsersCog />
            <span className="ms-3">Manage Moderators</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
