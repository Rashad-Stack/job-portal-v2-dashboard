import { useEffect, useState } from "react";
import { getAllApplications } from "../../api/axios/applications";

export default function Applications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    async () => {
      const result = await getAllApplications();
      setApplications(result);
    };
  }, []);

  console.log("applications", applications);

  return (
    <div className="min-h-screen bg-gray-50/60 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#009e0b]">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              All Job Applications
            </h1>
          </div>

          <div className="p-6">
            {/* {error && (
                 <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300">
                   {error}
                 </div>
               )} */}

            <div className="grid gap-6">
              {/* {jobs.length > 0 ? (
                   [...jobs]
                     .reverse()
                     .map((job, index) => (
                       <JobsTable key={job.id} job={job} index={index} handleDelete={handleDelete} />
                     ))
                 ) : (
                   <div className="text-gray-500 dark:text-gray-400 text-center">No jobs found...</div>
                 )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
