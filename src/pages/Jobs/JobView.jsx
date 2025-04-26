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
    numberOfHiring,
    location,
    jobType,
    jobCategory,
    jobLevel,
    category,
    jobNature,
    shift,
    deadline,
    appliedBy,
  } = job;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 bg-white shadow-lg rounded-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-lg text-gray-600">{companyName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p>
          <span className="font-medium">Vacancy:</span> {numberOfHiring}
        </p>
        <p>
          <span className="font-medium">Job Type:</span>{" "}
          {jobType?.replace("_", " ")}
        </p>
        <p>
          <span className="font-medium">Job Category:</span>{" "}
          {category?.replace("_", " ")}
        </p>
        <p>
          <span className="font-medium">Job Level:</span>{" "}
          {jobLevel?.replace("_", " ")}
        </p>
        <p>
          <span className="font-medium">Job Nature:</span>{" "}
          {jobNature?.replace("_", " ")}
        </p>
        <p>
          <span className="font-medium">Applied By:</span>{" "}
          {appliedBy ? "Internal" : "External"}
        </p>
        <p>
          <span className="font-medium">Shift:</span> {shift?.replace("_", " ")}
        </p>
        <p>
          <span className="font-medium">Location:</span> {location}
        </p>
        <p>
          <span className="font-medium">Deadline:</span>{" "}
          {new Date(deadline).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
