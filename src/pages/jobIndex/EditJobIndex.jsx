import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { RxCross2 } from "react-icons/rx";
import InputField from "../../components/input/InputField";
import { getAllCategories } from "../../api/category";
import SelectInput from "../../components/input/SelectInput";
import { getAllStatus } from "../../api/status";
import { createJobIndex, updateJobIndex } from "../../api/jobIndex";
import JobIndexButton from "../../components/button/JobIndexButton";

const EditJobIndex = ({ setShowModal, jobIndex, title }) => {
  const [category, setCategory] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchStatus();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await getAllCategories();
      setCategory(data);
    } catch (err) {
      console.error("Failed to fetch category:", err.message);
      setError("Failed to fetch category. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const fetchStatus = async () => {
    try {
      setLoading(true);
      const { data } = await getAllStatus();
      setStatus(data);
    } catch (err) {
      console.error("Failed to fetch status:", err.message);
      setError("Failed to fetch status. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const [formData, setFormData] = useState(
    jobIndex || {
      title: "",
      jobPost: "",
      sheetLink: "",
      adminAccess: "",
      candidateFormLink: "",
      status: "",
      statusId: "",
      category: "",
      categoryId: "",
    }
  );
  const { id } = useParams();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sanitizeData = () => {
    const cleaned = { ...formData };
    Object.keys(cleaned).forEach((key) => {
      if (typeof cleaned[key] === "string") {
        cleaned[key] = cleaned[key].trim();
      }
    });
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const cleanedFormData = sanitizeData();

    try {
      if (jobIndex?.id) {
        await updateJobIndex(jobIndex.id, cleanedFormData);
      } else {
        // Create new Job Index
        await createJobIndex(cleanedFormData);
      }

      setShowModal(false);
      window.location.reload(); // Or you can implement a more optimized state update approach
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job index");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#008f0a] relative">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            {title.heading}
          </h1>
          <button
            onClick={() => setShowModal(false)}
            className="text-white hover:text-gray-200 cursor-pointer absolute right-6 top-7 transition-colors"
          >
            <RxCross2 className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 pb-2 border-b dark:border-gray-700">
              Basic Information
            </h2>

            <div className="grid sm:grid-cols-1 md:grid-cols-1 gap-4">
              <InputField
                label="Title*"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Job Title"
              />
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Job Post*"
                type="text"
                name="jobPost"
                value={formData.jobPost}
                onChange={handleChange}
                required
                placeholder="Job Title"
              />
              <InputField
                label="Sheet Link"
                name="sheetLink"
                value={formData.sheetLink}
                type="text"
                onChange={handleChange}
              />
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Admin Access"
                name="adminAccess"
                value={formData.adminAccess}
                type="text"
                onChange={handleChange}
              />
              <InputField
                label="Candidate Form Link"
                name="candidateFormLink"
                value={formData.candidateFormLink}
                type="text"
                onChange={handleChange}
              />
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput
                name="statusId"
                label="Status"
                value={formData.statusId}
                onChange={handleChange}
                options={status.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
              <SelectInput
                name="categoryId"
                label="Job Category"
                value={formData.categoryId}
                onChange={handleChange}
                options={category.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </div>
          </section>

          <div className="pt-6">
            <JobIndexButton
              isSubmitting={isSubmitting}
              actionName={jobIndex?.id ? "Update" : "Create"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobIndex;
