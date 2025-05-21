import { useEffect, useState } from "react";
import { BiCategoryAlt } from "react-icons/bi";
import { FaBriefcase, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { GiClick } from "react-icons/gi";
import { Link } from "react-router";

const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString() : "N/A";
};

export default function JobCard({ job, handleDelete }) {
  console.log("job", job);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="space-y-4 mb-4 md:mb-0 text-left">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {job.title}
          </h2>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {job.companyName}
            </p>
            <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-500 dark:text-indigo-400" />
                <span>{job?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBriefcase className="text-indigo-500 dark:text-indigo-400" />
                <span>{job?.jobType?.replace("_", " ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <BiCategoryAlt className="text-indigo-500 dark:text-indigo-400" />
                <span>{job?.category?.name}</span>
              </div>
              <div className="w-full flex gap-2 items-center">
                <GiClick className="text-indigo-500 dark:text-indigo-400" />
                <span>
                  {job?.appliedByInternal ? (
                    <div className="flex flex-col md:flex-row items-center gap-2">
                      {job?.fields
                        ? Object.entries(job.fields).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                              <span className="capitalize font-semibold">{key}:</span>
                              <span>{value || "N/A"}</span>
                            </div>
                          ))
                        : "N/A"}
                    </div>
                  ) : (
                    <a
                      href={job?.googleForm}
                      title={job?.googleForm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Google Form Link
                    </a>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaUsers className="text-indigo-500 dark:text-indigo-400" />
                <span>
                  {job.numberOfHiring}{" "}
                  {job.numberOfHiring > 1 ? "Positions" : "Position"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/jobs/view/${job.id}`}
            className="inline-flex justify-center items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white font-medium rounded-lg transition-colors"
          >
            View
          </Link>
          <Link
            to={`/jobs/edit/${job.id}`}
            className="inline-flex justify-center items-center px-4 py-2 bg-[#00ab0c] hover:bg-[#237e29] dark:bg-[#008f0a] dark:hover:bg-[#007a0a] text-white font-medium rounded-lg transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(job.id)}
            className="inline-flex justify-center items-center px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 dark:text-gray-400 gap-2">
          <span>Posted on {formatDate(job.updatedAt)}</span>
          <span>Deadline: {formatDate(job.deadline)}</span>
        </div>
      </div>
    </div>
  );
}
