import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Button from "../../components/button/Button";
import AlertDialog from "../../components/common/AlertDialog";
import { deleteJobForm, getAllJobForms } from "../../api/job-form";
import { getAllJobs } from "../../api/jobs";

export default function JobForms() {
  const [jobForms, setJobForms] = useState({});
  const [jobs, setJobs] = useState([]); // State to store job data
  const [showDialog, setShowDialog] = useState(false);
  const [formIdToDelete, setFormIdToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobForms = async () => {
      try {
        const data = await getAllJobForms();
        setJobForms(data);
      } catch (error) {
        console.error("Failed to fetch job forms:", error);
      }
    };
    fetchJobForms();
  }, []);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const { data } = await getAllJobs();
        setJobs(data); 
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };
    fetchAllJobs();
  }, []);

  // Function to check if a form is expired
  const isFormExpired = (formId) => {
    return jobs.some((job) => job.templateId === formId);
  };

  const handleDelete = async () => {
    try {
      await deleteJobForm(formIdToDelete);
      setJobForms((prev) => ({
        ...prev,
        data: prev.data.filter((form) => form.id !== formIdToDelete),
      }));
      console.log("Job form deleted successfully");
    } catch (error) {
      console.error("Failed to delete job form:", error);
    } finally {
      setShowDialog(false);
      setFormIdToDelete(null);
    }
  };

  const openDeleteDialog = (id) => {
    setFormIdToDelete(id);
    setShowDialog(true);
  };

  const closeDeleteDialog = () => {
    setShowDialog(false);
    setFormIdToDelete(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100 pt-4">
          All Template Forms
        </h1>

        <div className="flex justify-end my-6 w-full">
          <Link to="/jobs/forms/create">
            <Button label="Add New" variant="success" className="font-normal" />
          </Link>
        </div>

        {jobForms?.data && jobForms?.data.length > 0 ? (
          jobForms?.data.map((form) => {
            const isExpired = isFormExpired(form.id); 
            return (
              <div
                key={form.id}
                className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 mt-4 rounded-lg border ${
                  isExpired
                    ? "border-red-300 dark:border-red-700 opacity-75"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex flex-col sm:ml-6 mt-3 sm:mt-0">
                  <span className="text-lg text-left font-semibold text-gray-800 dark:text-white">
                    {form.formTitle}
                    {isExpired && (
                      <span className="ml-2 text-sm text-red-500 dark:text-red-400">
                        (Expired)
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    label="Use"
                    variant="success"
                    onClick={() => {
                      navigate(`/jobs/create?templateId=${form?.id}`);
                    }}
                    disabled={isExpired} 
                  />
                  <Link to={`/jobs/forms/edit/${form.id}`}>
                    <Button
                      label="Edit"
                      variant="primary"
                      disabled={isExpired} 
                    />
                  </Link>
                  <Button
                    label="Delete"
                    variant="danger"
                    onClick={() => openDeleteDialog(form.id)}
                    disabled={isExpired} 
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400 mt-4">
            No job forms found.
          </div>
        )}

        <AlertDialog
          isOpen={showDialog}
          onClose={closeDeleteDialog}
          title="Confirm Delete"
          message="Are you sure you want to delete this job form? This action cannot be undone."
          onConfirm={handleDelete}
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      </div>
    </div>
  );
}