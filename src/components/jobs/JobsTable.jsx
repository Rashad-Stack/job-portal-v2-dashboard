import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaGraduationCap,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";

const formatSalary = (job) => {
  if (job.salaryType === "negotiable") {
    return "Negotiable";
  } else if (job.salaryType === "range") {
    return `$${job.salaryRange.min.toLocaleString()} - $${job.salaryRange.max.toLocaleString()}`;
  } else if (job.salaryType === "fixed") {
    return `$${job.fixedSalary.toLocaleString()}`;
  }
  return "Not specified";
};

export default function JobsTable({ job, index, handleDelete }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSave = (updatedJob) => {
    // TODO: Implement save functionality
    console.log("Updated job:", updatedJob);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="space-y-4 mb-4 md:mb-0">
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                {job.companyName}
              </p>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-indigo-500" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBriefcase className="text-indigo-500" />
                  <span>{job.jobType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-indigo-500" />
                  <span>{job.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-indigo-500" />
                  <span>{formatSalary(job)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-indigo-500" />
                  <span>
                    {job.vacancy} {job.vacancy > 1 ? "Positions" : "Position"}
                  </span>
                </div>
              </div>
            </div>
            {job.skills && (
              <div className="flex flex-wrap gap-2">
                {job.skills.split(",").map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/jobs/view/${job._id}`}
              className="inline-flex justify-center items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View
            </Link>
            <Link
              to={`/jobs/edit/${job._id}`}
              className="inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <span className="text-white font-medium">Edit</span>
            </Link>
            <button
              onClick={() => handleDelete(job._id)}
              className="inline-flex justify-center items-center px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Posted on {new Date().toLocaleDateString()}</span>
            <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </>
  );
}
