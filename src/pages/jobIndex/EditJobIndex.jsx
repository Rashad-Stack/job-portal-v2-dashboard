import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getJobById, updateJob } from "../../api/jobs";
import { RxCross2 } from "react-icons/rx";

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
    <>
      <div className="flex items-center justify-between sm:h-[80%] "></div>
      <div className=" bg-gray-50/60 ">
        <div className=" mx-auto">
          <div className=" overflow-hidden shadow-sm">
            <div className="p-6 bg-gradient-to-r from-[#00ab0c] to-[#008f0a] relative">
              <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                {title.heading}
              </h1>
              <button
                onClick={() => setShowModal(false)}
                className="text-white font-bold hover:text-gray-900 dark:hover:text-white cursor-pointer absolute right-6 top-7"
              >
                <RxCross2 className="text-3xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                  {error}
                </div>
              )}

              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b">
                  Basic Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
                    required
                    placeholder="Job Title"
                  />
                </div>

                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Job Post"
                    name="jobPost"
                    value={formData.jobPost}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Sheet Link"
                    name="sheetLink"
                    value={formData.sheetLink}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Admin Access"
                    name="adminAccess"
                    value={formData.adminAccess}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Candidate Form Link"
                    name="candidateFormLink"
                    value={formData.candidateFormLink}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Status ID"
                    name="statusId"
                    value={formData.status}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Category ID"
                    name="categoryId"
                    value={formData.category}
                    onChange={handleChange}
                  />
                  <InputField
                    label="Created By"
                    name="createdBy"
                    value={formData.createdBy}
                    onChange={handleChange}
                  />
                </div>
              </section>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c] text-white font-medium rounded-lg hover:from-[#549458] hover:to-[#15881c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                >
                  {isSubmitting ? `${title.actionName}...` : title.actionName}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623]"
    />
  </div>
);

export default EditJobIndex;
