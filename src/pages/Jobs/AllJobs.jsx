import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import JobsTable from '../../components/jobs/JobsTable';

const AllJobs = () => {
  const initialState = [
    {
      _id: '111111',
      title: 'Jr. MERN Stack Developer',
      company: 'bdCalling IT Ltd',
      location: 'Banasree, Rampura, Dhaka',
    },
    {
      _id: '111111',
      title: 'Jr. MERN Stack Developer',
      company: 'bdCalling IT Ltd',
      location: 'Banasree, Rampura, Dhaka',
    },
    {
      _id: '111111',
      title: 'Jr. MERN Stack Developer',
      company: 'bdCalling IT Ltd',
      location: 'Banasree, Rampura, Dhaka',
    },
  ];

  const [jobs, setJobs] = useState(initialState);
  console.log(jobs);
  const [error, setError] = useState('');

  //   useEffect(() => {
  //     fetchJobs();
  //   }, []);

  //   const fetchJobs = async () => {
  //     try {
  //       const response = await axios.get('/api/jobs');
  //       setJobs(response.data);
  //     } catch (error) {
  //       setError('Failed to fetch jobs.');
  //     }
  //   };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/jobs/${id}`);
      if (response.status === 200) {
        setJobs(jobs.filter((job) => job._id !== id));
      } else {
        setError('Failed to delete job.');
      }
    } catch (error) {
      setError('Failed to delete job.');
    }
  };

  return (
    <div className="sm:max-w-7xl w-full mx-auto p-4 mt-10 bg-white shadow rounded-lg">
      <h2 className="sm:text-2xl text-center sm:mt-0 mt-2 mb-4 text-xl font-semibold text-gray-600">
        All Jobs
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="my-6">
        <table className="sm:max-w-7xl w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-center">Location</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {Array.isArray(jobs) &&
              jobs.map((job, index) => (
                <JobsTable key={job._id} job={job} index={index} handleDelete={handleDelete} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllJobs;
