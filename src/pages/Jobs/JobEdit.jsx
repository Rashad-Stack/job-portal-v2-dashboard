import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const JobEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // All state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [deadline, setDeadline] = useState("");
  const [experience, setExperience] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`/api/jobs/${id}`);
        const job = response.data;
        setTitle(job.title);
        setCompany(job.company);
        setLocation(job.location);
        setJobType(job.jobType);
        setDeadline(job.deadline);
        setExperience(job.experience);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch job data");
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // Handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (
      !title ||
      !company ||
      !location ||
      !jobType ||
      !deadline ||
      !experience
    ) {
      setError("Please fill out all fields.");
      return;
    }

    const jobData = {
      title,
      company,
      location,
      jobType,
      deadline,
      experience,
    };

    try {
      await axios.put(`/api/jobs/${id}`, jobData);
      navigate("/dashboard/jobs"); // Redirect to jobs list after successful update
    } catch (err) {
      setError("Failed to update job");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div>
      <div className="p-4 bg-white shadow rounded-lg sm:max-w-3xl w-full mx-auto mt-10">
        <h1 className="sm:text-2xl text-center mb-4-10 sm:mt-0 text-xl font-semibold text-gray-600">
          Edit Job Post
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="title"
            >
              Job Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="company"
            >
              Company Name
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="location"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="jobType"
            >
              Job Type
            </label>
            <input
              type="text"
              id="jobType"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="deadline"
            >
              Application Deadline
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="experience"
            >
              Experience
            </label>
            <input
              type="text"
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
              placeholder="e.g., 3 years, 5-7 years"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#E5383B] text-white font-bold rounded-[8px]"
          >
            Update Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobEdit;
