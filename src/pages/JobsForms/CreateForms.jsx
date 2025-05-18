import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createJobForm } from "../../api/axios/job-form"; // Assuming this is a valid API call
import { getAllCategories } from "../../api/category"; // Assuming this is a valid API call

// Assuming these are basic button and input field components you might have elsewhere,
// or they will be replaced by native elements with Tailwind classes.
// For this refactor, we will replace them with native elements and Tailwind classes.
// import Button from "../../components/button/Button";
// import InputField from "../../components/input/InputField";
// import FieldModal from "../../components/JobsForms/FieldModal";

export default function CreateForms() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage the modal

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      formTitle: "",
      fields: [],
      newField: {
        title: "",
        required: false,
        column: 12,
        type: "text",
        options: [{ label: "", value: "" }], // Simplified options structure
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const newFieldValues = watch("newField");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleAddField = () => {
    const currentNewFieldValues = getValues("newField");
    const { title, type, options, ...rest } = currentNewFieldValues;

    if (!title.trim()) {
      // Basic validation for field title
      // react-hook-form validation can be added here more robustly
      alert("Field name is required.");
      return;
    }

    const fieldToAdd = {
      title: title.trim(),
      type,
      ...rest,
    };

    if (type === "radio" || type === "select") {
      fieldToAdd.options = options.map((option) => ({
        label: option.label.trim(),
        value: option.label.trim().toLowerCase().replace(/\s+/g, "_"), // Auto-generate value
      }));

      // Basic validation for options
      const hasEmptyOption = fieldToAdd.options.some((option) => !option.label);
      if (hasEmptyOption) {
        alert("All options must have a label.");
        return;
      }
    } else {
      fieldToAdd.options = []; // Ensure options is an empty array for other types
    }

    append(fieldToAdd);
    reset({
      ...getValues(), // Keep other form values
      newField: {
        // Reset only the newField section
        title: "",
        required: false,
        column: 12,
        type: "text",
        options: [{ label: "", value: "" }],
      },
    });
    setIsModalOpen(false); // Close modal after adding
  };

  const handleSave = async (data) => {
    try {
      const jobFormData = {
        formTitle: data.formTitle,
        fields: data.fields,
      };
      console.log("payload", jobFormData);
      const response = await createJobForm(jobFormData);
      console.log("Job form created successfully:", response);
      if (response.success && response.data) {
        navigate("/jobs/forms");
      }
    } catch (error) {
      console.error("Error creating job form:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const renderDynamicField = (field, index) => {
    // Basic styling with Tailwind classes
    const baseClasses =
      "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    switch (field.type) {
      case "text":
        return (
          <div>
            <label className={labelClasses}>
              {field.title} {field.required && "*"}
            </label>
            <input
              type="text"
              className={baseClasses}
              placeholder={`Enter ${field.title}`}
              {...register(`fields[${index}].value`, {
                required: field.required ? `${field.title} is required` : false,
              })}
            />
            {errors.fields?.[index]?.value && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fields[index].value.message}
              </p>
            )}
          </div>
        );
      case "number":
        return (
          <div>
            <label className={labelClasses}>
              {field.title} {field.required && "*"}
            </label>
            <input
              type="number"
              className={baseClasses}
              placeholder={`Enter ${field.title}`}
              {...register(`fields[${index}].value`, {
                required: field.required ? `${field.title} is required` : false,
                valueAsNumber: true,
              })}
            />
            {errors.fields?.[index]?.value && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fields[index].value.message}
              </p>
            )}
          </div>
        );
      case "date":
        return (
          <div>
            <label className={labelClasses}>
              {field.title} {field.required && "*"}
            </label>
            <input
              type="date"
              className={baseClasses}
              {...register(`fields[${index}].value`, {
                required: field.required ? `${field.title} is required` : false,
              })}
            />
            {errors.fields?.[index]?.value && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fields[index].value.message}
              </p>
            )}
          </div>
        );
      case "radio":
        return (
          <div>
            <label className={labelClasses}>
              {field.title} {field.required && "*"}
            </label>
            <div className="flex flex-wrap gap-4">
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center">
                  <input
                    type="radio"
                    id={`radio-${index}-${optIndex}`}
                    value={option.value}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    {...register(`fields[${index}].value`, {
                      required: field.required
                        ? `${field.title} is required`
                        : false,
                    })}
                  />
                  <label
                    htmlFor={`radio-${index}-${optIndex}`}
                    className="ml-2 text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {errors.fields?.[index]?.value && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fields[index].value.message}
              </p>
            )}
          </div>
        );
      case "select":
        return (
          <div>
            <label className={labelClasses}>
              {field.title} {field.required && "*"}
            </label>
            <select
              className={baseClasses}
              {...register(`fields[${index}].value`, {
                required: field.required ? `${field.title} is required` : false,
              })}>
              <option value="">Select {field.title}</option>
              {field.options.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.fields?.[index]?.value && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fields[index].value.message}
              </p>
            )}
          </div>
        );
      case "jobCategory":
        return (
          <div>
            <label className={labelClasses}>
              {field.title} {field.required && "*"}
            </label>
            <select
              className={baseClasses}
              {...register(`fields[${index}].value`, {
                required: field.required ? `${field.title} is required` : false,
              })}>
              <option value="">Select Job Category</option>
              {categories?.data?.length > 0 &&
                categories.data.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            {errors.fields?.[index]?.value && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fields[index].value.message}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
          <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-green-500 to-green-600">
              <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                Create New Job Post Form
              </h1>
              <div className="mt-4">
                <label
                  htmlFor="formTitle"
                  className="block text-sm font-medium text-white mb-1">
                  Form Title
                </label>
                <input
                  id="formTitle"
                  type="text"
                  placeholder="Form Title"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("formTitle", {
                    required: "Form title is required",
                  })}
                />
                {errors.formTitle && (
                  <p className="text-red-200 text-xs mt-1">
                    {errors.formTitle.message}
                  </p>
                )}
              </div>
            </div>

            <section className="space-y-4 text-left p-6">
              <div className="border-b pb-2 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Form Fields
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                  Add Field
                </button>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className={`col-span-12 md:col-span-${item.column} relative border border-gray-200 rounded-lg p-4`}>
                    {renderDynamicField(item, index)}
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => remove(index)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {fields.length > 0 && (
                <div className="mt-6">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                    Save This Template
                  </button>
                </div>
              )}
            </section>
          </form>
        </div>
      </div>

      {/* Field Modal (Simplified) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Field</h3>
            <form onSubmit={handleSubmit(handleAddField)} className="space-y-4">
              <div>
                <label
                  htmlFor="newField.title"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name *
                </label>
                <input
                  type="text"
                  id="newField.title"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("newField.title", {
                    required: "Field name is required",
                  })}
                />
                {errors.newField?.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.newField.title.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="newField.type"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Field Type
                </label>
                <select
                  id="newField.type"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("newField.type")}>
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="radio">Radio</option>
                  <option value="select">Select</option>
                  <option value="jobCategory">Job Category</option>
                </select>
              </div>

              {(newFieldValues.type === "radio" ||
                newFieldValues.type === "select") && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Options *
                  </label>
                  {newFieldValues.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Option ${index + 1} Label`}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register(`newField.options[${index}].label`, {
                          required: "Option label is required",
                        })}
                      />
                      {newFieldValues.options.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const updatedOptions =
                              newFieldValues.options.filter(
                                (_, i) => i !== index
                              );
                            setValue("newField.options", updatedOptions);
                          }}>
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setValue("newField.options", [
                        ...newFieldValues.options,
                        { label: "", value: "" },
                      ])
                    }
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
                    Add Option
                  </button>
                </div>
              )}

              <div>
                <label
                  htmlFor="newField.column"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Column Size
                </label>
                <select
                  id="newField.column"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("newField.column", { valueAsNumber: true })}>
                  <option value="12">1</option>
                  <option value="6">2</option>
                  <option value="4">3</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newField.required"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  {...register("newField.required")}
                />
                <label
                  htmlFor="newField.required"
                  className="ml-2 text-sm text-gray-700">
                  Required
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Add Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
