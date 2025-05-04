import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getJobById } from '../../api/jobs';
import { PencilSquareIcon } from '@heroicons/react/24/outline'; // Importing a nice edit icon

export default function JobView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await getJobById(id);
        setJob(data);
      } catch (err) {
        console.error('Failed to fetch job:', err.message);
        setError('Failed to fetch job. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <div className="text-center p-6 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;
  if (!job) return <div className="text-center p-6 text-gray-500">Job not found</div>;

  const {
    title,
    companyName,
    numberOfHiring,
    location,
    jobType,
    jobCategory,
    jobLevel,
    category,
    jobNature,
    shift,
    deadline,
    appliedBy,
  } = job;

  const handleEdit = () => {
    navigate(`/jobs/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-900 py-8 px-4">
      <div className="overflow-hidden max-w-5xl  mx-auto px-6 py-8 bg-white dark:bg-gray-800 rounded-3xl space-y-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{companyName}</p>
          </div>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#00ab0c] to-[#009e0b] hover:from-[#008f0a] hover:to-[#007a09] text-white rounded-full transition-all duration-300 shadow-sm"
          >
            <PencilSquareIcon className="h-5 w-5" />
            <span>Edit</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
          <div className="flex flex-wrap gap-1">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Vacancy:</span>
            <span>{numberOfHiring}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Job Type:</span>
            <span>{jobType?.replace('_', ' ')}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Job Category:</span>
            <span>{category?.replace('_', ' ')}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Job Level:</span>
            <span>{jobLevel?.replace('_', ' ')}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Job Nature:</span>
            <span>{jobNature?.replace('_', ' ')}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Applied By:</span>
            <span>{appliedBy ? 'Internal' : 'External'}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Shift:</span>
            <span>{shift?.replace('_', ' ')}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Location:</span>
            <span>{location}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Deadline:</span>
            <span>
              {new Date(deadline).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
