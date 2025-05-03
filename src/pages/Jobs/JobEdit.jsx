import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getJobById, updateJob } from "../../api/jobs";
import axios from "axios";

const JobEdit = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    numberOfHiring: "", // <-- fixed
    appliedBy: false,
    location: "",
    jobType: "FULL_TIME",
    jobLevel: "MID_LEVEL",
    category: "MERN", // <-- fixed spelling
    jobNature: "ONSITE",
    shift: "DAY",
    deadline: "",
    googleForm: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axios.get(
          `http://localhost:3000/api/v2/job/${id}`
        );
        const jobDetails = data.data;
        setJob(jobDetails);

        setFormData({
          title: jobDetails.title,
          companyName: jobDetails.companyName,
          numberOfHiring: jobDetails.numberOfHiring, // <-- fixed
          appliedBy: jobDetails.appliedBy,
          location: jobDetails.location,
          jobType: jobDetails.jobType,
          jobLevel: jobDetails.jobLevel,
          category: jobDetails.category, // <-- fixed spelling
          jobNature: jobDetails.jobNature,
          shift: jobDetails.shift,
          deadline: jobDetails.deadline,
          googleForm: jobDetails.googleForm,
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

  const updateJobAdmin = async () => {
    try {
      console.log(formData);
    } catch (error) {
      console.error("Admin update failed:", error);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        companyName: value.trimStart(), // <-- trimming start space when typing
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
    <div className="min-h-screen bg-gray-50/60 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border bottom-1 border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#008f0a]">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              Create New Job Post
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Basic Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                  required
                  placeholder="Job Title"
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2   gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name*
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                    required
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Hiring
                  </label>
                  <input
                    type="number"
                    name="numberOfHiring"
                    value={formData.numberOfHiring}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applied By
                  </label>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="appliedBy"
                          value="true"
                          checked={formData.appliedBy === true}
                          onChange={handleChange}
                          className="h-4 w-4 focus:ring-[#00ab0c] focus:border-[#1e6623] border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Internal</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="appliedBy"
                          value="false"
                          checked={formData.appliedBy === false}
                          onChange={handleChange}
                          className="h-4 w-4 focus:ring-[#00ab0c] focus:border-[#1e6623] border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">External</span>
                      </label>
                    </div>

                    {/* Show button if External is selected */}
                    {formData.appliedBy === false && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Google Form URL
                        </label>
                        <input
                          type="text"
                          name="googleForm"
                          value={formData.googleForm}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                          placeholder="Enter Google Form URL"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3   gap-4">
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Nature
                    </label>
                    <select
                      name="jobNature"
                      value={formData.jobNature}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                      required
                    >
                      <option value="">Select Job Nature</option>
                      <option value="ONSITE">On Site</option>
                      <option value="REMOTE">Remote</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Level
                    </label>
                    <select
                      name="jobLevel"
                      value={formData.jobLevel}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                      required
                    >
                      <option value="">Select Job Level</option>
                      <option value="ENTRY_LEVEL">Entry Lavel</option>
                      <option value="MID_LEVEL">Mid Level</option>
                      <option value="ADVANCED_LEVEL">Advanced Level</option>
                      <option value="INTERNSHIP">Intern</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                      required
                    >
                      <option value="">Select Job Type</option>
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Intern</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3   gap-4">
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                      required
                    >
                      <option value="">Select Job Category</option>
                      <option value="MERN">MERN Stack</option>
                      <option value="FRONT_END">Front End</option>
                      <option value="BACK_END">Back End</option>
                      <option value="UI_UX">UI & UX</option>
                      <option value="FULL_STACK">Full Stack</option>
                      <option value="LARAVEL">Php Laravel </option>
                      <option value="DJANGO">Python Django</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shift
                    </label>
                    <select
                      name="shift"
                      value={formData.shift}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                      required
                    >
                      <option value="">Select Shift</option>
                      <option value="DAY">Day</option>
                      <option value="NIGHT">Night</option>
                      <option value="EVENING">Evening</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div>
                    <section className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location*
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                          required
                        />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </section>
            {/* Location */}

            {/* Employment Status */}

            {/* Deadline */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Application Deadline
              </h2>
              <div>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                />
              </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c] text-white font-medium rounded-lg hover:from-[#549458] hover:to-[#15881c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
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
