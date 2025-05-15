import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createJob } from "../../api/jobs";
import TextEditor from "../../components/common/TextEditor";
import InputField from "../../components/input/InputField";
import InputLabel from "../../components/input/InputLabel";
import SelectInput from "../../components/input/SelectInput";

const JobCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    numberOfHiring: "",
    appliedBy: false,
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
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        "http://localhost:3000/api/v2/category/all"
      );
      setCategory(data.data || []);
    } catch (err) {
      console.error("Failed to fetch Categories:", err.message);
      setError("Failed to fetch Categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "appliedBy") {
      setFormData((prev) => ({
        ...prev,
        appliedBy: value === "true",
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const requiredFields = [
        "companyName",
        "title",
        "numberOfHiring",
        "location",
        "jobType",
        "jobLevel",
        "categoryId",
        "jobNature",
        "shift",
        "deadline",
        "description",
        "minSalary",
        "maxSalary",
      ];
      if (formData.appliedBy === false) {
        requiredFields.push("googleForm");
      }

      const emptyFields = requiredFields.filter((field) => {
        const value = formData[field];
        return !value || (typeof value === "string" && value.trim() === "");
      });

      if (emptyFields.length > 0) {
        setError(
          `Please fill out the following fields: ${emptyFields.join(", ")}`
        );
        setLoading(false);
        return;
      }
      const dataToSend = { ...formData };
      if (!dataToSend.companyName || dataToSend.companyName.trim() === "") {
        delete dataToSend.companyName;
      }

      await createJob(dataToSend);
      navigate("/jobs/read");
    } catch (error) {
      console.error("Error creating job:", error);
      if (error.message.includes("Authentication token not found")) {
        navigate("/login", { state: { from: "/jobs/create" } });
      } else {
        setError(error.message || "Failed to create job");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border bottom-1 border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c]">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              Create New Job Post
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              <div>
                <InputField
                  label="Job Title *"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter Job Title"
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2   gap-4">
                <div>
                  <InputField
                    label="Company Name"
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <InputField
                    label="Number of Hiring"
                    type="number"
                    name="numberOfHiring"
                    value={formData.numberOfHiring}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#2d9134]"
                  />
                </div>
                <div className="md:col-span-2">
                  <InputLabel labelTitle={{ title: "Applied By" }} />
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center">
                        <InputField
                          type="radio"
                          name="appliedBy"
                          value="true"
                          checked={formData.appliedBy === true}
                          onChange={handleChange}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          Internal
                        </span>
                      </label>
                      <label className="flex items-center">
                        <InputField
                          type="radio"
                          name="appliedBy"
                          value="false"
                          checked={formData.appliedBy === false}
                          onChange={handleChange}
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">
                          External
                        </span>
                      </label>
                    </div>

                    {formData.appliedBy === false && (
                      <div>
                        <InputField
                          label="Google Form URL"
                          type="text"
                          name="googleForm"
                          value={formData.googleForm}
                          onChange={handleChange}
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
                <SelectInput
                  name="jobNature"
                  label="Job Nature"
                  value={formData.jobNature}
                  onChange={handleChange}
                  options={[
                    { value: "ONSITE", label: "On Site" },
                    { value: "REMOTE", label: "Remote" },
                  ]}
                />

                <SelectInput
                  name="jobLevel"
                  label="Job Level"
                  value={formData.jobLevel}
                  onChange={handleChange}
                  options={[
                    { value: "ENTRY_LEVEL", label: "Entry Level" },
                    { value: "MID_LEVEL", label: "Mid Level" },
                    { value: "ADVANCED_LEVEL", label: "Advanced Level" },
                    { value: "INTERNSHIP", label: "Intern" },
                  ]}
                />

                <SelectInput
                  name="jobType"
                  label="Job Type"
                  value={formData.jobType}
                  onChange={handleChange}
                  options={[
                    { value: "FULL_TIME", label: "Full Time" },
                    { value: "PART_TIME", label: "Part Time" },
                    { value: "CONTRACT", label: "Contract" },
                    { value: "INTERNSHIP", label: "Intern" },
                  ]}
                />
              </div>
            </section>
            <section className="space-y-4">
              <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <div>
                  <div>
                    <SelectInput
                      name="categoryId"
                      label="Job Category"
                      value={formData.categoryId}
                      onChange={handleChange}
                      options={category.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <SelectInput
                      name="shift"
                      label="Shift"
                      value={formData.shift}
                      onChange={handleChange}
                      options={[
                        { value: "DAY", label: "Day" },
                        { value: "EVENING", label: "Evening" },
                        { value: "NIGHT", label: "Night" },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <section className="space-y-4">
                      <div>
                        <InputField
                          label="Location*"
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-3">
                <InputField
                  label="Application Deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />

                <InputField
                  label="Minimum Salary"
                  type="number"
                  name="minSalary"
                  value={formData.minSalary}
                  onChange={handleChange}
                />

                <InputField
                  label="Maximum Salary"
                  type="number"
                  name="maxSalary"
                  value={formData.maxSalary}
                  onChange={handleChange}
                />
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <InputLabel labelTitle={{ title: "Job Description" }} />
                <TextEditor
                  tab="write"
                  label="Job Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#2d9134] to-[#2d9134] text-white font-medium rounded-lg hover:from-[#2d9134] hover:to-[#126918] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
                Create Job Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobCreate;
