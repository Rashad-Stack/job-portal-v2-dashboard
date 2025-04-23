import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../api/jobs";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaClock,
  FaGraduationCap,
  FaDollarSign,
  FaUsers,
  FaCalendarAlt,
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

export default function JobView() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        setJob(data);
      } catch (error) {
        setError("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">{error}</div>;
  }

  if (!job) {
    return <div className="text-center p-4">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {job.title}
            </h1>
            <p className="text-indigo-100 mt-2">{job.companyName}</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FaMapMarkerAlt className="text-indigo-500" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaBriefcase className="text-indigo-500" />
                <span>{job.jobType.replace("_", " ")}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaClock className="text-indigo-500" />
                <span>{job.experience}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaDollarSign className="text-indigo-500" />
                <span>{formatSalary(job)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaUsers className="text-indigo-500" />
                <span>
                  {job.vacancy} {job.vacancy > 1 ? "Positions" : "Position"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendarAlt className="text-indigo-500" />
                <span>
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Skills */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Required Skills
              </h2>
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
            </section>

            {/* Responsibilities */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Responsibilities & Context
              </h2>
              <div className="space-y-2">
                {job.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>
                    <p className="text-gray-600 flex-1">{responsibility}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Requirements
              </h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-700">Education:</h3>
                  <p>{job.education}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Experience:</h3>
                  <p>{job.experience}</p>
                </div>
                {job.additionalRequirements && (
                  <div>
                    <h3 className="font-medium text-gray-700">
                      Additional Requirements:
                    </h3>
                    <p>{job.additionalRequirements}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Benefits */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Compensation & Benefits
              </h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span>Salary: {formatSalary(job)}</span>
                </div>
                {job.lunch && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span>Lunch Provided</span>
                  </div>
                )}
                {job.salaryReview && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span>Yearly Salary Review</span>
                  </div>
                )}
                {job.otherBenefits && (
                  <div className="mt-2">
                    <h3 className="font-medium text-gray-700 mb-1">
                      Other Benefits:
                    </h3>
                    <p>{job.otherBenefits}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Company Info */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                About the Company
              </h2>
              <p className="text-gray-600">{job.companyInfo}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
