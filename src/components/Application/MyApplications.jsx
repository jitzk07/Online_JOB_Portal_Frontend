/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [loading, setLoading] = useState(true); // Loading state to manage fetch lifecycle
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const baseURL = import.meta.env.VITE_BASE_URL;

        if (user?.role === "Employer") {
          const { data } = await axios.get(
            `${baseURL}/api/v1/application/employer/getall`,
            { withCredentials: true }
          );
          setApplications(data.applications);
        } else if (user?.role === "Job Seeker") {
          const { data } = await axios.get(
            `${baseURL}/api/v1/application/jobseeker/getall`,
            { withCredentials: true }
          );
          setApplications(data.applications);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong."
        );
      } finally {
        setLoading(false); // End loading after fetch
      }
    };

    if (isAuthorized) {
      fetchApplications();
    } else {
      setLoading(false); // Skip fetch if unauthorized
    }
  }, [user, isAuthorized]);

  useEffect(() => {
    if (!isAuthorized && !loading) {
      navigateTo("/");
    }
  }, [isAuthorized, loading, navigateTo]);

  const deleteApplication = async (id) => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;

      const { data } = await axios.post(
        `${baseURL}/api/v1/application/delete/${id}`,
        {},
        { withCredentials: true }
      );

      toast.success(data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong."
      );
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (loading) {
    return <p>Loading...</p>; // Display loading indicator during fetch
  }

  return (
    <section className="my_applications page">
      {user?.role === "Job Seeker" ? (
        <div className="container">
          <h1>My Applications</h1>
          {applications.length === 0 ? (
            <h4>No Applications Found</h4>
          ) : (
            applications.map((element) => (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))
          )}
        </div>
      ) : (
        <div className="container">
          <h1>Applications From Job Seekers</h1>
          {applications.length === 0 ? (
            <h4>No Applications Found</h4>
          ) : (
            applications.map((element) => (
              <EmployerCard
                element={element}
                key={element._id}
                openModal={openModal}
              />
            ))
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>Cover Letter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume">
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url)}
        />
      </div>
      <div className="btn_area">
        <button onClick={() => deleteApplication(element._id)}>
          Delete Application
        </button>
      </div>
    </div>
  );
};

const EmployerCard = ({ element, openModal }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>Cover Letter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume">
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url)}
        />
      </div>
    </div>
  );
};
