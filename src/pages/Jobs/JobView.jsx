import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getJobById } from "../../api/jobs";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { getCategoryById } from "../../api/category";

export default function JobView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [myCategory, setMyCategory] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [jobLoading, setJobLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch job by ID
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setJobLoading(true);
        setError("");
        const { data } = await getJobById(id);
        setJob(data);
        setCategoryId(data.categoryId);
      } catch (err) {
        console.error("Failed to fetch job:", err.message);
        setError("Failed to fetch job. Please try again later.");
      } finally {
        setJobLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // Fetch category by categoryId
  useEffect(() => {
    const fetchMyCategory = async () => {
      if (!categoryId) return;
      try {
        setCategoryLoading(true);
        setError("");
        const { data } = await getCategoryById(categoryId);
        setMyCategory(data);
      } catch (err) {
        console.error("Failed to fetch Category:", err.message);
        setError("Failed to fetch Category. Please try again later.");
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchMyCategory();
  }, [categoryId]);

  if (jobLoading || categoryLoading) {
    return <div className="text-center p-6 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600">{error}</div>;
  }

  if (!job) {
    return <div className="text-center p-6 text-gray-500">Job not found</div>;
  }

  const {
    title,
    companyName,
    numberOfHiring,
    location,
    jobType,
    jobLevel,
    jobNature,
    shift,
    deadline,
    appliedBy,
  } = job;

  const handleEdit = () => {
    navigate(`/jobs/edit/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 bg-white shadow-2xl rounded-3xl space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">{title}</h1>
          <p className="text-lg text-gray-600">{companyName}</p>
        </div>
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c] hover:opacity-90 text-white rounded-full shadow-md transition-all duration-300"
        >
          <PencilSquareIcon className="h-5 w-5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <p>
          <span className="font-semibold">Vacancy:</span>{" "}
          {numberOfHiring ?? "N/A"}
        </p>
        <p>
          <span className="font-semibold">Job Type:</span>{" "}
          {jobType?.replace("_", " ") ?? "N/A"}
        </p>
        <p>
          <span className="font-semibold">Job Category:</span>{" "}
          {myCategory?.name?.replace("_", " ") ?? "N/A"}
        </p>
        <p>
          <span className="font-semibold">Job Level:</span>{" "}
          {jobLevel?.replace("_", " ") ?? "N/A"}
        </p>
        <p>
          <span className="font-semibold">Job Nature:</span>{" "}
          {jobNature?.replace("_", " ") ?? "N/A"}
        </p>
        <p>
          <span className="font-semibold">Applied By:</span>{" "}
          {appliedBy !== undefined
            ? appliedBy
              ? "Internal"
              : "External"
            : "N/A"}
        </p>
        <p>
          <span className="font-semibold">Shift:</span>{" "}
          {shift?.replace("_", " ") ?? "N/A"}
        </p>
        <p>
          <span className="font-semibold">Location:</span> {location ?? "N/A"}
        </p>
        <p>
          <span className="font-semibold">Deadline:</span>{" "}
          {deadline ? new Date(deadline).toLocaleDateString() : "N/A"}
        </p>
      </div>
    </div>
  );
}
