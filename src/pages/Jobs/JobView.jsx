import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getCategoryById } from "../../api/category";
import { getJobById } from "../../api/jobs";

const formatInputDate = (date) => {
  if (!date || date === "1970-11-03T00:00:00.000Z") return "";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "";
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
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

  // if (!jobLoading || !categoryLoading) {
  //   return <div className="text-center p-6 text-gray-500">Loading...</div>;
  // }

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
    <div className="max-w-5xl mx-auto px-6 py-8 bg-gradient-to-r from-gray-50 to-gray-100  rounded-2xl space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-gray-800">{title}</h1>
          <p className="text-lg text-left text-gray-600">{companyName}</p>
        </div>
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c] hover:opacity-90 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
          <PencilSquareIcon className="h-5 w-5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700">
        <p className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <span className="font-semibold text-gray-800">Number of Hiring:</span>{" "}
          {numberOfHiring ?? "N/A"}
        </p>
        <p className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <span className="font-semibold text-gray-800">Job Type:</span>{" "}
          {jobType?.replace("_", " ") ?? "N/A"}
        </p>
        <p className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <span className="font-semibold text-gray-800">Job Category:</span>{" "}
          {myCategory?.name?.replace("_", " ") ?? "N/A"}
        </p>
        <p className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <span className="font-semibold text-gray-800">Job Level:</span>{" "}
          {jobLevel?.replace("_", " ") ?? "N/A"}
        </p>
        <p className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <span className="font-semibold text-gray-800">Job Nature:</span>{" "}
          {jobNature?.replace("_", " ") ?? "N/A"}
        </p>
        <p className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <span className="font-semibold text-gray-800">Applied By:</span>{" "}
          {appliedBy !== undefined
            ? appliedBy
              ? "Internal"
              : "External"
            : "N/A"}
        </p>
        <p className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <span className="font-semibold text-gray-800">Shift:</span>{" "}
          {shift?.replace("_", " ") ?? "N/A"}
        </p>
        <p className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <span className="font-semibold text-gray-800">Location:</span>{" "}
          {location ?? "N/A"}
        </p>
        <p className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <span className="font-semibold text-gray-800">Deadline:</span>{" "}
          {deadline ? formatInputDate(deadline) : "N/A"}
        </p>
      </div>
    </div>
  );
}
