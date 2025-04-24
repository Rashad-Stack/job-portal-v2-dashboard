import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Don't forget this import
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
        setLoading(true);
        setError("");
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/job/${id}`
        );
        setJob(data.data);
      } catch (err) {
        console.error("Failed to fetch job:", err.message);
        setError("Failed to fetch job. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;
  if (!job) return <div className="text-center p-4">Job not found</div>;

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
              <InfoItem icon={<FaMapMarkerAlt />} label={job.location} />
              <InfoItem icon={<FaBriefcase />} label={job.jobType} />
              <InfoItem icon={<FaClock />} label={job.experience} />
              <InfoItem icon={<FaDollarSign />} label={formatSalary(job)} />
              <InfoItem
                icon={<FaUsers />}
                label={`${job.vacancy} ${
                  job.vacancy > 1 ? "Positions" : "Position"
                }`}
              />
              <InfoItem
                icon={<FaCalendarAlt />}
                label={`Deadline: ${new Date(
                  job.deadline
                ).toLocaleDateString()}`}
              />
            </div>

            {/* Skills */}
            {Array.isArray(job.skills) && job.skills.length > 0 && (
              <Section title="Required Skills">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Responsibilities */}
            {Array.isArray(job.responsibilities) &&
              job.responsibilities.length > 0 && (
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
              )}

            {/* Requirements */}
            <Section title="Requirements">
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
            </Section>

            {/* Benefits */}
            <Section title="Compensation & Benefits">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Salary: {formatSalary(job)}
                </li>
                {job.lunch && (
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Lunch Provided
                  </li>
                )}
                {job.salaryReview && (
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Yearly Salary Review
                  </li>
                )}
                {job.otherBenefits && (
                  <li className="mt-2">
                    <h3 className="font-medium text-gray-700 mb-1">
                      Other Benefits:
                    </h3>
                    <p>{job.otherBenefits}</p>
                  </li>
                )}
              </ul>
            </Section>

            {/* Company Info */}
            <Section title="About the Company">
              <p className="text-gray-600">{job.companyInfo}</p>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <section>
    <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
    {children}
  </section>
);

const InfoItem = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <span className="text-indigo-500">{icon}</span>
    <span>{label}</span>
  </div>
);
