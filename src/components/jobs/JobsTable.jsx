import { Link } from 'react-router-dom';

export default function JobsTable({ job, index, handleDelete }) {
  // Define a color scheme
  const colors = ['bg-white', 'bg-gray-200'];
  const rowColor = colors[index % colors.length]; // Cycle through colors

  return (
    <tr key={job._id} className={`border-b border-gray-200 text-md font-normal ${rowColor}`}>
      <td className="p-2 text-left">{job.title}</td>
      <td className="p-2 text-left">{job.company}</td>
      <td className="p-2 text-center">{job.location}</td>
      <td className="p-2 text-center">
        <div className="flex item-center justify-center">
          <Link
            to={`/dashboard/edit-job/${job._id}`}
            className="w-16 p-2 ml-2 bg-green-600 transform hover:scale-110  rounded-[4px]"
          >
            <span className="text-white font-medium">Edit</span>
          </Link>
          <button
            onClick={() => handleDelete(job._id)}
            className="w-16 p-2 ml-2 bg-red-600 transform hover:scale-110 rounded-[4px]"
          >
            <span className="text-white font-medium">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
