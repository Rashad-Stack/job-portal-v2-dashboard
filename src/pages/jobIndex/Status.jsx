import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../../components/button/Button";

export default function Status() {
  const [isEditing, setIsEditing] = useState(false);
  const [statusName, setStatusName] = useState("Active");

  function handleEdit() {
    setIsEditing(true);
  }

  function handleInputChange(e) {
    setStatusName(e.target.value);
  }

  function handleSave() {
    setIsEditing(false);
    Swal.fire({
      icon: "success",
      title: "Category name updated!",
    });
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }
  function handleAdd() {
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
      preConfirm: async (login) => {
        try {
          const githubUrl = `https://api.github.com/users/${login}`;
          const response = await fetch(githubUrl);
          if (!response.ok) {
            return Swal.showValidationMessage(
              `${JSON.stringify(await response.json())}`
            );
          }
          return response.json();
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `${result.value.login} Category Added Successfully`,
          confirmButtonColor: "#3085d6",
        });
      }
    });
  }

  function handleDelete() {
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
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  }
  return (
    <>
      <h1 className="text-center text-2xl font-semibold text-gray-800 pt-4 ">
        Status
      </h1>
      <div className="flex my-6 w-full justify-end">
        <Button
          label="Add New"
          onClick={handleAdd}
          variant="success"
          className=" font-normal "
        />
      </div>
      <div className="relative flex mt-6 flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-700 p-4 mt-8 rounded-lg shadow-md">
        <div className=" sm:items-center w-full">
          <div className="flex flex-col  sm:ml-6 mt-3 sm:mt-0">
            {isEditing ? (
              <input
                type="text"
                value={statusName}
                onChange={handleInputChange}
                className="border-none outline-0 bg-[#f4f4f4] rounded px-3  py-1 text-lg text-gray-800 dark:text-white"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                {statusName}
              </span>
            )}
          </div>
        </div>

        {!isEditing ? (
          <>
            <Button
              label="Edit"
              onClick={handleEdit}
              variant="primary"
              className=" font-normal "
            />
            <Button
              label="Delete"
              onClick={handleDelete}
              variant="danger"
              className=" font-normal "
            />
          </>
        ) : (
          <>
            <Button
              label="Save"
              onClick={handleSave}
              className=" font-normal "
              variant="success"
            />
            <Button
              label="Cancel"
              onClick={handleCancelEdit}
              variant="secondary"
              className="  bg-[#eeeeee] hover:bg-[#dddddd] font-normal"
            />
          </>
        )}
      </div>
    </>
  );
}
