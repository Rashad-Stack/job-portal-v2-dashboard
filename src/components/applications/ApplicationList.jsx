// components/applications/ApplicationList.jsx
import { MdClose } from "react-icons/md";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { applicationUpdate } from "../../api/applications";
import { format, parseISO } from "date-fns";

export default function ApplicationList({
  applications: initialApplications,
  onClose,
  jobTitle,
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [comments, setComments] = useState({});

  useEffect(() => {
    setApplications(initialApplications);
    const initialComments = {};
    initialApplications.forEach((app) => {
      // Initialize comments from the application's comment relationship
      initialComments[app.id] = app.comments?.comment || "";
    });
    console.log(initialApplications);
    
    setComments(initialComments);
  }, [initialApplications]);

  const handleUpdateApplication = async (applicationId) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatePayload = {
        ...editedData,
        joining: editedData.joining
          ? new Date(editedData.joining).toISOString()
          : null,
        comment: comments[applicationId] || "", // Send comment text
        commentId:
          applications.find((a) => a.id === applicationId)?.comments?.id ||
          null, // Include commentId if exists
      };

      const response = await applicationUpdate(applicationId, updatePayload);

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? {
                ...app,
                ...response.data,
                comments: response.data.comments || app.comments, // Preserve comment relationship
              }
            : app
        )
      );

      setEditingId(null);
      setSuccess("Application updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to update application:", err);
      setError("Failed to update application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (application) => {
    setEditingId(application.id);
    setEditedData({
      shortListStatus: application.shortListStatus,
      calStatus: application.calStatus,
      mailed: application.mailed,
      designation: application.designation,
      testResult: application.testResult,
      level: application.level,
      profile: application.profile,
      hiringType: application.hiringType,
      internShipProbationSalary: application.internShipProbationSalary,
      finalSalary: application.finalSalary,
      hiringStatus: application.hiringStatus,
      joining: application.joining,
    });
    // Initialize comment from the application's comment relationship
    setComments((prev) => ({
      ...prev,
      [application.id]: application.comments?.comment || "",
    }));
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCommentChange = (applicationId, value) => {
    setComments((prev) => ({
      ...prev,
      [applicationId]: value,
    }));
  };

  const statusOptions = {
    shortListStatus: ["NONE", "SHORTLIST", "REJECTED"],
    calStatus: ["YES", "NO_RESPONSE", "BUSY", "PHONE_OFF"],
    mailed: ["SENT", "NOT_YET"],
    hiringStatus: ["NONE", "HIRED", "REJECTED", "PENDING"],
    level: ["NONE", "LEVEL_A", "LEVEL_B", "LEVEL_C", "LEVEL_D"],
    profile: ["NONE", "YES", "NO"],
    hiringType: ["NONE", "INTERN", "PROBATION"],
    designation: [
      "NONE",
      "FRONTEND",
      "BACKEND",
      "FULLSTACK",
      "UI/UX",
      "DEVOPS",
    ],
  };
  const tableHeaders = [
    "Name",
    "Email",
    "Phone",
    "Expected Salary",
    "CV",
    "Portfolio",
    "Shortlisted",
    "Call Status",
    "Mailed",
    "Designation",
    "Test Result",
    "Level",
    "Profile",
    "Hiring Type",
    "Probation Salary",
    "Final Salary",
    "Hiring Status",
    "Joining Date",
    "Comment",
    "Actions",
  ];

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Applications for {jobTitle}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          disabled={isLoading}
        >
          <MdClose size={24} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No applications found for this job.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <p className="w-max">{header}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {/* Basic Info (non-editable) */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                    {application.fullName}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {application.email}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {application.phoneNumber}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {application.expectSalary}
                  </td>

                  {/* CV Link */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <Link
                      to={application.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View CV
                    </Link>
                  </td>

                  {/* Portfolio Links */}
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex flex-col space-y-1">
                      {application.githubUrl && (
                        <Link
                          to={application.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          GitHub
                        </Link>
                      )}
                      {application.cpProfile && (
                        <Link
                          to={application.cpProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          CodeProfile
                        </Link>
                      )}
                    </div>
                  </td>

                  {/* Editable Fields */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <select
                        value={editedData.shortListStatus || "NONE"}
                        onChange={(e) =>
                          handleChange("shortListStatus", e.target.value)
                        }
                        className="text-sm border rounded p-1 w-full"
                      >
                        {statusOptions.shortListStatus.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.shortListStatus}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <select
                        value={editedData.calStatus || "NONE"}
                        onChange={(e) =>
                          handleChange("calStatus", e.target.value)
                        }
                        className="text-sm border rounded p-1 w-full"
                      >
                        {statusOptions.calStatus.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.calStatus}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <select
                        value={editedData.mailed || "NOT_YET"}
                        onChange={(e) => handleChange("mailed", e.target.value)}
                        className="text-sm border rounded p-1 w-full"
                      >
                        {statusOptions.mailed.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.mailed}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <select
                        value={editedData.designation || "NOT_YET"}
                        onChange={(e) =>
                          handleChange("designation", e.target.value)
                        }
                        className="text-sm border rounded p-1 w-full"
                      >
                        {statusOptions.designation.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.designation || "N/A"}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <input
                        type="text"
                        value={editedData.testResult || ""}
                        onChange={(e) =>
                          handleChange("testResult", parseInt(e.target.value))
                        }
                        className="text-sm border rounded p-1 w-full"
                      />
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.testResult || "N/A"}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <select
                        value={editedData.level || "NONE"}
                        onChange={(e) => handleChange("level", e.target.value)}
                        className="text-sm border rounded p-1 w-full"
                      >
                        {statusOptions.level.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.level}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <select
                        value={editedData.profile || "NONE"}
                        onChange={(e) =>
                          handleChange("profile", e.target.value)
                        }
                        className="text-sm border rounded p-1 w-full"
                      >
                        {statusOptions.profile.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.profile}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <select
                        value={editedData.hiringType || "NONE"}
                        onChange={(e) =>
                          handleChange("hiringType", e.target.value)
                        }
                        className="text-sm border rounded p-1 w-full"
                      >
                        {statusOptions.hiringType.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.hiringType}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <input
                        type="number"
                        value={
                          parseInt(editedData.internShipProbationSalary) || ""
                        }
                        onChange={(e) =>
                          handleChange(
                            "internShipProbationSalary",
                            e.target.value
                          )
                        }
                        className="text-sm border rounded p-1 w-full"
                      />
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.internShipProbationSalary || "N/A"}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <input
                        type="number"
                        value={parseInt(editedData.finalSalary) || ""}
                        onChange={(e) =>
                          handleChange("finalSalary", e.target.value)
                        }
                        className="text-sm border rounded p-1 w-full"
                      />
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.finalSalary || "N/A"}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <select
                        value={editedData.hiringStatus || "NONE"}
                        onChange={(e) =>
                          handleChange("hiringStatus", e.target.value)
                        }
                        className="text-sm border rounded p-1 w-full"
                      >
                        {statusOptions.hiringStatus.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.hiringStatus}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <input
                        type="date"
                        value={
                          editedData.joining
                            ? format(parseISO(editedData.joining), "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          handleChange(
                            "joining",
                            date ? date.toISOString() : null
                          );
                        }}
                        className="text-sm border rounded p-1 w-full"
                      />
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {formatDateForDisplay(application.joining) || "N/A"}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap">
                    {editingId === application.id ? (
                      <textarea
                        value={comments[application.id] || ""}
                        onChange={(e) =>
                          handleCommentChange(application.id, e.target.value)
                        }
                        className="text-sm border rounded p-1 w-full"
                        rows={2}
                      />
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {application.comments?.comment || "N/A"}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {editingId === application.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleUpdateApplication(application.id)
                          }
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(application)}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
