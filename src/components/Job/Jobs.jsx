import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/"); // Redirect unauthorized users
      return;
    }

    const fetchJobs = async () => {
      try {
        const baseURL = import.meta.env.VITE_BASE_URL;

        const { data } = await axios.get(`${baseURL}/api/v1/job/getall`, {
          withCredentials: true,
        });

        setJobs(data.jobs || []); // Safeguard against undefined or null data
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false); // End loading state after fetch
      }
    };

    fetchJobs();
  }, [isAuthorized, navigateTo]);

  if (loading) {
    return (
      <section className="jobs page">
        <div className="container">
          <h1>Loading jobs...</h1>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return (
      <section className="jobs page">
        <div className="container">
          <h1>No jobs available</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="jobs page">
      <div className="container ">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="banner ">
          {jobs.map((job) => (
            <div className="card" key={job._id}>
              <p>
                <strong>Title:</strong> {job.title || "N/A"}
              </p>
              <p>
                <strong>Category:</strong> {job.category || "N/A"}
              </p>
              <p>
                <strong>Country:</strong> {job.country || "N/A"}
              </p>
              <Link to={`/job/${job._id}`}>View Job Details</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
