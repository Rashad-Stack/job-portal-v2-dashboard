import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import JobsTable from "../../components/jobs/JobsTable";

const AllJobs = () => {
  const initialState = [
    {
      _id: "111111",
      title: "Sr. MERN Stack Developer",
      companyName: "Tech Solutions Ltd",
      location: "Dhaka, Bangladesh",
      jobType: "Full Time",
      salary: "$2000 - $3000",
      experience: "3-5 years",
      deadline: "2024-04-30",
      skills: "React, Node.js, MongoDB, Express",
      vacancy: 2,
    },
    {
      _id: "222222",
      title: "UI/UX Designer",
      companyName: "Creative Studio",
      location: "Remote",
      jobType: "Full Time",
      salary: "$1500 - $2500",
      experience: "2-4 years",
      deadline: "2024-04-25",
      skills: "Figma, Adobe XD, User Research",
      vacancy: 1,
    },
  ];

  const [jobs, setJobs] = useState(initialState);
  const [error, setError] = useState("");

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
        setError("Failed to delete job.");
      }
    } catch (error) {
      setError("Failed to delete job.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              All Job Posts
            </h1>
          </div>

          <div className="p-6">
            {error && (
              <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-6">
              {Array.isArray(jobs) &&
                jobs.map((job, index) => (
                  <JobsTable
                    key={job._id}
                    job={job}
                    index={index}
                    handleDelete={handleDelete}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllJobs;
