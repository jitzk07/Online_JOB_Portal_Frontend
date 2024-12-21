/* eslint-disable react/no-unescaped-entities */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  // Fetch jobs
  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
      return;
    }

    const fetchJobs = async () => {
      try {
        const baseURL = import.meta.env.VITE_BASE_URL;
        const { data } = await axios.get(`${baseURL}/api/v1/job/getmyjobs`, {
          withCredentials: true,
        });
        setMyJobs(data.myJobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error(error.response?.data?.message || "Something went wrong.");
        setMyJobs([]);
      }
    };

    fetchJobs();
  }, [isAuthorized, user, navigateTo]);

  // Enable editing mode
  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  // Disable editing mode
  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  // Update job
  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);

    if (!updatedJob) {
      toast.error("Job not found!");
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const { data } = await axios.post(
        `${baseURL}/api/v1/job/update/${jobId}`,
        updatedJob,
        { withCredentials: true }
      );

      toast.success(data.message);
      setEditingMode(null);
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Delete job
  const handleDeleteJob = async (jobId) => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;
      const { data } = await axios.post(
        `${baseURL}/api/v1/job/delete/${jobId}`,
        {},
        { withCredentials: true }
      );

      toast.success(data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Handle input changes for editing
  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <div className="myJobs page">
      <div className="container">
        <h1>Your Posted Jobs</h1>
        {myJobs.length > 0 ? (
          <div className="banner">
            {myJobs.map((job) => (
              <div className="card" key={job._id}>
                <div className="content">
                  <div className="short_fields">
                    <div>
                      <span>Title:</span>
                      <input
                        type="text"
                        disabled={editingMode !== job._id}
                        value={job.title || ""}
                        onChange={(e) =>
                          handleInputChange(job._id, "title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <span>Country:</span>
                      <input
                        type="text"
                        disabled={editingMode !== job._id}
                        value={job.country || ""}
                        onChange={(e) =>
                          handleInputChange(job._id, "country", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <span>City:</span>
                      <input
                        type="text"
                        disabled={editingMode !== job._id}
                        value={job.city || ""}
                        onChange={(e) =>
                          handleInputChange(job._id, "city", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <span>Category:</span>
                      <select
                        value={job.category || ""}
                        onChange={(e) =>
                          handleInputChange(job._id, "category", e.target.value)
                        }
                        disabled={editingMode !== job._id}
                      >
                        <option value="">Select Category</option>
                        <option value="Graphics & Design">Graphics & Design</option>
                        <option value="Mobile App Development">
                          Mobile App Development
                        </option>
                        <option value="Frontend Web Development">
                          Frontend Web Development
                        </option>
                        <option value="MERN Stack Development">
                          MERN Stack Development
                        </option>
                        <option value="Account & Finance">
                          Account & Finance
                        </option>
                        <option value="Artificial Intelligence">
                          Artificial Intelligence
                        </option>
                        <option value="Video Animation">Video Animation</option>
                        <option value="MEAN Stack Development">
                          MEAN Stack Development
                        </option>
                        <option value="MEVN Stack Development">
                          MEVN Stack Development
                        </option>
                        <option value="Data Entry Operator">
                          Data Entry Operator
                        </option>
                      </select>
                    </div>
                    <div>
                      <span>Salary:</span>
                      {job.fixedSalary ? (
                        <input
                          type="number"
                          disabled={editingMode !== job._id}
                          value={job.fixedSalary || 0}
                          onChange={(e) =>
                            handleInputChange(
                              job._id,
                              "fixedSalary",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        <div>
                          <input
                            type="number"
                            disabled={editingMode !== job._id}
                            value={job.salaryFrom || 0}
                            onChange={(e) =>
                              handleInputChange(
                                job._id,
                                "salaryFrom",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="number"
                            disabled={editingMode !== job._id}
                            value={job.salaryTo || 0}
                            onChange={(e) =>
                              handleInputChange(
                                job._id,
                                "salaryTo",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="long_field">
                    <div>
                      <span>Description:</span>
                      <textarea
                        rows={5}
                        value={job.description || ""}
                        disabled={editingMode !== job._id}
                        onChange={(e) =>
                          handleInputChange(
                            job._id,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="button_wrapper">
                  <div className="edit_btn_wrapper">
                    {editingMode === job._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateJob(job._id)}
                          className="check_btn"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={handleDisableEdit}
                          className="cross_btn"
                        >
                          <RxCross2 />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEnableEdit(job._id)}
                        className="edit_btn"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="delete_btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>
            You've not posted any jobs or maybe you deleted all of your jobs!
          </p>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
