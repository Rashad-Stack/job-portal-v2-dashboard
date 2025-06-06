import React from "react";
import Button from "../button/Button";
import Swal from "sweetalert2";
import "./jobIndexTable.css";
import { deleteJobIndex } from "../../api/jobIndex";

export default function JobIndexTable({ jobIndexes, onEdit }) {
  const flatJobIndexes = Array.isArray(jobIndexes[0])
    ? jobIndexes.flat()
    : jobIndexes;
  function handleDelete(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteJobIndex(id)
          .then(() => {
            Swal.fire("Deleted!", "The Job Index has been deleted.", "success");
          })
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was a problem deleting the Job Index.",
              "error"
            );
          });
      }
    });
  }
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire("Copied!", "Text copied to clipboard.", "success");
    });
  };

  return (
    <>
      <div className="jobIndexTableStyle overflow-x-auto sm:rounded-lg shadow-md bg-white dark:bg-gray-800 dark:text-gray-400">
        <table className=" text-sm text-center text-gray-500 dark:text-gray-400 hidden lg:table">
          <thead className="text-xs text-gray-700 uppercase border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800">Title</th>
              <th className="px-6 py-3 ">Job Post</th>
              <th className="px-6 py-3 w-[200px] bg-gray-50 dark:bg-gray-800">
                Sheet Link
              </th>
              <th className="px-6 py-3   truncate  whitespace-nowrap">
                Candidate Form Link
              </th>
              <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800">Status</th>
              <th className="px-6 py-3 ">Category</th>
              <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                Created By
              </th>
              <th className="px-6 py-3 w-[200px] ">Action</th>
            </tr>
          </thead>
          <tbody>
            {flatJobIndexes.reverse().map((job, index) => (
              <tr
                key={job.id || index}
                className="bg-white dark:bg-gray-900 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200"
              >
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  {job.title}
                </td>
                <td
                  className="px-6 py-4 truncate cursor-pointer max-w-[200px] overflow-hidden text-ellipsis z-50 hover:text-black hover:font-semibold"
                  onClick={() => copyToClipboard(job.jobPost)}
                  title={job.jobPost}
                >
                  {job.jobPost}
                </td>
                <td
                  className="px-6 py-4 truncate cursor-pointer max-w-[200px] bg-gray-50 dark:bg-gray-800 overflow-hidden text-ellipsis z-50 hover:text-black hover:font-semibold"
                  onClick={() => copyToClipboard(job.sheetLink)}
                  title={job.sheetLink}
                >
                  {job.sheetLink}
                </td>
                <td
                  className="px-6 py-4 truncate cursor-pointer max-w-[200px] overflow-hidden text-ellipsis z-50 hover:text-black hover:font-semibold"
                  onClick={() => copyToClipboard(job.candidateFormLink)}
                  title={job.candidateFormLink}
                >
                  {job.candidateFormLink}
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  {job.status && job.status.name ? job.status.name : job.status}
                </td>
                <td className="px-6 py-4">
                  {job.category && job.category.name
                    ? job.category.name
                    : job.category}
                </td>
                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                  {job.creator && job.creator.name
                    ? job.creator.name
                    : job.creator}
                </td>
                <td className="px-6 w-[200px] py-4 flex gap-2 justify-around items-center">
                  <Button
                    label="Edit"
                    variant="primary"
                    onClick={() => onEdit(job)}
                    className="py-1 px-4 rounded-lg shadow-sm"
                  />
                  <Button
                    label="Delete"
                    variant="danger"
                    onClick={() => handleDelete(job.id)}
                    className="py-1 px-4 rounded-lg shadow-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden text-left space-y-4 my-4 text-sm text-gray-700 dark:text-gray-400">
        {flatJobIndexes.map((job, index) => (
          <div
            key={job.id || index}
            className="bg-white  dark:bg-gray-800 p-4 rounded-lg shadow-md"
          >
            <p className="my-2">
              <span className="font-semibold">Title:</span> {job.title}
            </p>
            <p className="my-2">
              <span className="font-semibold">Job Post:</span> {job.jobPost}
            </p>
            <p
              onClick={() => copyToClipboard(job.sheetLink)}
              title={job.sheetLink}
              className="cursor-pointer max-w-[100%]  hover:font-semibold"
            >
              <span className="font-semibold">Admin Access:</span>
              {job.sheetLink || "------"}
            </p>

            <p
              onClick={() => copyToClipboard(job.candidateFormLink)}
              title={job.candidateFormLink}
              className="cursor-pointer max-w-[100%]  hover:font-semibold"
            >
              <span className="font-semibold">Candidate Form Link:</span>{" "}
              {job.candidateFormLink}
            </p>
            <p className="my-2">
              <span className="font-semibold">Status:</span>
              {job.status && job.status.name ? job.status.name : job.status}
            </p>
            <p className="my-2">
              <span className="font-semibold">Category:</span>{" "}
              {job.category && job.category.name
                ? job.category.name
                : job.category}
            </p>
            <p className="my-2">
              <span className="font-semibold">Created By:</span>{" "}
              {job.creator && job.creator.name ? job.creator.name : job.creator}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                label="Edit"
                variant="primary"
                onClick={() => onEdit(job)}
                className="py-1 px-4 rounded-lg"
              />
              <Button
                label="Delete"
                variant="danger"
                onClick={() => handleDelete(job.id)}
                className="py-1 px-4 rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
