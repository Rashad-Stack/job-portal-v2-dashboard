import React from 'react';
import Button from '../button/Button';
import Swal from 'sweetalert2';

export default function JobIndexTable({ jobIndex, setShowModal, onEdit }) {
  function handleDelete() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  return (
    <>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400 hidden lg:table">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Job Post</th>
              <th className="px-6 py-3">Sheet Link</th>
              <th className="px-6 py-3">Candidate Form Link</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Created By</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
              <th className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                {jobIndex.title}
              </th>
              <td className="px-6 py-4">{jobIndex.jobPost}</td>
              <td className="px-6 py-4">{jobIndex.sheetLink}</td>
              <td className="px-6 py-4">{jobIndex.candidateFormLink}</td>
              <td className="px-6 py-4">{jobIndex.status}</td>
              <td className="px-6 py-4">{jobIndex.category}</td>
              <td className="px-6 py-4">{jobIndex.createdBy}</td>
              <td className="px-6 py-4 flex">
                <Button
                  label="Edit"
                  variant="primary"
                  className="mx-2"
                  onClick={() => onEdit(jobIndex)}
                />
                <Button label="Delete" onClick={handleDelete} variant="danger" />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4 text-sm text-gray-700 dark:text-gray-400">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <p>
              <span className="font-semibold">Title:</span> {jobIndex.title}
            </p>
            <p>
              <span className="font-semibold">Job Post:</span> {jobIndex.jobPost}
            </p>
            <p>
              <span className="font-semibold">Sheet Link:</span> {jobIndex.sheetLink}
            </p>
            <p>
              <span className="font-semibold">Candidate Form Link:</span>{' '}
              {jobIndex.candidateFormLink}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {jobIndex.status}
            </p>
            <p>
              <span className="font-semibold">Category:</span> {jobIndex.category}
            </p>
            <p>
              <span className="font-semibold">Created By:</span> {jobIndex.createdBy}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button label="View" variant="outline" />
              <Button label="Edit" variant="primary" onClick={() => setShowModal(true)} />
              <Button label="Delete" onClick={handleDelete} variant="danger" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
