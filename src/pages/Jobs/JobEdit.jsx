import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, updateJob } from "../../api/jobs";

const JobEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    jobType: "",
    deadline: "",
    experience: "",
    education: "",
    responsibilities: [],
    skills: "",
    salaryType: "negotiable",
    salaryRange: {
      min: "",
      max: "",
    },
    fixedSalary: "",
    additionalRequirements: "",
    lunch: false,
    salaryReview: false,
    otherBenefits: "",
    companyInfo: "",
    vacancy: "",
  });

  const [currentResponsibility, setCurrentResponsibility] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const job = await getJobById(id);

        // Map the API response to our form fields
        const mappedData = {
          title: job.title || "",
          companyName: job.companyName || "",
          location: job.location || "",
          jobType: job.jobType || "",
          deadline: job.deadline || "",
          experience: job.experience || "",
          education: job.education || "",
          responsibilities: job.responsibilities || [],
          skills: job.skills || "",
          salaryType: job.salaryType || "negotiable",
          salaryRange: {
            min: job.salaryRange?.min || "",
            max: job.salaryRange?.max || "",
          },
          fixedSalary: job.fixedSalary || "",
          additionalRequirements: job.requirements || "",
          lunch: job.lunch || false,
          salaryReview: job.salaryReview || false,
          otherBenefits: job.benefits || "",
          companyInfo: job.description || "",
          vacancy: job.vacancy || "",
        };

        setFormData(mappedData);
      } catch (err) {
        setError("Failed to fetch job data");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "salaryType") {
      setFormData((prev) => ({
        ...prev,
        salaryType: value,
        salaryRange: { min: "", max: "" },
        fixedSalary: "",
      }));
    } else if (name === "salaryMin" || name === "salaryMax") {
      setFormData((prev) => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [name === "salaryMin" ? "min" : "max"]: value,
        },
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

    try {
      await updateJob(id, formData);
      navigate("/dashboard/jobs");
    } catch (err) {
      setError("Failed to update job");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border bottom-1 border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              Edit Job Post
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
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline*
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Vacancies*
                  </label>
                  <input
                    type="number"
                    name="vacancy"
                    value={formData.vacancy}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    min="1"
                  />
                </div>
              </div>
            </section>

            {/* Requirements */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Requirements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Education*
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="e.g., Bachelor's Degree"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills*
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g., JavaScript, React, Node.js"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Requirements
                  </label>
                  <textarea
                    name="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
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

            {/* Salary Information */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Salary Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Type*
                  </label>
                  <select
                    name="salaryType"
                    value={formData.salaryType}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="negotiable">Negotiable</option>
                    <option value="range">Salary Range</option>
                    <option value="fixed">Fixed Salary</option>
                  </select>
                </div>
                {formData.salaryType === "range" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Salary
                      </label>
                      <input
                        type="number"
                        name="salaryMin"
                        value={formData.salaryRange.min}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Salary
                      </label>
                      <input
                        type="number"
                        name="salaryMax"
                        value={formData.salaryRange.max}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </>
                )}
                {formData.salaryType === "fixed" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fixed Salary
                    </label>
                    <input
                      type="number"
                      name="fixedSalary"
                      value={formData.fixedSalary}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Benefits */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Benefits
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="lunch"
                    checked={formData.lunch}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Lunch Facility
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="salaryReview"
                    checked={formData.salaryReview}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Salary Review
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
                  />
                </div>
              </div>
            </section>

            {/* Company Information */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                Company Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About Company
                </label>
                <textarea
                  name="companyInfo"
                  value={formData.companyInfo}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                Update Job Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobEdit;
