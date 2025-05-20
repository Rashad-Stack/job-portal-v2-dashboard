import { useEffect, useState } from "react";
import ApplicationCard from "../../components/applications/applicationCard";
import { getAllApplications } from "../../api/applications";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllApplications();
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications:", err.message);
        setError("Failed to fetch applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#EF4444", // Red color for delete
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
        // await deleteJob(id); // Uncomment and implement your actual delete API call
        // setApplications((prev) => prev.filter((app) => app.id !== id));
        window.location.reload(); // Consider a more robust state update instead of full reload
      }
    } catch (err) {
      console.error("Delete failed:", err.message);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the application. Please try again.",
        icon: "error",
        confirmButtonText: "Ok",
        customClass: {
          popup: 'rounded-lg shadow-xl dark:bg-gray-800 dark:text-gray-100',
          title: 'text-red-500',
          content: 'text-gray-700 dark:text-gray-300',
          confirmButton: 'px-4 py-2 rounded-md font-semibold bg-red-500 text-white',
        }
      });
      setError("Failed to delete the application. Please try again.");
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#009e0b] text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              All Job Applications
            </h1>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div
                className="p-4 mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-md"
                role="alert"
              >
                {error}
              </div>
            )}

            {applications.length > 0 ? (
              <div className="overflow-x-auto shadow-sm rounded-lg text-center">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Applicant
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Job Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Type / Level
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Location
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Links
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Dates
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {[...applications].reverse().map((application) => (
                      <tr
                        key={application.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <div className="ml-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {application.fullName || "N/A"}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {application.email || "N/A"}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {application.phoneNumber || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {application.job?.title || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {application.job?.companyName || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Expected: $
                            {application.ExpectSalary?.toLocaleString() || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {formatJobType(application.job?.jobType)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatJobType(application.job?.jobLevel)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {application.job?.jobNature || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {application.job?.location || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            {application.job?.googleForm && (
                              <a
                                href={application.job.googleForm}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                              >
                                Google Form
                              </a>
                            )}
                            {application.githubUrl && (
                              <a
                                href={application.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                              >
                                GitHub
                              </a>
                            )}
                            {application.cv && (
                              <a
                                href={application.cv}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
                              >
                                View CV
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            <span className="font-semibold">Applied:</span>{" "}
                            {formatDate(application.createdAt)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Deadline:</span>{" "}
                            {formatDate(application.job?.deadline)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(application.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-12 text-lg">
                No applications found...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}