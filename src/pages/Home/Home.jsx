import { useEffect, useState } from "react";
import TopCard from "../../components/home/TopCard";
import axios from "axios";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get("http://localhost:3000/api/v1/job/all");
      setJobs(data.data || []);
    } catch (err) {
      console.error("Failed to fetch total jobs:", err.message);
      setError("Failed to fetch Total Jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  console.log(jobs);

  return (
    <div className="min-h-screen bg-gray-50/60 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">Monitor your business metrics</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <TopCard title={"Total Jobs"} num={jobs.length} />
          <TopCard title={"Categories"} num={"5+"} />
          <TopCard title={"Total Clicks"} num={"50+"} />
          <TopCard title={"Applications"} num={"100+"} />
        </div>
      </div>
    </div>
  );
}

export default Home;
