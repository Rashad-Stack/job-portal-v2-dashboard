import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import FieldModal from "../../components/JobsForms/FieldModal";
import Button from "../../components/button/Button";
import InputField from "../../components/input/InputField";
import { getJobFormById, updateJobForm } from "../../api/axios/job-form";
import { getAllCategories } from "../../api/category";

export default function EditForms() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const { register, control, handleSubmit, watch, setValue, getValues } =
    useForm({
      defaultValues: {
        fields: [],
        fieldValues: {
          title: "",
          required: false,
          column: 12,
          type: "text",
          options: [{ radio: { label: "", value: "" } }],
        },
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const fieldValues = watch("fieldValues");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job form data
        const formData = await getJobFormById(id);
        console.log("formdata", formData);
        setFormTitle(formData?.data?.formTitle);
        setValue("fields", formData?.data?.fields);

        // Fetch categories
        const categoryData = await getAllCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [id, setValue]);

  const onChangeFieldValues = (name, value) => {
    // Clear error for the field being changed if the value is non-empty
    if (value && typeof value === "string" && value.trim()) {
      setFieldErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (name === "title") {
          delete newErrors.title;
        } else if (name.startsWith("radio-")) {
          const index = parseInt(name.split("-")[1]);
          delete newErrors[`option-${index}`];
        }
        return newErrors;
      });
    }

    if (name === "column") {
      setValue("fieldValues", {
        ...fieldValues,
        [name]: Number(value),
      });
      return;
    }

    if (name.startsWith("radio-")) {
      const index = parseInt(name.split("-")[1]);
      const updatedOptions = [...fieldValues.options];
      const key = fieldValues.type === "select" ? "select" : "radio";
      updatedOptions[index] = {
        [key]: {
          label: value,
          value: value.toLowerCase().replace(/\s+/g, "_"),
        },
      };
      setValue("fieldValues", {
        ...fieldValues,
        options: updatedOptions,
      });
      return;
    }

    if (name === "addOption") {
      const key = fieldValues.type === "select" ? "select" : "radio";
      const newOption = { [key]: { label: "", value: "" } };
      setValue("fieldValues", {
        ...fieldValues,
        options: [...fieldValues.options, newOption],
      });
      return;
    }

    if (name === "type") {
      const key =
        value === "select" ? "select" : value === "radio" ? "radio" : null;
      setValue("fieldValues", {
        ...fieldValues,
        type: value,
        options: key ? [{ [key]: { label: "", value: "" } }] : [],
      });
      return;
    }

    setValue("fieldValues", {
      ...fieldValues,
      [name]: value,
    });
  };

  const handleAddField = () => {
    const currentFieldValues = getValues("fieldValues");
    const newErrors = {};

    if (!currentFieldValues.title.trim()) {
      newErrors.title = "Field name is required";
    }

    if (
      currentFieldValues.type === "radio" ||
      currentFieldValues.type === "select"
    ) {
      currentFieldValues.options.forEach((option, index) => {
        const key = currentFieldValues.type === "select" ? "select" : "radio";
        if (!option[key]?.label.trim()) {
          newErrors[`option-${index}`] = `Option ${index + 1} name is required`;
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return { errors: newErrors };
    }

    setFieldErrors({});
    append(currentFieldValues);

    setValue("fieldValues", {
      title: "",
      required: false,
      column: 12,
      type: currentFieldValues.type,
      options:
        currentFieldValues.type === "radio" ||
        currentFieldValues.type === "select"
          ? [
              {
                [currentFieldValues.type === "select" ? "select" : "radio"]: {
                  label: "",
                  value: "",
                },
              },
            ]
          : [],
    });
    return null;
  };

  const handleSave = async (data) => {
    try {
      const jobFormData = {
        formTitle,
        fields: data.fields,
      };
      const response = await updateJobForm(id, jobFormData);
      console.log("Job form updated successfully:", response);
      navigate("/jobs/forms");
    } catch (error) {
      console.error("Error updating job form:", error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border bottom-1 border-slate-200 rounded-2xl overflow-hidden">
          <form
            onSubmit={handleSubmit(handleSave)}
            className="space-y-6"
            method="post"
          >
            <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c]">
              <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                Edit Job Post Form
              </h1>
              <div>
                <input
                  id="formTitle"
                  type="text"
                  name="formTitle"
                  required
                  placeholder="Form Title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-fit p-2 border outline-none border-gray-300 rounded-lg text-white my-3"
                />
              </div>
            </div>

            <section className="space-y-4 text-left p-6">
              <div className="border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 pb-2">
                  Basic Information
                </h2>

                <FieldModal title="Add Field" handleAddField={handleAddField}>
                  <div className="flex gap-4 items-center">
                    <div>
                      <InputField
                        label="Field name *"
                        name="fieldValues.title"
                        required
                        register={register}
                        onChange={(e) =>
                          onChangeFieldValues("title", e.target.value)
                        }
                        error={fieldErrors.title}
                      />
                      {(fieldValues.type === "radio" ||
                        fieldValues.type === "select") && (
                        <>
                          {fieldValues.options.map((option, index) => {
                            const key =
                              fieldValues.type === "select"
                                ? "select"
                                : "radio";
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2 mt-2"
                              >
                                <InputField
                                  label={`Option ${index + 1} Name *`}
                                  name={`radio-${index}`}
                                  value={option[key]?.label}
                                  required
                                  onChange={(e) =>
                                    onChangeFieldValues(
                                      `radio-${index}`,
                                      e.target.value
                                    )
                                  }
                                  divClass="flex-grow"
                                  error={fieldErrors[`option-${index}`]}
                                />
                                {fieldValues.options.length > 1 && (
                                  <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => {
                                      const updatedOptions =
                                        fieldValues.options.filter(
                                          (_, i) => i !== index
                                        );
                                      setValue("fieldValues", {
                                        ...fieldValues,
                                        options: updatedOptions,
                                      });
                                    }}
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            );
                          })}
                          <Button
                            label="Add more Option"
                            className="mt-2"
                            onClick={() =>
                              onChangeFieldValues("addOption", true)
                            }
                          />
                        </>
                      )}
                    </div>

                    {/* template dependency */}
                    <div className="w-full flex gap-4 items-center">
                      <div className="space-x-2">
                        <input
                          type="checkbox"
                          {...register("fieldValues.required")}
                          id="required"
                          onChange={(e) =>
                            onChangeFieldValues("required", e.target.checked)
                          }
                        />
                        <label
                          htmlFor="required"
                          className="font-semibold text-gray-700 mr-1"
                        >
                          Required
                        </label>
                      </div>

                      <div>
                        <label
                          htmlFor="column"
                          className="font-semibold text-gray-700 mr-1"
                        >
                          Column
                        </label>
                        <select
                          {...register("fieldValues.column")}
                          id="column"
                          onChange={(e) =>
                            onChangeFieldValues("column", e.target.value)
                          }
                          className="px-2 rounded-lg border-[1px] border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-400 transition duration-200 ease-in-out bg-white text-gray-800 cursor-pointer"
                        >
                          <option value="12">1</option>
                          <option value="6">2</option>
                          <option value="4">3</option>
                        </select>
                      </div>

                      <div className="">
                        <label
                          htmlFor="type"
                          className="font-semibold text-gray-700 mr-1"
                        >
                          Type
                        </label>
                        <select
                          {...register("fieldValues.type")}
                          id="type"
                          onChange={(e) =>
                            onChangeFieldValues("type", e.target.value)
                          }
                          className="px-2 rounded-lg border-[1px] border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-400 transition duration-200 ease-in-out bg-white text-gray-800 cursor-pointer"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="radio">Radio</option>
                          <option value="select">Select</option>
                          <option value="jobCategory">Job Category</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </FieldModal>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    style={{ gridColumn: `span ${item.column}` }}
                  >
                    {item.type === "radio" ? (
                      <div>
                        <label className="block font-semibold mb-2">
                          {item.title} {item.required && "*"}
                        </label>
                        <div className="flex gap-4">
                          {item.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="radio"
                                id={`radio-${index}-${optIndex}`}
                                name={`fields[${index}].radio`}
                                value={option.radio?.value || ""}
                              />
                              <label htmlFor={`radio-${index}-${optIndex}`}>
                                {option.radio?.label || ""}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : item.type === "select" ? (
                      <div>
                        <label className="block font-semibold mb-2">
                          {item.title} {item.required && "*"}
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          name={`fields[${index}].select`}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select {item.title}
                          </option>
                          {item.options.map((option, optIndex) => (
                            <option
                              key={optIndex}
                              value={option.select?.value || ""}
                            >
                              {option.select?.label || ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : item.type === "jobCategory" ? (
                      <div>
                        <label className="block font-semibold mb-2">
                          {item.title} {item.required && "*"}
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          name={`fields[${index}].jobCategory`}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select Job Category
                          </option>
                          {categories?.data?.length > 0 &&
                            categories?.data.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    ) : (
                      <InputField
                        field={item}
                        type={item.type}
                        label={`${item.title} ${item.required ? "*" : ""}`}
                        placeholder={
                          item.type === "date"
                            ? `Select ${item.title}`
                            : `Enter ${item.title}`
                        }
                      />
                    )}
                  </div>
                ))}
              </div>

              {fields.length > 0 && (
                <Button label="Update Form" type="submit" />
              )}
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}
