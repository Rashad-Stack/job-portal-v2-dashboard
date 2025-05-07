import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Button from "../../components/button/Button";
import {
  createStatus,
  deleteStatus,
  getAllStatus,
  updateStatus,
} from "../../api/status";

export default function Status() {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    const fetchStatuss = async () => {
      try {
        setLoading(true);
        const { data } = await getAllStatus();
        setStatus(data);
      } catch (err) {
        console.error("Failed to fetch Status:", err.message);
        setError("Failed to fetch Status. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatuss();
  }, []);
  function handleEdit(status) {
    setIsEditing(true);
    setSelectedStatus(status);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    selectedStatus(null);
  }

  async function handleSave() {
    if (!selectedStatus || !selectedStatus.name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Status name cannot be empty.",
      });
      return;
    }
    setIsEditing(false);
    const id = selectedStatus.id;
    const name = selectedStatus.name;

    try {
      const updatedData = await updateStatus({
        id,
        name,
      });
      setStatus((prevStatus) =>
        prevStatus.map((status) =>
          status.id === selectedStatus.id ? updatedData : status
        )
      );

      Swal.fire({
        icon: "success",
        title: "Status updated successfully!",
      });

      setSelectedStatus(null);
    } catch (error) {
      const message = error.message || "Something went wrong";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Request failed: ${message}`,
      });
    }
  }

  const handleAdd = () => {
    Swal.fire({
      title: "Please Enter Status Name",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      showLoaderOnConfirm: true,
      preConfirm: async (name) => {
        try {
          const { data } = await createStatus({ name });
          return data;
        } catch (error) {
          const message =
            error.response?.data?.message || "Something went wrong";
          Swal.showValidationMessage(`Request failed: ${message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Status "${result.value.name}" added successfully!`,
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      }
      window.location.reload();
    });
  };

  function handleDelete(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStatus(id)
          .then(() => {
            Swal.fire("Deleted!", "The Status has been deleted.", "success");
          })
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was a problem deleting the Status.",
              "error"
            );
          });
      }
    });
  }
  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100 pt-4">
          All Status
        </h1>

        <div className="flex justify-end my-6 w-full">
          <Button
            label="Add New"
            onClick={handleAdd}
            variant="success"
            className="font-normal"
          />
        </div>

        {status.map((item) => (
          <div
            key={item.id}
            className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 mt-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col sm:ml-6 mt-3 sm:mt-0">
              {isEditing && selectedStatus?.id === item.id ? (
                <input
                  type="text"
                  value={selectedStatus.name}
                  onChange={(e) =>
                    setSelectedStatus({
                      ...selectedStatus,
                      name: e.target.value,
                    })
                  }
                  className="w-full border-none outline-none bg-gray-100 dark:bg-gray-700 rounded px-3 py-1 text-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-[#00ab0c]"
                />
              ) : (
                <span className="text-lg text-left font-semibold text-gray-800 dark:text-white">
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {isEditing && selectedStatus?.id === item.id ? (
                <>
                  <Button
                    label="Save"
                    onClick={() =>
                      handleSave(selectedStatus.id, selectedStatus.name)
                    }
                    className="font-normal"
                    variant="success"
                  />

                  <Button
                    label="Cancel"
                    onClick={handleCancelEdit}
                    variant="secondary"
                    className="font-normal bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  />
                </>
              ) : (
                <>
                  <Button
                    label="Edit"
                    onClick={() => handleEdit(item)}
                    variant="primary"
                  />
                  <Button
                    label="Delete"
                    onClick={() => handleDelete(item.id)}
                    variant="danger"
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
