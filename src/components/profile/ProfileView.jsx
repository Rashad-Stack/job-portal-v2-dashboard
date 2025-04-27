import React, { useEffect, useState } from "react";
import Button from "./Button";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

const ProfileView = ({ profile, onEdit }) => {
  const [userInfo, setUserInfo] = useState(null); // initialize as null

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // decode token
        setUserInfo(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Function to capitalize the first letter of the name
  const capitalizeFirstLetter = (name) => {
    if (!name) return ""; // Return an empty string if the name is falsy
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  if (!userInfo) {
    // Show a loading message or spinner while user info is being fetched
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:max-w-4xl bg-white shadow rounded-[8px]">
      <div className="sm:flex gap-[60px] justify-start items-center p-10 grid grid-cols-2 divide-x-2">
        <div className="sm:mb-0 mb-10">
          <img
            src={profile?.avatar || "default-avatar.jpg"} // Fallback to default avatar if not provided
            className="w-[200px] h-[200px] rounded-full"
            alt="profile image"
          />
        </div>
        <div className="pl-[60px]">
          <div className="flex gap-2 items-center text-lg">
            <FaRegUser />
            <p>{capitalizeFirstLetter(userInfo?.name)}</p>{" "}
            {/* Capitalize name */}
          </div>

          <div className="flex gap-2 items-center text-lg">
            <MdOutlineAlternateEmail />
            <p>{userInfo?.email || "No email provided"}</p>{" "}
            {/* Fallback for email */}
          </div>

          <Button onClick={onEdit} className="mt-4 bg-[#00ab0c] text-lg">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
