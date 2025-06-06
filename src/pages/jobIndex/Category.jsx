import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Button from "../../components/button/Button";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../api/category";

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

  async function handleSave() {
    if (!selectedCategory || !selectedCategory.name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Category name cannot be empty.",
      });
      return;
    }
    setIsEditing(false);
    const id = selectedCategory.id;
    const name = selectedCategory.name;

    try {
      const updatedData = await updateCategory({
        id,
        name,
      });
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === selectedCategory.id ? updatedData : category
        )
      );

      Swal.fire({
        icon: "success",
        title: "Category updated successfully!",
      });

      setSelectedCategory(null);
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
        deleteCategory(id)
          .then(() => {
            Swal.fire("Deleted!", "The category has been deleted.", "success");
          })
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was a problem deleting the category.",
              "error"
            );
          });
      }
    });
  }
  return (
    <div className="min-h-screen  py-8 px-4">
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

        {categories.reverse().map((category) => (
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
                <span className="text-lg text-left font-semibold text-gray-800 dark:text-white">
                  {category.name.charAt(0).toUpperCase() +
                    category.name.slice(1)}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {isEditing && selectedCategory?.id === category.id ? (
                <>
                  <Button
                    label="Save"
                    onClick={() =>
                      handleSave(selectedCategory.id, selectedCategory.name)
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
                    onClick={() => handleEdit(category)}
                    variant="primary"
                  />
                  <Button
                    label="Delete"
                    onClick={() => handleDelete(category.id)}
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
