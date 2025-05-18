import { BiCategoryAlt } from "react-icons/bi";
import {
  FaBriefcase,
  FaDollarSign,
  FaEnvelope,
  FaFilePdf,
  FaGithub,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
} from "react-icons/fa";

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "N/A";
  return parsedDate.toLocaleDateString();
};

const formatCurrency = (amount) => {
  if (!amount || isNaN(amount)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function ApplicantCard({ application }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start justify-between">
        <div className="space-y-4 mb-4 md:mb-0 text-left">
          {/* Header: Applicant Name and Job Title */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <FaUser className="text-indigo-500 dark:text-indigo-400" />
              {application?.fullName || "N/A"}
            </h2>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {application?.job?.title} @ {application?.job?.companyName}
            </p>
          </div>

          {/* Body: Applicant and Job Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
            {/* Applicant Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-indigo-500 dark:text-indigo-400" />
                <a
                  href={`mailto:${application?.email}`}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {application?.email || "N/A"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-indigo-500 dark:text-indigo-400" />
                <span>{application?.phoneNumber || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaDollarSign className="text-indigo-500 dark:text-indigo-400" />
                <span>
                  Expected: {formatCurrency(application?.ExpectSalary)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaFilePdf className="text-indigo-500 dark:text-indigo-400" />
                <a
                  href={application?.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  View CV
                </a>
              </div>
              {application?.githubUrl && (
                <div className="flex items-center gap-2">
                  <FaGithub className="text-indigo-500 dark:text-indigo-400" />
                  <a
                    href={application?.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    GitHub
                  </a>
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BiCategoryAlt className="text-indigo-500 dark:text-indigo-400" />
                <span>{application?.job?.category?.name || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBriefcase className="text-indigo-500 dark:text-indigo-400" />
                <span>
                  {application?.job?.jobType?.replace("_", " ")} |{" "}
                  {application?.job?.jobNature} |{" "}
                  {application?.job?.jobLevel?.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-500 dark:text-indigo-400" />
                <span>{application?.job?.location || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Application Date, Deadline, and IDs */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 dark:text-gray-400 gap-2">
          <span>Applied on {formatDate(application?.createdAt)}</span>
          <span>Deadline: {formatDate(application?.job?.deadline)}</span>
          <span className="truncate" title={`App ID: ${application?.id}`}>
            App ID: {application?.id?.slice(0, 8)}...
          </span>
        </div>
      </div>
    </div>
  );
}
