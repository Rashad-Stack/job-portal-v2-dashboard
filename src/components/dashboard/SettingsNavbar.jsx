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
      <ul className="pl-2 mt-2 space-y-2">
        <li>
          <Link
            to="/moderator/register"
            className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            onClick={handleOnClick}
          >
            <AiOutlineForm />
            <span className="text-sm">Create User</span>
          </Link>
        </li>

        <li>
          <Link
            to="/setting/manage_moderator"
            className="flex items-center gap-2 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            onClick={handleOnClick}
          >
            <FaUsersCog />
            <span className="text-sm">Manage User</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
