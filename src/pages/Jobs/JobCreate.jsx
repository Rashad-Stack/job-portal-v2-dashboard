import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../api/jobs";
import { isAuthenticated } from "../../api/auth";

const JobCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    companyName: "",
    vacancy: "",
    salaryType: "negotiable", // Default to negotiable
    salaryRange: {
      min: "",
      max: "",
    },
    fixedSalary: "",

    // Location
    location: "",

    // Employment Status
    jobType: "",

    // Requirements
    experience: "",
    education: "",
    additionalRequirements: "",

    // Responsibilities
    responsibilities: [], // Changed to array

    // Benefits
    lunch: "",
    salaryReview: "",
    otherBenefits: "",

    // Skills
    skills: "",

    // Company Info
    companyInfo: "",

    deadline: "",
  });
  console.log(formData);

  const [currentResponsibility, setCurrentResponsibility] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "salaryType") {
      setFormData((prev) => ({
        ...prev,
        salaryType: value,
        salaryRange: { min: "", max: "" },
        fixedSalary: "",
      }));
    } else if (name === "salaryRange.min" || name === "salaryRange.max") {
      setFormData((prev) => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [name.split(".")[1]]: value,
        },
      }));
    } else if (name === "lunch") {
      setFormData((prev) => ({
        ...prev,
        lunch: checked ? "Provided" : "",
      }));
    } else if (name === "salaryReview") {
      setFormData((prev) => ({
        ...prev,
        salaryReview: checked ? "Yearly" : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const addResponsibility = () => {
    if (currentResponsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [
          ...prev.responsibilities,
          currentResponsibility.trim(),
        ],
      }));
      setCurrentResponsibility("");
    }
  };

  const removeResponsibility = (index) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addResponsibility();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check authentication before submitting
      if (!isAuthenticated()) {
        navigate("/login", { state: { from: "/jobs/create" } });
        return;
      }

      // Enhanced validation
      const requiredFields = [
        "title",
        "companyName",
        "location",
        "jobType",
        "experience",
        "responsibilities",
        "skills",
        "companyInfo",
      ];

      // Check for empty required fields
      const emptyFields = requiredFields.filter((field) => {
        const value = formData[field];
        if (Array.isArray(value)) {
          return value.length === 0;
        }
        return !value || value.trim() === "";
      });

      if (emptyFields.length > 0) {
        setError(
          `Please fill out the following fields: ${emptyFields.join(", ")}`
        );
        return;
      }

      // Validate salary data
      if (formData.salaryType === "range") {
        const min = parseFloat(formData.salaryRange.min);
        const max = parseFloat(formData.salaryRange.max);

        if (!min || !max) {
          setError("Please enter both minimum and maximum salary for range");
          return;
        }

        if (min >= max) {
          setError("Maximum salary must be greater than minimum salary");
          return;
        }
      } else if (formData.salaryType === "fixed" && !formData.fixedSalary) {
        setError("Please enter the fixed salary amount");
        return;
      }

      // Validate vacancy
      if (formData.vacancy && parseInt(formData.vacancy) <= 0) {
        setError("Vacancy must be a positive number");
        return;
      }

      // Validate deadline if provided
      if (formData.deadline) {
        const deadlineDate = new Date(formData.deadline);
        if (isNaN(deadlineDate.getTime())) {
          setError("Please enter a valid deadline date");
          return;
        }
        if (deadlineDate < new Date()) {
          setError("Deadline cannot be in the past");
          return;
        }
      }

      await createJob(formData);
      navigate("/dashboard/jobs");
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
    <div className="min-h-screen bg-gray-50/60 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border bottom-1 border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name*
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vacancy
                  </label>
                  <input
                    type="number"
                    name="vacancy"
                    value={formData.vacancy}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Salary Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary
                  </label>
                  <div className="space-y-4">
                    {/* Radio Options */}
                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="salaryType"
                          value="negotiable"
                          checked={formData.salaryType === "negotiable"}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Negotiable</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="salaryType"
                          value="range"
                          checked={formData.salaryType === "range"}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Salary Range</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="salaryType"
                          value="fixed"
                          checked={formData.salaryType === "fixed"}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Fixed Salary</span>
                      </label>
                    </div>

                    {/* Conditional Input Fields */}
                    {formData.salaryType === "range" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Salary
                          </label>
                          <input
                            type="number"
                            name="salaryRange.min"
                            value={formData.salaryRange.min}
                            onChange={handleChange}
                            placeholder="e.g., 50000"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Salary
                          </label>
                          <input
                            type="number"
                            name="salaryRange.max"
                            value={formData.salaryRange.max}
                            onChange={handleChange}
                            placeholder="e.g., 70000"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    )}

                    {formData.salaryType === "fixed" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fixed Salary Amount
                        </label>
                        <input
                          type="number"
                          name="fixedSalary"
                          value={formData.fixedSalary}
                          onChange={handleChange}
                          placeholder="e.g., 60000"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Job Location
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </section>

            {/* Employment Status */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Employment Status
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type*
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Job Type</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Intern</option>
                </select>
              </div>
            </section>

            {/* Requirements */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Requirements
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience*
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g., 2-3 years"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Educational Qualification
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Requirements
                  </label>
                  <textarea
                    name="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Responsibilities */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Responsibilities
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentResponsibility}
                    onChange={(e) => setCurrentResponsibility(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a responsibility"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addResponsibility}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.responsibilities.map((responsibility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg group"
                    >
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <p className="flex-1 text-gray-700">{responsibility}</p>
                      <button
                        type="button"
                        onClick={() => removeResponsibility(index)}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Benefits */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Compensation & Benefits
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    name="lunch"
                    checked={formData.lunch}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Lunch Provided
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    name="salaryReview"
                    checked={formData.salaryReview}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Yearly Salary Review
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Benefits
                  </label>
                  <textarea
                    name="otherBenefits"
                    value={formData.otherBenefits}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="List other benefits..."
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Skills */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Skills & Expertise
              </h2>
              <div>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="List required skills..."
                ></textarea>
              </div>
            </section>

            {/* Company Info */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Company Information
              </h2>
              <div>
                <textarea
                  name="companyInfo"
                  value={formData.companyInfo}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe your company..."
                ></textarea>
              </div>
            </section>

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
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
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
