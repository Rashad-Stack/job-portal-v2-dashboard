import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getJobById, updateJob } from "../../api/jobs";
import { RxCross2 } from "react-icons/rx";
import IndexTableInputField from "../../components/jobIndex/IndexTableInputField";
import InputField from "../../components/input/InputField";

const EditJobIndex = ({ setShowModal, jobIndex, title }) => {
  const [formData, setFormData] = useState(
    jobIndex || {
      title: "",
      jobPost: "",
      sheetLink: "",
      adminAccess: "",
      candidateFormLink: "",
      status: "",
      category: "",
      createdBy: "",
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
      await updateJob(id, cleanedFormData);
      setShowModal(false); // Close modal after success
      navigate("/jobs/read");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job");
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

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Title*"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Job Title"
              />
              <InputField
                label="Job Post*"
                type="text"
                name="jobPost"
                value={formData.jobPost}
                onChange={handleChange}
                required
                placeholder="Job Title"
              />
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Sheet Link"
                name="sheetLink"
                value={formData.sheetLink}
                type="text"
                onChange={handleChange}
              />
              <InputField
                label="Admin Access"
                name="adminAccess"
                value={formData.adminAccess}
                type="text"
                onChange={handleChange}
              />
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="candidate Form Link"
                name="candidateFormLink"
                value={formData.candidateFormLink}
                type="text"
                onChange={handleChange}
              />
              <InputField
                label="Status"
                name="status"
                value={formData.status}
                type="text"
                onChange={handleChange}
              />
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Category"
                name="category"
                value={formData.category}
                type="text"
                onChange={handleChange}
              />
              <InputField
                label="Created By"
                name="createdBy"
                value={formData.createdBy}
                type="text"
                onChange={handleChange}
              />
            </div>
          </section>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c] text-white font-medium rounded-lg hover:from-[#549458] hover:to-[#15881c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ab0c] transition-all duration-300"
            >
              {isSubmitting ? `${title.actionName}...` : title.actionName}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobIndex;
