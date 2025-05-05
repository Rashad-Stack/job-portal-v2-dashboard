import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Button from "../../components/button/Button";
import { createCategory, getAllCategories } from "../../api/category";

export default function Category() {
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch job:", err.message);
        setError("Failed to fetch job. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  function handleEdit(category) {
    setIsEditing(true);
    setSelectedCategory(category);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setSelectedCategory(null);
  }

  function handleSave() {
    setIsEditing(false);
    // You should call an API here to update the category
    Swal.fire({
      icon: "success",
      title: "Category name updated!",
    });
  }

  const handleAdd = () => {
    Swal.fire({
      title: "Please Enter Category Name",
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
          const { data } = await createCategory({ name });
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
          title: `Category "${result.value.name}" added successfully!`,
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      }
    });
  };

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
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100 pt-4">
          All Categories
        </h1>

        <div className="flex justify-end my-6 w-full">
          <Button
            label="Add New"
            onClick={handleAdd}
            variant="success"
            className="font-normal"
          />
        </div>

        {categories.map((category) => (
          <div
            key={category.id}
            className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 mt-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col sm:ml-6 mt-3 sm:mt-0">
              {isEditing && selectedCategory?.id === category.id ? (
                <input
                  type="text"
                  value={selectedCategory.name}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full border-none outline-none bg-gray-100 dark:bg-gray-700 rounded px-3 py-1 text-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-[#00ab0c]"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-800 dark:text-white">
                  {category.name}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {isEditing && selectedCategory?.id === category.id ? (
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
              ) : (
                <>
                  <Button
                    label="Edit"
                    onClick={() => handleEdit(category)}
                    variant="primary"
                  />
                  <Button
                    label="Delete"
                    onClick={handleDelete}
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
