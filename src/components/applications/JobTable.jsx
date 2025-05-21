// components/applications/JobTable.jsx
import { MdDelete, MdVisibility } from "react-icons/md";
import Swal from "sweetalert2";
import ApplicationList from "./ApplicationList";
import { deleteJob } from "../../api/jobs"; // Import your deleteJob API function

export default function JobTable({ 
  jobs, 
  applications, 
  selectedJobId, 
  onViewApplications, 
  onCloseApplications,
  onJobDeleted // Add this prop to update parent state after deletion
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatJobType = (type) => {
    if (!type) return "N/A";
    return type.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleDelete = async (jobId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, delete it!",
        customClass: {
          popup: 'rounded-lg shadow-xl dark:bg-gray-800 dark:text-gray-100',
          title: 'text-gray-900 dark:text-gray-100',
          content: 'text-gray-700 dark:text-gray-300',
          confirmButton: 'px-4 py-2 rounded-md font-semibold',
          cancelButton: 'px-4 py-2 rounded-md font-semibold',
        }
      });

      if (result.isConfirmed) {
        // Call the API to delete the job
        await deleteJob(jobId);
        
        // Show success message
        await Swal.fire({
          title: "Deleted!",
          text: "The job has been deleted.",
          icon: "success",
          confirmButtonColor: "#10B981",
          customClass: {
            popup: 'rounded-lg shadow-xl dark:bg-gray-800 dark:text-gray-100',
            confirmButton: 'px-4 py-2 rounded-md font-semibold',
          }
        });

        // Notify parent component to update the jobs list
        if (onJobDeleted) {
          onJobDeleted(jobId);
        }
      }
    } catch (err) {
      console.error("Delete failed:", err.message);
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to delete the job. Please try again.",
        icon: "error",
        confirmButtonText: "Ok",
        customClass: {
          popup: 'rounded-lg shadow-xl dark:bg-gray-800 dark:text-gray-100',
          title: 'text-red-500',
          content: 'text-gray-700 dark:text-gray-300',
          confirmButton: 'px-4 py-2 rounded-md font-semibold bg-red-500 text-white',
        }
      });
    }
  };

  const jobApplications = selectedJobId 
    ? applications.filter(app => app.jobId === selectedJobId) 
    : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {selectedJobId ? (
        <ApplicationList 
          applications={jobApplications} 
          onClose={onCloseApplications}
          jobTitle={jobs.find(job => job.id === selectedJobId)?.title || "Job"}
        />
      ) : (
        <>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              All Jobs
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {job.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatJobType(job.jobType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(job.deadline)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {applications.filter(app => app.jobId === job.id).length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onViewApplications(job.id)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 flex items-center"
                        >
                          <MdVisibility className="mr-1" /> View
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 flex items-center"
                        >
                          <MdDelete className="mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}