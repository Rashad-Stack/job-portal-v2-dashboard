import React, { useEffect, useState } from "react";
import { GoTrash } from "react-icons/go";
import { MdMarkEmailRead } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";

export default function Moderators() {
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchModerators();
  }, []);

  const fetchModerators = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get("http://localhost:3000/api/v1/user/all");
      setModerators(data.data || []);
    } catch (err) {
      console.error("Failed to fetch moderators:", err.message);
      setError("Failed to fetch moderators. Please try again later.");
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
    <div className="px-4 sm:px-6 md:px-10 py-6">
      <h1 className="text-center pb-6 text-2xl sm:text-3xl font-semibold">
        All Moderators
      </h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="space-y-6">
        {moderators
          .filter((mod) => mod.role === "Modarator")
          .map((mod) => (
            <div
              key={mod.id}
              className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center w-full">
                <div className="flex justify-center items-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#9FB3DF] text-[#333] text-xl font-bold">
                  {capitalizeFirstLetter(mod?.name?.charAt(0))}
                </div>

                <div className="flex flex-col sm:ml-6 mt-3 sm:mt-0">
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {capitalizeFirstLetter(mod?.name)}
                  </span>

                  <div className="mt-2 flex flex-col sm:flex-row gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <MdMarkEmailRead />
                      <a
                        href={`mailto:${mod.email}`}
                        className=" hover:underline break-all"
                      >
                        {mod.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-1V1m-1 11h-5v5h5v-5z" />
                      </svg>
                      <span>
                        {new Date(mod.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute right-4 top-4 sm:static sm:mt-0 mt-2 flex justify-end cursor-pointer text-red-600 hover:text-red-800"
                onClick={() => handleDelete(mod.id)}
                title="Delete Moderator"
              >
                <GoTrash size={24} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
