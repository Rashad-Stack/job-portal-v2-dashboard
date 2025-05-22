import React, { useEffect, useState } from "react";
import { GoTrash } from "react-icons/go";
import { MdMarkEmailRead } from "react-icons/md";
import { Link } from "react-router"; // Added Link import
import Swal from "sweetalert2";
import { deleteUser, getAllUsers } from "../../../api/auth";

export default function Moderators() {
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchModerators = async () => {
      try {
        const response = await getAllUsers();
        const allUsers = response.data;

        const filteredModerators = allUsers.filter(
          (user) => user.role === "MODERATOR"
        );
        console.log("filteredModerators", filteredModerators);

        setModerators(filteredModerators);
      } catch (err) {
        console.error("Error fetching moderators:", err);
        setError("Failed to load moderators.");
      } finally {
        setLoading(false);
      }
    };

    fetchModerators();
  }, []);

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
        await deleteUser(id);

        setModerators((prev) => prev.filter((mod) => mod.id !== id));
        Swal.fire("Deleted!", "Moderator has been removed.", "success");
      } catch (err) {
        console.error("Delete failed:", err.message);
        Swal.fire("Error", "Failed to delete moderator.", "error");
      }
    }
  };

  const capitalizeFirstLetter = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 py-6 ">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center pb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
            All Moderators
          </h1>
          <Link
            to="/moderator/register"
            className="mt-4 sm:mt-0 text-white bg-green-600 font-medium rounded-[8px] text-sm px-5 py-2.5 text-center hover:bg-green-700 transition-colors"
          >
            Create New Moderator
          </Link>
        </div>

        {loading && (
          <div className="text-center py-4 text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        )}
        {error && (
          <div className="text-center py-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4 mt-3 sm:mt-2 md:mt-4 lg:mt-10">
          {moderators
            .filter((mod) => mod.role === "MODERATOR")
            .map((mod) => (
              <div
                key={mod.id}
                className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row text-left sm:items-center w-full gap-4">
                  <div className="flex justify-center items-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#00ab0c] text-white text-4xl font-bold">
                    {capitalizeFirstLetter(mod?.name?.charAt(0))}
                  </div>

                  <div className="flex flex-col sm:ml-2 mt-3 sm:mt-0">
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {capitalizeFirstLetter(mod?.name)}
                    </span>

                    <div className="mt-2 flex flex-col sm:flex-row gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <MdMarkEmailRead className="text-gray-500 dark:text-gray-400" />
                        <a
                          href={`mailto:${mod.email}`}
                          className="hover:underline break-all text-gray-700 dark:text-gray-300 hover:text-[#00ab0c] dark:hover:text-[#00ab0c]"
                        >
                          {mod.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-5 w-5 text-gray-500 dark:text-gray-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-1V1m-1 11h-5v5h5v-5z" />
                        </svg>
                        <span>
                          {mod.createdAt
                            ? new Date(mod.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="absolute right-4 top-4 sm:static sm:mt-0 mt-2 flex justify-end cursor-pointer text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500 transition-colors"
                  onClick={() => handleDelete(mod.id)}
                  title="Delete Moderator"
                  aria-label="Delete moderator"
                >
                  <GoTrash size={24} />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}