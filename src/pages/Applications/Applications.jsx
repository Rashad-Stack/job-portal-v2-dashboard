// pages/applications/index.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getAllApplications } from "../../api/applications";
import { getAllJobs } from "../../api/jobs";
import JobTable from "../../components/applications/JobTable";

export default function Applications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const jobsResponse = await getAllJobs();
        const appsResponse = await getAllApplications();
        
        setJobs(jobsResponse.data);
        setApplications(appsResponse.data);
      } catch (err) {
        console.error("Failed to fetch data:", err.message);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewApplications = (id) => {
    navigate(`/jobs/applications/${id}`);
  };

  const handleCloseApplications = () => {
    navigate('/jobs/applications');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="text-red-500 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <JobTable 
          jobs={jobs} 
          applications={applications} 
          selectedJobId={jobId}
          onViewApplications={handleViewApplications}
          onCloseApplications={handleCloseApplications}
        />
      </div>
    </div>
  );
}