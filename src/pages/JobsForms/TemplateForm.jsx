import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { createJob } from "../../api/jobs";
import { getJobFormById } from "../../api/axios/job-form";
import { getAllCategories } from "../../api/axios/category";
import TextEditor from "../../components/common/TextEditor";
import InputField from "../../components/input/InputField";
import InputLabel from "../../components/input/InputLabel";
import CustomSelect from "../../components/input/CustomSelect";

const TemplateForm = () => {
  const { id: templateId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      description: "",
      categoryId: "",
      fields: [],
    },
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [templateData, setTemplateData] = useState({});

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setTemplateLoading(true);
        setError("");
        const { data } = await getJobFormById(templateId);
        console.log("template data", data);
        setTemplateData(data);
        setValue("fields", data.fields || []);
      } catch (err) {
        console.error("Failed to fetch Template:", err.message);
        setError("Failed to fetch Template. Please try again later.");
      } finally {
        setTemplateLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId, setValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await getAllCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to fetch Categories:", err.message);
        setError("Failed to fetch Categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderField = (field, index) => {
    const commonProps = {
      key: field.id || index,
      name: `fields.${index}.value`,
      required: field.required,
    };

    switch (field.type) {
      case "text":
        return (
          <InputField
            {...commonProps}
            label={field.title}
            type="text"
            placeholder={`Enter ${field.title}`}
            {...register(`fields.${index}.value`, {
              required: field.required ? `${field.title} is required` : false,
            })}
            error={errors.fields?.[index]?.value?.message}
          />
        );
      case "number":
        return (
          <InputField
            {...commonProps}
            label={field.title}
            type="number"
            placeholder={`Enter ${field.title}`}
            {...register(`fields.${index}.value`, {
              required: field.required ? `${field.title} is required` : false,
              valueAsNumber: true,
            })}
            error={errors.fields?.[index]?.value?.message}
          />
        );
      case "date":
        return (
          <InputField
            {...commonProps}
            label={field.title}
            type="date"
            {...register(`fields.${index}.value`, {
              required: field.required ? `${field.title} is required` : false,
            })}
            error={errors.fields?.[index]?.value?.message}
          />
        );
      case "radio":
        return (
          <div>
            <InputLabel labelTitle={{ title: field.title }} />
            <div className="flex gap-4">
              {field.options?.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`radio-${index}-${optIndex}`}
                    value={option.value}
                    {...register(`fields.${index}.value`, {
                      required: field.required
                        ? `${field.title} is required`
                        : false,
                    })}
                    className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <label
                    htmlFor={`radio-${index}-${optIndex}`}
                    className="text-gray-700 text-sm"
                  >
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
            <InputLabel labelTitle={{ title: field.title }} />
            <Controller
              name={`fields.${index}.value`}
              control={control}
              rules={{
                required: field.required ? `${field.title} is required` : false,
              }}
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  id={`fields.${index}.value`}
                  name={`fields.${index}.value`}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  options={field.options.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                  }))}
                  disabledOption={`Select ${field.title}`}
                />
              )}
            />
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
            <InputLabel labelTitle={{ title: field.title }} />
            <Controller
              name={`fields.${index}.value`}
              control={control}
              rules={{
                required: field.required ? `${field.title} is required` : false,
              }}
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  id={`fields.${index}.value`}
                  name={`fields.${index}.value`}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  options={categories.map((cat) => ({
                    label: cat.name,
                    value: cat.id,
                  }))}
                  disabledOption="Select Job Category"
                />
              )}
            />
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

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError("");

      const fieldMap = {};
      formData.fields.forEach((field) => {
        const fieldTitle = field.title.toLowerCase().replace(/\s+/g, "");
        const fieldValue =
          field.type === "number" ? Number(field.value) : field.value;
        if (field.type === "jobCategory") {
          fieldMap["categoryId"] = fieldValue;
        } else if (
          fieldTitle.includes("title") ||
          fieldTitle.includes("jobtitle")
        ) {
          fieldMap["title"] = fieldValue;
        } else if (
          fieldTitle.includes("company") ||
          fieldTitle.includes("companyname")
        ) {
          fieldMap["companyName"] = fieldValue;
        } else if (
          fieldTitle.includes("hiring") ||
          fieldTitle.includes("numberofhiring")
        ) {
          fieldMap["numberOfHiring"] = fieldValue;
        } else if (fieldTitle.includes("location")) {
          fieldMap["location"] = fieldValue;
        } else if (
          fieldTitle.includes("googleform") ||
          fieldTitle.includes("formlink")
        ) {
          fieldMap["googleForm"] = fieldValue;
        }
      });

      const jobData = {
        title: fieldMap.title || templateData.formTitle || "",
        companyName: fieldMap.companyName || "",
        numberOfHiring: fieldMap.numberOfHiring || 1,
        appliedBy: false,
        location: fieldMap.location || "",
        googleForm: fieldMap.googleForm || "",
        jobType: formData.jobType || "FULL_TIME",
        categoryId: formData.categoryId || fieldMap.categoryId || "",
        jobLevel: formData.jobLevel || "MID_LEVEL",
        jobNature: formData.jobNature || "ONSITE",
        shift: formData.shift || "DAY",
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString()
          : "",
        description: formData.description || "",
        minSalary: Number(formData.minSalary) || 0,
        maxSalary: Number(formData.maxSalary) || 0,
        responsibilities: [],
      };

      const response = await createJob(jobData);
      console.log("Job created successfully:", response);
      navigate("/jobs/read");
    } catch (err) {
      console.error("Failed to create job:", err.message);
      setError("Failed to create job. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c]">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              Create New Job Post
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {templateLoading && (
              <div className="text-center">Loading template...</div>
            )}

            <div className="space-y-4 text-left">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Basic Information
              </h2>
              <div className="grid grid-cols-12 gap-4">
                {templateData.fields?.map((field, index) => (
                  <div
                    key={index}
                    style={{ gridColumn: `span ${field.column}` }}
                  >
                    {renderField(field, index)}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Job category is required" }}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <InputLabel labelTitle={{ title: "Job Category" }} />
                    <CustomSelect
                      id="categoryId"
                      name="categoryId"
                      value={value || ""}
                      onChange={(e) => onChange(e.target.value)}
                      options={categories.map((cat) => ({
                        label: cat.name,
                        value: cat.id,
                      }))}
                      disabledOption="Select Job Category"
                    />
                    {errors.categoryId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              <Controller
                name="description"
                control={control}
                rules={{ required: "Job description is required" }}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <InputLabel labelTitle={{ title: "Job Description" }} />
                    <TextEditor
                      name="description"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      tab="write"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || templateLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#2d9134] to-[#2d9134] text-white font-medium rounded-lg hover:from-[#2d9134] hover:to-[#126918] focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Job Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;