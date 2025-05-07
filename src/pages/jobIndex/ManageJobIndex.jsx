import React, { useState, useEffect } from "react";
import Button from "../../components/button/Button";
import JobIndexTable from "../../components/jobIndex/JobIndexTable";
import EditJobIndex from "./EditJobIndex";
import { getAllJobIndex } from "../../api/jobIndex";
import "../../components/jobIndex/jobIndexTable.css";

export default function JobIndexPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState({});
  const [editableJob, setEditableJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [jobIndex, setJobIndex] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchJobIndex = async () => {
      try {
        setLoading(true);
        const { data } = await getAllJobIndex();
        setJobIndex(data);
      } catch (err) {
        console.error("Failed to fetch job index:", err.message);
        setError("Failed to fetch job index. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobIndex();
  }, []);

  return (
    <div className="jobIndexTableStyle2 min-h-screen bg-white dark:bg-gray-900 ">
      <div className="max-w-full mx-auto">
        <div className="flex justify-end my-6 w-full">
          <Button
            label="Add New"
            variant="success"
            className="font-normal"
            onClick={() => {
              setModalTitle({
                heading: "Create Job Index",
                actionName: "Create",
              });
              setEditableJob(null);
              setShowModal(true);
            }}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <JobIndexTable
            jobIndexes={[jobIndex]}
            index={0}
            setShowModal={setShowModal}
            onEdit={(job) => {
              setModalTitle({
                heading: "Edit Job Index",
                actionName: "Update",
              });
              setEditableJob(job);
              setShowModal(true);
            }}
          />
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg  border border-gray-200 dark:border-gray-700 sm:w-[90%] md:w-[80%] lg:w-[50%] h-auto">
              <EditJobIndex
                setShowModal={setShowModal}
                jobIndex={editableJob}
                title={modalTitle}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
