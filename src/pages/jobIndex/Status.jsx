import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from '../../components/button/Button';

export default function Status() {
  const [isEditing, setIsEditing] = useState(false);
  const [statusName, setStatusName] = useState('Active');

  function handleEdit() {
    setIsEditing(true);
  }

  function handleInputChange(e) {
    setStatusName(e.target.value);
  }

  function handleSave() {
    setIsEditing(false);
    Swal.fire({
      icon: 'success',
      title: 'Category name updated!',
    });
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }
  function handleAdd() {
    Swal.fire({
      title: 'Please Enter Status Name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      showLoaderOnConfirm: true,
      preConfirm: async (login) => {
        try {
          const githubUrl = `https://api.github.com/users/${login}`;
          const response = await fetch(githubUrl);
          if (!response.ok) {
            return Swal.showValidationMessage(`${JSON.stringify(await response.json())}`);
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
          confirmButtonColor: '#3085d6',
        });
      }
    });
  }

  function handleDelete() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      }
    });
  }
  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100 pt-4">
          Status
        </h1>

        <div className="flex justify-end my-6 w-full">
          <Button label="Add New" onClick={handleAdd} variant="success" className="font-normal" />
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg  border border-gray-200 dark:border-gray-700">
          <div className="w-full">
            <div className="flex flex-col sm:ml-1 mt-3 sm:mt-0">
              {isEditing ? (
                <input
                  type="text"
                  value={statusName}
                  onChange={handleInputChange}
                  className="w-full border-none outline-none bg-gray-100 dark:bg-gray-700 rounded px-3 py-1 text-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-[#00ab0c]"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  {statusName}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button
                  label="Edit"
                  onClick={handleEdit}
                  variant="primary"
                  className="font-normal"
                />
                <Button
                  label="Delete"
                  onClick={handleDelete}
                  variant="danger"
                  className="font-normal"
                />
              </>
            ) : (
              <>
                <Button
                  label="Save"
                  onClick={handleSave}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
