import React, { useState } from "react";
import Button from "../../components/button/Button";
import JobIndexTable from "../../components/jobs/JobIndexTable";
import EditJobIndex from "./EditJobIndex";
import { RxCross2 } from "react-icons/rx";

export default function JobIndexPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState({});
  const [editableJob, setEditableJob] = useState(null);

  const jobIndex = {
    title: "hello",
    jobPost: "something",
    sheetLink: "https://example.com/sheet",
    candidateFormLink: "https://example.com/form",
    status: "Active",
    category: "IT",
    createdBy: "Admin",
    _id: "123",
  };
  const title = {
    heading: " Edit Job Index",
    actionName: "Update",
  };

  function handleDelete(id) {
    console.log("Deleting job with id:", id);
  }

  return (
    <>
      <div className="flex my-6 w-full justify-end">
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

      <JobIndexTable
        jobIndex={jobIndex}
        index={0}
        setShowModal={setShowModal}
        onEdit={(job) => {
          setModalTitle({ heading: "Edit Job Index", actionName: "Update" });
          setEditableJob(job);
          setShowModal(true);
        }}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className=" dark:bg-gray-700 rounded-lg sm:w-[90%] md:w-[80%] lg:w-[50%]  h-auto ">
            <EditJobIndex
              setShowModal={setShowModal}
              jobIndex={editableJob}
              title={modalTitle}
            />
          </div>
        </div>
      )}
    </>
  );
}
