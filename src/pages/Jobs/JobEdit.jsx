import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getJobById, updateJob } from "../../api/jobs";
import { getAllCategories } from "../../api/category.js";
import InputField from "../../components/input/InputField.jsx";
import InputLabel from "../../components/input/InputLabel.jsx";
import SelectInput from "../../components/input/SelectInput.jsx";

const JobEdit = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [myCategory, setMyCategory] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    numberOfHiring: "",
    categoryId: "",
    appliedBy: false,
    location: "",
    jobType: "FULL_TIME",
    jobLevel: "MID_LEVEL",
    category: "",
    jobNature: "ONSITE",
    shift: "DAY",
    deadline: "",
    googleForm: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const { data } = await getJobById(id);
        setFormData({
          ...data,
          appliedBy: !!data.appliedBy,
        });
      } catch (err) {
        console.error("Failed to fetch job:", err.message);
        setError("Failed to fetch job. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getAllCategories();
      setMyCategory(data);
    } catch (err) {
      console.error("Failed to fetch Categories:", err.message);
      setError("Failed to fetch Categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const sanitizeData = () => {
    const sanitized = { ...formData };
    sanitized.title = formData.title.trim();
    return sanitized;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const cleanedFormData = sanitizeData();

    try {
      await updateJob(id, cleanedFormData);
      navigate("/jobs/read");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "appliedBy") {
      setFormData((prev) => ({
        ...prev,
        appliedBy: value === "true",
      }));
    } else if (name === "companyName") {
      setFormData((prev) => ({
        ...prev,
        companyName: value.trimStart(),
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

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#008f0a]">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              Update Job Post
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 pb-2 border-b dark:border-gray-700">
                Basic Information
              </h2>
              <div>
                <InputLabel labelTitle={{ title: "Job Title *" }} />
                <InputField
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="..."
                  required
                  placeholder="Job Title"
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <InputField
                  label="Company Name"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Company Name"
                />

                <div>
                  <InputField
                    label="Number of Hiring"
                    type="number"
                    name="numberOfHiring"
                    value={formData.numberOfHiring}
                    onChange={handleChange}
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
                      options={myCategory.map((item) => ({
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
              <div>
                <InputField
                  label="Application Deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c] text-white font-medium rounded-lg hover:from-[#008f0a] hover:to-[#007a09] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ab0c] transition-all duration-300 shadow-sm"
              >
                Update Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobEdit;
