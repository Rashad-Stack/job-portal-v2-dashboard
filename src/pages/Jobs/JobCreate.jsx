import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import TextEditor from "../../components/common/TextEditor";
import InputField from "../../components/input/InputField";
import InputLabel from "../../components/input/InputLabel";
import Loading from "../../components/loader/Loading";
import CustomSelect from "../../components/input/CustomSelect";
import { createJob, getAllJobs } from "../../api/jobs";
import { getAllJobForms, getJobFormById } from "../../api/job-form";
import { getAllCategories } from "../../api/category";
import DynamicFieldRenderer from "../../components/jobs/DynamicFieldRenderer";

const JobCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const templateId = queryParams.get("templateId");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      companyName: "",
      numberOfHiring: "",
      appliedByInternal: "false",
      location: "",
      googleForm: "",
      jobType: "FULL_TIME",
      categoryId: "",
      jobLevel: "MID_LEVEL",
      jobNature: "ONSITE",
      shift: "DAY",
      deadline: "",
      description: "",
      minSalary: "",
      maxSalary: "",
      fields: [],
      templateId: "",
    },
  });

  const appliedByInternal = watch("appliedByInternal");
  const templateIdWatch = watch("templateId");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);

  const [category, setCategory] = useState([]);
  const [templateData, setTemplateData] = useState({});
  const [allTemplates, setAllTemplates] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Fetch all template forms
  useEffect(() => {
    const fetchAllTemplate = async () => {
      try {
        setTemplateLoading(true);
        setError("");
        const { data } = await getAllJobForms();
        console.log("all templates", data);
        setAllTemplates(data);
      } catch (err) {
        console.error("Failed to fetch Template:", err.message);
        setError("Failed to fetch Template. Please try again later.");
      } finally {
        setTemplateLoading(false);
      }
    };

    fetchAllTemplate();
  }, []);

  // Fetch template data by ID
  useEffect(() => {
    const fetchTemplate = async () => {
      if (templateId) {
        try {
          setTemplateLoading(true);
          setError("");
          const { data } = await getJobFormById(templateId);
          setTemplateData(data);
          setValue("appliedByInternal", "true", { shouldValidate: true });
        } catch (err) {
          console.error("Failed to fetch Template:", err.message);
          setError("Failed to fetch Template. Please try again later.");
        } finally {
          setTemplateLoading(false);
        }
      }
    };

    fetchTemplate();
  }, [templateId, setValue]);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await getAllCategories();
        setCategory(data || []);
      } catch (err) {
        console.error("Failed to fetch Categories:", err.message);
        setError("Failed to fetch Categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // fetch all jobs
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setLoading(true);
        const { data } = await getAllJobs();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllJobs();
  }, []);

  // Function to check if a template form is expired
  const isFormExpired = (formId) => {
    return jobs.some((job) => job.templateId === formId);
  };

  const onSubmit = async (data) => {
    console.log("form data", data);
    setError("");
    setLoading(true);

    try {
      const dataToSend = { ...data };

      // prepare fields data conditionally
      if (data.fields && templateData.fields) {
        dataToSend.fields = templateData.fields.reduce((acc, field) => {
          console.log("field", field);
          if (field.title) {
            acc[field.title.toLowerCase()] = field;
          }
          return acc;
        }, {});
      } else if (appliedByInternal === "false") {
        delete dataToSend.fields;
      } else {
        dataToSend.fields = allTemplates.reduce((acc, template) => {
          if (template.id === templateIdWatch) {
            template.fields.forEach((field) => {
              if (field.title) {
                acc[field.title.toLowerCase()] = field;
              }
            });
          }
          return acc;
        }, {});
      }

      if (!dataToSend.companyName || dataToSend.companyName.trim() === "") {
        delete dataToSend.companyName;
      }

      if (dataToSend.numberOfHiring) {
        dataToSend.numberOfHiring = Number(dataToSend.numberOfHiring);
      }
      if (dataToSend.minSalary) {
        dataToSend.minSalary = Number(dataToSend.minSalary);
      }
      if (dataToSend.maxSalary) {
        dataToSend.maxSalary = Number(dataToSend.maxSalary);
      }

      dataToSend.appliedByInternal = data.appliedByInternal === "true";

      // Only include templateId if it exists and is not empty
      if (templateId || data.templateId) {
        dataToSend.templateId = templateId || data.templateId;
      } else {
        delete dataToSend.templateId;
      }

      console.log("dataToSend", dataToSend);

      await createJob(dataToSend);
      navigate("/jobs/read");
    } catch (error) {
      console.error("Error creating job:", error);
      setError(error.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  if (templateLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border bottom-1 border-slate-200 rounded-2xl overflow-hidden">
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

            {/* Basic Information */}
            <section className="space-y-4 text-left">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Basic Information
              </h2>
              {/* Job Title */}
              <div>
                <InputField
                  label="Job Title *"
                  type="text"
                  {...register("title", { required: "Job Title is required" })}
                  error={errors.title?.message}
                  placeholder="Enter Job Title"
                />
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div>
                  <InputField
                    label="Company Name"
                    type="text"
                    {...register("companyName", {
                      required: "Compony Name is required",
                    })}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <InputField
                    label="Number of Hiring"
                    type="number"
                    {...register("numberOfHiring", {
                      required: "Number of Hiring is required",
                      valueAsNumber: true,
                    })}
                    error={errors.numberOfHiring?.message}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#2d9134]"
                  />
                </div>
                <div className="md:col-span-2">
                  <InputLabel labelTitle={{ title: "Applied By" }} />
                  <div className="space-y-4">
                    {/* Application Method Radio Buttons */}
                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="true"
                          {...register("appliedByInternal", {
                            required: "Please select an application method",
                          })}
                          className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          Internal
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="false"
                          {...register("appliedByInternal", {
                            required: "Please select an application method",
                          })}
                          className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          External
                        </span>
                      </label>
                    </div>
                    {errors.appliedByInternal && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.appliedByInternal.message}
                      </p>
                    )}

                    {/* Template Forms Dropdown */}
                    {appliedByInternal === "true" && !templateId && (
                      <Controller
                        name="templateId"
                        control={control}
                        rules={{ required: "Template is required" }}
                        render={({ field: { onChange, value } }) => (
                          <CustomSelect
                            id="templateId"
                            name="templateId"
                            value={value}
                            onChange={onChange}
                            label="Select Template"
                            options={
                              allTemplates &&
                              allTemplates.map((template) => {
                                const isExpired = isFormExpired(template?.id);
                                if (isExpired) {
                                  return null;
                                }
                                return {
                                  value: template?.id,
                                  label: template?.formTitle,
                                };
                              })
                            }
                            disabledOption="Select Template"
                            error={errors.templateId?.message}
                          />
                        )}
                      />
                    )}

                    {/* Conditional Fields */}
                    {appliedByInternal === "true" && templateIdWatch && (
                      <div className="grid grid-cols-12 gap-4">
                        {allTemplates
                          .find((template) => template.id === templateIdWatch)
                          .fields?.map((field, index) => (
                            <div
                              key={index}
                              style={{ gridColumn: `span ${field.column}` }}
                            >
                              <DynamicFieldRenderer
                                field={field}
                                index={index}
                                register={register}
                                control={control}
                              />
                            </div>
                          ))}
                      </div>
                    )}

                    {appliedByInternal === "true" ? (
                      <div className="grid grid-cols-12 gap-4">
                        {templateData.fields?.map((field, index) => (
                          <div
                            key={index}
                            style={{ gridColumn: `span ${field.column}` }}
                          >
                            <DynamicFieldRenderer
                                field={field}
                                index={index}
                                register={register}
                                control={control}
                              />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <InputField
                          label="Google Form URL"
                          type="text"
                          {...register("googleForm", {
                            required:
                              appliedByInternal === "false"
                                ? "Google Form URL is required for external applications"
                                : false,
                          })}
                          error={errors.googleForm?.message}
                          placeholder="Enter Google Form URL"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <Controller
                  name="jobNature"
                  control={control}
                  rules={{ required: "Job Nature is required" }}
                  render={({ field: { onChange, value } }) => (
                    <div className="space-y-1">
                      <label
                        htmlFor="jobNature"
                        className="block text-sm font-medium text-gray-700 text-start"
                      >
                        Job Nature
                      </label>
                      <CustomSelect
                        id="jobNature"
                        name="jobNature"
                        value={value}
                        onChange={onChange}
                        options={[
                          { value: "ONSITE", label: "On Site" },
                          { value: "REMOTE", label: "Remote" },
                        ]}
                        disabledOption="Select Job Nature"
                        className={errors.jobNature ? "border-red-500" : ""}
                      />
                      {errors.jobNature && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.jobNature.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="jobLevel"
                  control={control}
                  rules={{ required: "Job Level is required" }}
                  render={({ field: { onChange, value } }) => (
                    <div className="space-y-1">
                      <label
                        htmlFor="jobLevel"
                        className="block text-start text-sm font-medium text-gray-700"
                      >
                        Job Level
                      </label>
                      <CustomSelect
                        id="jobLevel"
                        name="jobLevel"
                        value={value}
                        onChange={onChange}
                        options={[
                          { value: "ENTRY_LEVEL", label: "Entry Level" },
                          { value: "MID_LEVEL", label: "Mid Level" },
                          { value: "ADVANCED_LEVEL", label: "Advanced Level" },
                          { value: "INTERNSHIP", label: "Intern" },
                        ]}
                        disabledOption="Select Job Level"
                        className={errors.jobLevel ? "border-red-500" : ""}
                      />
                      {errors.jobLevel && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.jobLevel.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="jobType"
                  control={control}
                  rules={{ required: "Job Type is required" }}
                  render={({ field: { onChange, value } }) => (
                    <div className="space-y-1">
                      <label
                        htmlFor="jobType"
                        className="block text-start text-sm font-medium text-gray-700"
                      >
                        Job Type
                      </label>
                      <CustomSelect
                        id="jobType"
                        name="jobType"
                        value={value}
                        onChange={onChange}
                        options={[
                          { value: "FULL_TIME", label: "Full Time" },
                          { value: "PART_TIME", label: "Part Time" },
                          { value: "CONTRACT", label: "Contract" },
                          { value: "INTERNSHIP", label: "Intern" },
                        ]}
                        disabledOption="Select Job Type"
                        className={errors.jobType ? "border-red-500" : ""}
                      />
                      {errors.jobType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.jobType.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </section>

            <section className="space-y-4">
              <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <div>
                  <Controller
                    name="categoryId"
                    control={control}
                    rules={{ required: "Job Category is required" }}
                    render={({ field: { onChange, value } }) => (
                      <div className="space-y-1">
                        <label
                          htmlFor="categoryId"
                          className="block text-start text-sm font-medium text-gray-700"
                        >
                          Job Category
                        </label>
                        <CustomSelect
                          id="categoryId"
                          name="categoryId"
                          value={value}
                          onChange={onChange}
                          options={category.map((item) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                          disabledOption="Select Job Category"
                          className={errors.categoryId ? "border-red-500" : ""}
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
                <div>
                  <Controller
                    name="shift"
                    control={control}
                    rules={{ required: "Shift is required" }}
                    render={({ field: { onChange, value } }) => (
                      <div className="space-y-1">
                        <label
                          htmlFor="shift"
                          className="block text-start text-sm font-medium text-gray-700"
                        >
                          Shift
                        </label>
                        <CustomSelect
                          id="shift"
                          name="shift"
                          value={value}
                          onChange={onChange}
                          options={[
                            { value: "DAY", label: "Day" },
                            { value: "EVENING", label: "Evening" },
                            { value: "NIGHT", label: "Night" },
                          ]}
                          disabledOption="Select Shift"
                          className={errors.shift ? "border-red-500" : ""}
                        />
                        {errors.shift && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.shift.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
                <div>
                  <InputField
                    label="Location*"
                    type="text"
                    {...register("location", {
                      required: "Location is required",
                    })}
                    error={errors.location?.message}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-3">
                <InputField
                  label="Application Deadline"
                  type="date"
                  {...register("deadline", {
                    required: "Application Deadline is required",
                  })}
                  error={errors.deadline?.message}
                />

                <InputField
                  label="Minimum Salary"
                  type="number"
                  {...register("minSalary", {
                    required: "Minimum Salary is required",
                    valueAsNumber: true,
                  })}
                  error={errors.minSalary?.message}
                />

                <InputField
                  label="Maximum Salary"
                  type="number"
                  {...register("maxSalary", {
                    required: "Maximum Salary is required",
                    valueAsNumber: true,
                  })}
                  error={errors.maxSalary?.message}
                />
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <InputLabel labelTitle={{ title: "Job Description" }} />
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Job Description is required" }}
                  render={({ field: { onChange, value } }) => (
                    <TextEditor
                      tab="write"
                      label="Job Description"
                      name="description"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#2d9134] to-[#2d9134] text-white font-medium rounded-lg hover:from-[#2d9134] hover:to-[#126918] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 cursor-pointer"
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

export default JobCreate;
