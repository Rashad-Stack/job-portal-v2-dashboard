import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createJob } from '../../api/jobs';
import { isAuthenticated } from '../../api/auth';

const JobCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    numberOfHiring: '', // <-- fixed
    appliedBy: false,
    location: '',
    googleForm: '',
    jobType: 'FULL_TIME',
    jobCategory: 'MERN',
    jobLevel: 'MID_LEVEL',
    category: 'MERN', // <-- fixed spelling
    jobNature: 'ONSITE',
    shift: 'DAY',
    deadline: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name === 'appliedBy') {
      setFormData((prev) => ({
        ...prev,
        appliedBy: value === 'true',
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? '' : Number(value),
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
    setError('');
    setLoading(true);

    try {
      if (!isAuthenticated()) {
        navigate('/login', { state: { from: '/jobs/create' } });
        return;
      }

      const requiredFields = [
        'companyName',
        'title',
        'numberOfHiring',
        'location',
        'jobType',
        'jobLevel',
        'category',
        'jobNature',
        'shift',
        'deadline',
      ];
      if (formData.appliedBy === false) {
        requiredFields.push('googleForm');
      }

      const emptyFields = requiredFields.filter((field) => {
        const value = formData[field];
        return !value || (typeof value === 'string' && value.trim() === '');
      });

      if (emptyFields.length > 0) {
        setError(`Please fill out the following fields: ${emptyFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // ⬇️ If companyName is empty, delete it from formData so that Prisma will use default
      const dataToSend = { ...formData };
      if (!dataToSend.companyName || dataToSend.companyName.trim() === '') {
        delete dataToSend.companyName;
      }

      await createJob(dataToSend);
      navigate('/jobs/read');
    } catch (error) {
      console.error('Error creating job:', error);
      if (error.message.includes('Authentication token not found')) {
        navigate('/login', { state: { from: '/jobs/create' } });
      } else {
        setError(error.message || 'Failed to create job');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl overflow-hidden">
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
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 pb-2 border-b dark:border-gray-700">
                Basic Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#2d9134] dark:bg-gray-700 dark:text-white"
                  required
                  placeholder="Job Title"
                />
              </div>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#2d9134] dark:bg-gray-700 dark:text-white"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Hiring
                  </label>
                  <input
                    type="number"
                    name="numberOfHiring"
                    value={formData.numberOfHiring}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#2d9134] dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Internal</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="appliedBy"
                          value="false"
                          checked={formData.appliedBy === false}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">External</span>
                      </label>
                    </div>

                    {/* Show button if External is selected */}
                    {formData.appliedBy === false && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Google Form URL
                        </label>
                        <input
                          type="text"
                          name="googleForm"
                          value={formData.googleForm}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#2d9134] dark:bg-gray-700 dark:text-white"
                          placeholder="Enter Google Form URL"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Rest of your form sections with similar dark mode classes */}
            <section className="space-y-4">
              <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Job Nature
                    </label>
                    <select
                      name="jobNature"
                      value={formData.jobNature}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#2d9134] dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="ONSITE">On Site</option>
                      <option value="REMOTE">Remote</option>
                    </select>
                  </div>
                </div>
                {/* Other select inputs with similar dark mode classes */}
              </div>
            </section>

            {/* Deadline section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 pb-2 border-b dark:border-gray-700">
                Application Deadline
              </h2>
              <div>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#2d9134] dark:bg-gray-700 dark:text-white"
                />
              </div>
            </section>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#2d9134] to-[#2d9134] text-white font-medium rounded-lg hover:from-[#2d9134] hover:to-[#126918] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
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
