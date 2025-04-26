import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get("http://localhost:3000/api/v1/user/all");
      setUsers(data.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err.message);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/user/delete/${id}`);
        setUsers((prev) => prev.filter((user) => user.id !== id));
        Swal.fire("Deleted!", "User has been removed.", "success");
      } catch (err) {
        console.error("Delete failed:", err.message);
        Swal.fire("Error", "Failed to delete user.", "error");
      }
    }
  };

  const capitalizeFirstLetter = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white text-black p-6 sm:p-8 rounded-2xl shadow-lg">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Manage Users
        </h1>

        {/* Add Button */}
        <div className="flex justify-center mb-6">
          <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full">
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:underline"
            >
              {" "}
              <FaPlus />
            </Link>
          </button>
        </div>

        {/* Loading and Error */}
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-3 bg-green-500 p-4 rounded-t-md font-semibold text-white">
          <div>Name</div>
          <div>Email</div>
          <div>Delete</div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col sm:grid sm:grid-cols-3 items-center bg-gray-100 p-4 rounded-md shadow-sm"
            >
              {/* Name */}
              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                <FaRegUser className="text-green-600" />
                <span className="font-medium">
                  {capitalizeFirstLetter(user.name)}
                </span>
              </div>

              {/* Email */}
              <div className="text-center sm:text-left mb-2 sm:mb-0 break-words">
                {user.email}
              </div>

              {/* Delete */}
              <div className="flex justify-center">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-green-500 hover:text-green-700"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
