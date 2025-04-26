import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../api/jobs";

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
        const { data } = await getJobById(id);
        console.log("Job API response:", data);
        setJob(data);
      } catch (err) {
        console.error("Failed to fetch job:", err.message);
        setError("Failed to fetch job. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading)
    return <div className="text-center p-6 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;
  if (!job)
    return <div className="text-center p-6 text-gray-500">Job not found</div>;

  const {
    title,
    companyName,
    vacancy,
    location,
    salaryType,
    salaryMin,
    salaryMax,
    fixedSalary,
    jobType,
    experience,
    education,
    additionalRequirements,
    responsibilities,
    skills,
    lunch,
    salaryReview,
    otherBenefits,
    companyInfo,
    deadline,
  } = job;

  const getSalaryText = () => {
    if (salaryType === "NEGOTIABLE") return "Negotiable";
    if (salaryType === "FIXED") return `${fixedSalary} BDT (Fixed)`;
    if (salaryType === "RANGE")
      return `${salaryMin} - ${salaryMax} BDT (Monthly)`;
    return "Not specified";
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 bg-white shadow-lg rounded-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-lg text-gray-600">{companyName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p>
          <span className="font-medium">Vacancy:</span> {vacancy}
        </p>
        <p>
          <span className="font-medium">Job Type:</span>{" "}
          {jobType?.replace("_", " ")}
        </p>
        <p>
          <span className="font-medium">Location:</span> {location}
        </p>

        <p>
          <span className="font-medium">Experience:</span> {experience}
        </p>
        <p>
          <span className="font-medium">Education:</span> {education}
        </p>
        <p>
          <span className="font-medium">Deadline:</span>{" "}
          {new Date(deadline).toLocaleDateString()}
        </p>
      </div>

      {skills && (
        <div>
          <h2 className="text-xl font-semibold text-indigo-500 mb-2">
            Required Skills
          </h2>
          <p className="text-gray-700">{skills}</p>
        </div>
      )}

      {additionalRequirements && (
        <div>
          <h2 className="text-xl font-semibold text-indigo-500 mb-2">
            Additional Requirements
          </h2>
          <p className="text-gray-700">{additionalRequirements}</p>
        </div>
      )}

      {responsibilities?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-indigo-500 mb-2">
            Responsibilities
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {responsibilities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-indigo-500 mb-2">
          Compensation & Other Benefits
        </h2>

        <p>
          <span className="font-medium">Salary:</span> {getSalaryText()}
        </p>

        {lunch === "true" && (
          <p>
            <span className="font-medium">Lunch:</span> Provided
          </p>
        )}
        {salaryReview === "true" && (
          <p>
            <span className="font-medium">Salary Review:</span> Yearly
          </p>
        )}
        {otherBenefits && (
          <p>
            <span className="font-medium">Other Benefits:</span> {otherBenefits}
          </p>
        )}
      </div>
      {companyInfo && (
        <div>
          <h2 className="text-xl font-semibold text-indigo-500 mb-2">
            About the Company
          </h2>
          <p className="text-gray-700">{companyInfo}</p>
        </div>
      )}
    </div>
  );
}
