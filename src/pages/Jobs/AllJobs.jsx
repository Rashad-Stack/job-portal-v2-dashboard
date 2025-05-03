import { useEffect, useState } from "react";
import { getAllJobs, deleteJob } from "../../api/jobs";
import JobsTable from "../../components/jobs/JobsTable";
import axios from "axios";
import Swal from "sweetalert2";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get("http://localhost:3000/api/v2/job/all");
      setJobs(data.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err.message);
      setError("Failed to fetch jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteJob(id);
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));

        window.location.reload();
      }
    } catch (err) {
      console.error("Delete failed:", err.message);
      setError("Failed to delete the job. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#009e0b]">
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
              {jobs.length > 0 ? (
                [...jobs]
                  .reverse()
                  .map((job, index) => (
                    <JobsTable
                      key={job.id}
                      job={job}
                      index={index}
                      handleDelete={handleDelete}
                    />
                  ))
              ) : (
                <div className="text-gray-500 text-center">
                  No jobs found...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllJobs;
