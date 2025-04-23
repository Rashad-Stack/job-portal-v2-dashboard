import { useState } from 'react';

const JobCreate = ({ onSubmit }) => {
  // All state
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [deadline, setDeadline] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');

  // Handle submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!title || !company || !location || !jobType || !deadline || !experience) {
      setError('Please fill out all fields.');
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

    // Call the onSubmit prop with jobData
    onSubmit(jobData);
  };

  return (
    <div>
      <div className="p-4 bg-white shadow rounded-lg sm:max-w-3xl w-full mx-auto mt-10">
        <h1 className="sm:text-2xl text-center mb-4-10 sm:mt-0 text-xl font-semibold text-gray-600">
          Create Job Post
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="title">
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="company">
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="location">
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="jobType">
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="deadline">
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
            <label className="block text-sm font-medium text-gray-700" htmlFor="experience">
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
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobCreate;
