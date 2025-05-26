import React, { useEffect, useState } from "react";
import { Link } from "react-router"; 
import Swal from "sweetalert2";
import { getAllUsers } from "../../api/auth";
import { UserTable } from "../../components/user-management/UserTable";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        const allUsers = response?.data;

        const filteredUsers = allUsers.filter(
          (user) => user?.role !== "ADMIN"
        );
        console.log("filteredUsers", filteredUsers);

        setUsers(filteredUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 py-6 ">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center pb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
            All Users
          </h1>
          <Link
            to="/moderator/register"
            className="mt-4 sm:mt-0 text-white bg-green-600 font-medium rounded-[8px] text-sm px-5 py-2.5 text-center hover:bg-green-700 transition-colors"
          >
            Add User
          </Link>
        </div>

        {/* user table */}
        <UserTable
          users={users}
          isLoading={loading}
          error={error?.message ? "" : undefined}
          setUsers={setUsers}
        />
      </div>
    </div>
  );
}