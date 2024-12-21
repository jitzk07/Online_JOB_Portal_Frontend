/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null); // Initialize with null to differentiate between loading and empty data
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login"); // Redirect unauthorized users
      return;
    }

    const fetchJobDetails = async () => {
      try {
        const baseURL = import.meta.env.VITE_BASE_URL;
        const { data } = await axios.get(`${baseURL}/api/v1/job/${id}`, {
          withCredentials: true,
        });
        setJob(data.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
        navigateTo("/notfound"); // Redirect to not found if job doesn't exist or error occurs
      }
    };

    fetchJobDetails();
  }, [id, isAuthorized, navigateTo]);

  if (!job) {
    return (
      <section className="jobDetail page">
        <div className="container">
          <h3>Loading Job Details...</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Job Details</h3>
        <div className="banner">
          <p>
            Title: <span>{job.title || "N/A"}</span>
          </p>
          <p>
            Category: <span>{job.category || "N/A"}</span>
          </p>
          <p>
            Country: <span>{job.country || "N/A"}</span>
          </p>
          <p>
            City: <span>{job.city || "N/A"}</span>
          </p>
          <p>
            Location: <span>{job.location || "N/A"}</span>
          </p>
          <p>
            Description: <span>{job.description || "N/A"}</span>
          </p>
          <p>
            Job Posted On:{" "}
            <span>{job.jobPostedOn ? new Date(job.jobPostedOn).toLocaleDateString() : "N/A"}</span>
          </p>
          <p>
            Salary:{" "}
            {job.fixedSalary ? (
              <span>{`$${job.fixedSalary}`}</span>
            ) : (
              <span>
                {`$${job.salaryFrom || 0}`} - {`$${job.salaryTo || "Negotiable"}`}
              </span>
            )}
          </p>
          {user && user.role === "Employer" ? (
            <p>Employers cannot apply for jobs.</p>
          ) : (
            <Link to={`/application/${job._id}`}>Apply Now</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
