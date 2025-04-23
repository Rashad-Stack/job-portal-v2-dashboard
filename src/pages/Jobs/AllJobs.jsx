import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs, deleteJob } from "../../api/jobs";
import JobsTable from "../../components/jobs/JobsTable";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (error) {
      setError("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      setError("Failed to delete job.");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border bottom-1 border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              All Job Posts
            </h1>
          </div>

          <div className="p-6">
            {error && (
              <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-6">
              {Array.isArray(jobs) &&
                jobs.map((job, index) => (
                  <JobsTable
                    key={job._id}
                    job={job}
                    index={index}
                    handleDelete={handleDelete}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllJobs;
