import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { getJobFormById, updateJobForm } from "../../api/axios/job-form";
import { getAllCategories } from "../../api/category";

export default function EditForms() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    mode: "onChange",
    defaultValues: {
      fields: [],
      newField: {
        title: "",
        required: false,
        column: 12,
        type: "text",
        options: [{ label: "", value: "" }],
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const newFieldValues = watch("newField");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = await getJobFormById(id);
        setFormTitle(formData?.data?.formTitle);

        reset({
          fields: formData?.data?.fields || [],
          newField: {
            title: "",
            required: false,
            column: 12,
            type: "text",
            options: [{ label: "", value: "" }],
          },
        });

        const categoryData = await getAllCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [id, reset]); // Depend on id and reset from react-hook-form

  const handleAddField = () => {
    const currentNewFieldValues = getValues("newField");
    const newErrors = {};

    if (!currentNewFieldValues.title.trim()) {
      newErrors.title = "Field name is required";
    }

    if (
      currentNewFieldValues.type === "radio" ||
      currentNewFieldValues.type === "select"
    ) {
      currentNewFieldValues.options.forEach((option, index) => {
        if (!option.label.trim()) {
          newErrors[`option-${index}`] = `Option ${index + 1} name is required`;
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      // Display errors (you'd need a way to show these in your modal)
      console.error("Validation errors:", newErrors);
      return; // Prevent adding the field if there are errors
    }

    append(currentNewFieldValues);
    setIsModalOpen(false); // Close modal after adding field
    reset({
      ...getValues(), // Keep existing fields
      newField: {
        title: "",
        required: false,
        column: 12,
        type: newFieldValues.type, // Keep the last selected type
        options:
          newFieldValues.type === "radio" || newFieldValues.type === "select"
            ? [{ label: "", value: "" }]
            : [],
      },
    });
  };

  const handleSave = async (data) => {
    try {
      const formattedFields = data.fields.map((field) => {
        return { ...field, options: field.options || [] }; // Ensure options is always an array
      });

      const jobFormData = {
        formTitle,
        fields: formattedFields,
      };
      const response = await updateJobForm(id, jobFormData);
      console.log("Job form updated successfully:", response);
      if (response.success) {
        // Assuming success is a property in your response
        navigate("/jobs/forms");
      } else {
        console.error("Update failed:", response);
        // Handle API errors
      }
    } catch (error) {
      console.error("Error updating job form:", error);
      // Handle network or other errors
    }
  };

  const renderField = (field, index) => {
    console.log("field", field);
    const commonProps = {
      key: field.id || index,
      id: field.name, // Using name as ID, ensure names are unique if needed
      ...register(`fields.${index}.value`, {
        // Register the value of the field
        required: field.required ? `${field.title} is required` : false,
        valueAsNumber: field.type === "number",
      }),
      className:
        "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
    };

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder={`Enter ${field.title}`}
            {...commonProps}
          />
        );
      case "number":
        return (
          <input
            type="number"
            placeholder={`Enter ${field.title}`}
            {...commonProps}
          />
        );
      case "date":
        return <input type="date" {...commonProps} />;
      case "radio":
        return (
          <div className="flex gap-4">
            {field &&
              field?.options.length > 0 &&
              field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`radio-${index}-${optIndex}`}
                    value={option.value}
                    {...register(`fields.${index}.value`, {
                      // Register value on the parent field name
                      required: field.required
                        ? `${field.title} is required`
                        : false,
                    })}
                  />
                  <label
                    htmlFor={`radio-${index}-${optIndex}`}
                    className="text-gray-700 text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
          </div>
        );
      case "select":
        return (
          <select {...commonProps}>
            <option value="">Select {field.title}</option>
            {field.options.map((option, optIndex) => (
              <option key={optIndex} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "jobCategory":
        return (
          <select {...commonProps}>
            <option value="">Select Job Category</option>
            {categories?.data?.length > 0 &&
              categories?.data.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c]">
              <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                Edit Job Post Form
              </h1>
              <div>
                <input
                  id="formTitle"
                  type="text"
                  required
                  placeholder="Form Title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-fit p-2 border outline-none border-gray-300 rounded-lg text-gray-800 my-3"
                />
              </div>
            </div>

            <section className="space-y-4 text-left p-6">
              <div className="border-b pb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Form Fields
                </h2>
                {/* Replace FieldModal with a simple button that toggles a modal state */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                  Add Field
                </button>

                {/* Simple Modal Implementation */}
                {isModalOpen && (
                  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                      <h3 className="text-lg font-bold mb-4">Add New Field</h3>
                      <div className="flex flex-col gap-4">
                        <div>
                          <label
                            htmlFor="newFieldTitle"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Field name *
                          </label>
                          <input
                            type="text"
                            id="newFieldTitle"
                            {...register("newField.title", {
                              required: "Field name is required",
                            })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                          {errors.newField?.title && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.newField.title.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="newFieldType"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            id="newFieldType"
                            {...register("newField.type")}
                            className="w-full p-2 border border-gray-300 rounded-md">
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Options
                            </label>
                            {newFieldValues.options.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 mb-2">
                                <input
                                  type="text"
                                  {...register(
                                    `newField.options.${index}.label`,
                                    {
                                      required: `Option ${
                                        index + 1
                                      } name is required`,
                                    }
                                  )}
                                  placeholder={`Option ${index + 1}`}
                                  className="flex-grow p-2 border border-gray-300 rounded-md"
                                />
                                {/* You might want to generate value automatically or add an input for it */}
                                {errors.newField?.options?.[index]?.label && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {
                                      errors.newField.options[index].label
                                        .message
                                    }
                                  </p>
                                )}
                                {newFieldValues.options.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedOptions =
                                        newFieldValues.options.filter(
                                          (_, i) => i !== index
                                        );
                                      setValue(
                                        "newField.options",
                                        updatedOptions
                                      );
                                    }}
                                    className="text-red-500 hover:text-red-700 text-lg leading-none">
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
                              className="mt-2 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 text-sm">
                              Add Option
                            </button>
                          </div>
                        )}

                        <div>
                          <label
                            htmlFor="newFieldColumn"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Column
                          </label>
                          <select
                            id="newFieldColumn"
                            {...register("newField.column", {
                              valueAsNumber: true,
                            })}
                            className="w-full p-2 border border-gray-300 rounded-md">
                            <option value={12}>1</option>
                            <option value={6}>2</option>
                            <option value={4}>3</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="newFieldRequired"
                            {...register("newField.required")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="newFieldRequired"
                            className="text-sm font-medium text-gray-700">
                            Required
                          </label>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                          Cancel
                        </button>
                        <button
                          type="button" // Changed to button to prevent form submission
                          onClick={handleAddField}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                          Add Field
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-12 gap-4">
                {fields.length > 0 &&
                  fields.map((item, index) => (
                    <div
                      key={item.id}
                      style={{ gridColumn: `span ${item.column}` }}
                      className="p-4 border border-gray-200 rounded-md relative group" // Added relative and group for delete button positioning
                    >
                      {/* Delete Field Button */}
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${item.title} field`}>
                        ✕
                      </button>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {item.title}{" "}
                        {item.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      {renderField(item, index)}
                      {errors.fields?.[index]?.value && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fields[index].value.message}
                        </p>
                      )}
                    </div>
                  ))}
              </div>

              {fields.length > 0 && (
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                  Update Form
                </button>
              )}
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
