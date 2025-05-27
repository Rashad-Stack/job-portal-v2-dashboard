import { MdClose } from "react-icons/md";
import { Link } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { applicationUpdate } from "../../api/applications";
import { format, parseISO } from "date-fns";
import { useAuth } from "../../hooks/useAuth";
import { IoIosArrowBack } from "react-icons/io";


export default function ApplicationList({
  applications: initialApplications,
  onClose,
  jobTitle,
}) {
  const { isAuthenticated, user } = useAuth();
  const userRole = user?.role;
  console.log(userRole);

  // Check role permissions
  const canEditAll = userRole === "ADMIN";
  const canEditHiringOnly = userRole === "HR";
  const canEditExceptHiring = userRole === "MODERATOR";
  const canEditCallAndMailOnly = userRole === "SOCIAL_MEDIA_MANAGER";

  // Check if any application has othersFields
  const hasOthersFields = useMemo(() => {
    return initialApplications.some((app) => app.othersFields);
  }, [initialApplications]);

  // Sort applications by update status and completeness
  const sortedApplications = useMemo(() => {
    return [...initialApplications].sort((a, b) => {
      const updatedAtA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const updatedAtB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      if (updatedAtB !== updatedAtA) return updatedAtB - updatedAtA;
      return calculateCompleteness(b) - calculateCompleteness(a);
    });
  }, [initialApplications]);


  const [applications, setApplications] = useState(sortedApplications);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [comments, setComments] = useState({});

 
  // Helper function to calculate completeness score
  function calculateCompleteness(application) {
    const fieldsToCheck = [
      "shortListStatus",
      "calStatus",
      "mailed",
      "designation",
      "testResult",
      "level",
      "profile",
      "hiringType",
      "internShipProbationSalary",
      "finalSalary",
      "hiringStatus",
      "joining",
      "comments",
    ];

    let filledCount = 0;
    fieldsToCheck.forEach((field) => {
      if (field === "comments") {
        if (application.comments?.comment) filledCount++;
      } else if (application[field] && application[field] !== "NONE") {
        filledCount++;
      }
    });

    return filledCount;
  }

  useEffect(() => {
    setApplications(sortedApplications);
    const initialComments = {};
    sortedApplications.forEach((app) => {
      initialComments[app.id] = app.comments?.comment || "";
    });
    setComments(initialComments);
  }, [sortedApplications]);

  // Function to parse and render othersFields content
  const renderOthersFields = (application) => {
    try {
      const othersFields = application.othersFields
        ? JSON.parse(application.othersFields)
        : {};

      if (!othersFields || Object.keys(othersFields).length === 0) {
        return "N/A";
      }

      return (
        <div className="flex flex-col space-y-1">
          {Object.entries(othersFields).map(([field, value]) => {
            if (
              typeof value === "string" &&
              (value.startsWith("http://") || value.startsWith("https://"))
            ) {
              return (
                <div key={field}>
                  <span className="font-medium">{field}: </span>
                  <Link
                    to={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {value}
                  </Link>
                </div>
              );
            }

            return (
              <div key={field}>
                <span className="font-medium">{field}: </span>
                <span>{value || "N/A"}</span>
              </div>
            );
          })}
        </div>
      );
    } catch (e) {
      console.error("Error parsing othersFields:", e);
      return "N/A";
    }
  };

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
        comment: comments[applicationId] || " ",
        commentId:
          applications.find((a) => a.id === applicationId)?.comments?.id ||
          null,
      };

      // For HR, only allow updating hiringStatus
      if (canEditHiringOnly) {
        const currentApp = applications.find((a) => a.id === applicationId);
        updatePayload.shortListStatus = currentApp.shortListStatus;
        updatePayload.calStatus = currentApp.calStatus;
        updatePayload.mailed = currentApp.mailed;
        updatePayload.designation = currentApp.designation;
        updatePayload.testResult = currentApp.testResult;
        updatePayload.level = currentApp.level;
        updatePayload.profile = currentApp.profile;
        updatePayload.hiringType = currentApp.hiringType;
        updatePayload.internShipProbationSalary =
          currentApp.internShipProbationSalary;
        updatePayload.finalSalary = currentApp.finalSalary;
        updatePayload.joining = currentApp.joining;
      }

      // For MODERATOR, don't allow updating hiringStatus
      if (canEditExceptHiring) {
        const currentApp = applications.find((a) => a.id === applicationId);
        updatePayload.hiringStatus = currentApp.hiringStatus;
      }

      // For SOCIAL_MEDIA_MANAGER, only allow updating calStatus and mailed
      if (canEditCallAndMailOnly) {
        const currentApp = applications.find((a) => a.id === applicationId);
        updatePayload.shortListStatus = currentApp.shortListStatus;
        updatePayload.designation = currentApp.designation;
        updatePayload.testResult = currentApp.testResult;
        updatePayload.level = currentApp.level;
        updatePayload.profile = currentApp.profile;
        updatePayload.hiringType = currentApp.hiringType;
        updatePayload.internShipProbationSalary =
          currentApp.internShipProbationSalary;
        updatePayload.finalSalary = currentApp.finalSalary;
        updatePayload.hiringStatus = currentApp.hiringStatus;
        updatePayload.joining = currentApp.joining;
      }

      const response = await applicationUpdate(applicationId, updatePayload);

      const updatedApplication = {
        ...response.data,
        updatedAt: new Date().toISOString(),
        comments:
          response.data.comments ||
          applications.find((a) => a.id === applicationId)?.comments,
      };

      setApplications((prev) =>
        [
          updatedApplication,
          ...prev.filter((app) => app.id !== applicationId),
        ].sort((a, b) => {
          const updatedAtA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const updatedAtB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          if (updatedAtB !== updatedAtA) return updatedAtB - updatedAtA;
          return calculateCompleteness(b) - calculateCompleteness(a);
        })
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
    hiringStatus: ["NONE", "HIRED", "REJECTED", "PENDING_NEED_TO_DISCUSS"],
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

  const baseTableHeaders = [
    "Name",
    "Email",
    "Phone",
    "Expected Salary",
    "CV",
    "Portfolio",
    "Others Fields",
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

  const tableHeaders = hasOthersFields
    ? [...baseTableHeaders]
    : baseTableHeaders;

  // Function to check if edit button should be shown
  const shouldShowEditButton = () => {
    return (
      canEditAll ||
      canEditHiringOnly ||
      canEditExceptHiring ||
      canEditCallAndMailOnly
    );
  };

  // Function to check if a field should be editable
  const isFieldEditable = (fieldName) => {
    if (canEditAll) return true;
    if (canEditHiringOnly) return fieldName === "hiringStatus";
    if (canEditExceptHiring)
      return (
        fieldName !== "hiringStatus" &&
        fieldName !== "calStatus" &&
        fieldName !== "mailed"
      );
    if (canEditCallAndMailOnly)
      return fieldName === "calStatus" || fieldName === "mailed";
    return false;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Applications for {jobTitle}
          {hasOthersFields && (
            <span className="ml-2 text-sm text-gray-500">
              (with additional information)
            </span>
          )}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          disabled={isLoading}
        >
          <p className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium transition duration-200 focus:outline-none bg-green-500 text-white hover:bg-green-700 cursor-pointer "><IoIosArrowBack size={24} /> Back </p>
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
              {applications.map((application) => {
                const isRecentlyUpdated =
                  application.updatedAt &&
                  new Date() - new Date(application.updatedAt) <
                    24 * 60 * 60 * 1000;
                const completeness = calculateCompleteness(application);

                return (
                  <tr
                    key={application.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      isRecentlyUpdated ? "bg-blue-50 dark:bg-blue-900" : ""
                    }`}
                  >
                    {/* Base fields */}
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                      <div className="flex items-center">
                        {application.fullName}
                        {completeness > 8 && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Complete
                          </span>
                        )}
                      </div>
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

                    {hasOthersFields && (
                      <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
                        {renderOthersFields(application)}
                      </td>
                    )}

                    {/* Editable Fields */}
                    <td className="px-3 py-2 whitespace-nowrap">
                      {editingId === application.id &&
                      isFieldEditable("shortListStatus") ? (
                        <select
                          value={editedData.shortListStatus || "NONE"}
                          onChange={(e) =>
                            handleChange("shortListStatus", e.target.value)
                          }
                          className="text-sm border rounded p-1 w-max"
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
                      {editingId === application.id &&
                      isFieldEditable("calStatus") ? (
                        <select
                          value={editedData.calStatus || "NONE"}
                          onChange={(e) =>
                            handleChange("calStatus", e.target.value)
                          }
                          className="text-sm border rounded p-1 w-max"
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
                      {editingId === application.id &&
                      isFieldEditable("mailed") ? (
                        <select
                          value={editedData.mailed || "NOT_YET"}
                          onChange={(e) =>
                            handleChange("mailed", e.target.value)
                          }
                          className="text-sm border rounded p-1 w-max"
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
                      {editingId === application.id &&
                      isFieldEditable("designation") ? (
                        <select
                          value={editedData.designation || "NOT_YET"}
                          onChange={(e) =>
                            handleChange("designation", e.target.value)
                          }
                          className="text-sm border rounded p-1 w-max"
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
                      {editingId === application.id &&
                      isFieldEditable("testResult") ? (
                        <input
                          type="text"
                          value={editedData.testResult || ""}
                          onChange={(e) =>
                            handleChange("testResult", parseInt(e.target.value))
                          }
                          className={`text-sm border rounded p-1 w-max visible`}
                        />
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                          {application.testResult || "N/A"}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2 whitespace-nowrap">
                      {editingId === application.id &&
                      isFieldEditable("level") ? (
                        <select
                          value={editedData.level || "NONE"}
                          onChange={(e) =>
                            handleChange("level", e.target.value)
                          }
                          className="text-sm border rounded p-1 w-max"
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
                      {editingId === application.id &&
                      isFieldEditable("profile") ? (
                        <select
                          value={editedData.profile || "NONE"}
                          onChange={(e) =>
                            handleChange("profile", e.target.value)
                          }
                          className="text-sm border rounded p-1 w-max"
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
                      {editingId === application.id &&
                      isFieldEditable("hiringType") ? (
                        <select
                          value={editedData.hiringType || "NONE"}
                          onChange={(e) =>
                            handleChange("hiringType", e.target.value)
                          }
                          className="text-sm border rounded p-1 w-max"
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
                      {editingId === application.id &&
                      isFieldEditable("internShipProbationSalary") ? (
                        <input
                          type="number"
                          value={
                            parseInt(editedData.internShipProbationSalary) || ""
                          }
                          onChange={(e) =>
                            handleChange(
                              "internShipProbationSalary",
                              parseInt(e.target.value)
                            )
                          }
                          className="text-sm border rounded p-1 w-max"
                        />
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                          {application.internShipProbationSalary || "N/A"}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2 whitespace-nowrap">
                      {editingId === application.id &&
                      isFieldEditable("finalSalary") ? (
                        <input
                          type="number"
                          value={parseInt(editedData.finalSalary) || ""}
                          onChange={(e) =>
                            handleChange(
                              "finalSalary",
                              parseInt(e.target.value)
                            )
                          }
                          className="text-sm border rounded p-1 w-max"
                        />
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                          {application.finalSalary || "N/A"}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2 whitespace-nowrap">
                      {editingId === application.id &&
                      isFieldEditable("hiringStatus") ? (
                        <select
                          value={editedData.hiringStatus || "NONE"}
                          onChange={(e) =>
                            handleChange("hiringStatus", e.target.value)
                          }
                          className="text-sm border rounded p-1 w-max"
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
                      {editingId === application.id &&
                      isFieldEditable("joining") ? (
                        <input
                          type="date"
                          value={
                            editedData.joining
                              ? format(
                                  parseISO(editedData.joining),
                                  "yyyy-MM-dd"
                                )
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
                          className="text-sm border rounded p-1 w-max"
                        />
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                          {formatDateForDisplay(application.joining) || "N/A"}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2 whitespace-nowrap">
                      {editingId === application.id &&
                      isFieldEditable("comments") ? (
                        <textarea
                          value={comments[application.id] || ""}
                          onChange={(e) =>
                            handleCommentChange(application.id, e.target.value)
                          }
                          className="text-sm border rounded p-1 w-max"
                          rows={2}
                        />
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                          {application.comments?.comment || "N/A"}
                        </span>
                      )}
                    </td>

                    {/* Actions cell */}
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
                        shouldShowEditButton() && (
                          <button
                            onClick={() => handleEdit(application)}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                          >
                            Edit
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
