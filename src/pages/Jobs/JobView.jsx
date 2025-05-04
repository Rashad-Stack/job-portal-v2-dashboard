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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const { data: jobData } = await getJobById(id);
        setJob(jobData);

        const { data: categoryData } = await getCategoryById(
          jobData.categoryId
        );
        setMyCategory(categoryData);
      } catch (err) {
        console.error("Error fetching job or category:", err.message);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c] hover:bg-blue-700 text-white rounded-full  transition-all duration-300"
        >
          <PencilSquareIcon className="h-5 w-5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
        <p>
          <span className="font-semibold">Vacancy:</span> {numberOfHiring}
        </p>
        <p>
          <span className="font-semibold">Job Type:</span>{" "}
          {jobType?.replace("_", " ")}
        </p>
        <p>
          <span className="font-semibold">Job Category:</span> {myCategory.name}
        </p>
        <p>
          <span className="font-semibold">Job Level:</span>{" "}
          {jobLevel?.replace("_", " ")}
        </p>
        <p>
          <span className="font-semibold">Job Nature:</span>{" "}
          {jobNature?.replace("_", " ")}
        </p>
        <p>
          <span className="font-semibold">Applied By:</span>{" "}
          {appliedBy ? "Internal" : "External"}
        </p>
        <p>
          <span className="font-semibold">Shift:</span>{" "}
          {shift?.replace("_", " ")}
        </p>
        <p>
          <span className="font-semibold">Location:</span> {location}
        </p>
        <p>
          <span className="font-semibold">Deadline:</span>{" "}
          {new Date(deadline).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
