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
  const navigateTo = useNavigate();

  useEffect(() => {
    // Redirect unauthorized users
    if (!isAuthorized) {
      navigateTo("/");
      return;
    }

    const fetchApplications = async () => {
      try {
        const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";
        const endpoint =
          user?.role === "Employer"
            ? "/api/v1/application/employer/getall"
            : "/api/v1/application/jobseeker/getall";

        const { data } = await axios.get(`${baseURL}${endpoint}`, {
          withCredentials: true,
        });

        setApplications(data.applications || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error(
          error.response?.data?.message || error.message || "Something went wrong."
        );
      }
    };

    fetchApplications();
  }, [isAuthorized, user, navigateTo]);

  const deleteApplication = async (id) => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL ;
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
        error.response?.data?.message || error.message || "Something went wrong."
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

  if (!user) return null; // Ensure component doesn't render prematurely

  return (
    <section className="my_applications page">
      <div className="container">
        <h1>
          {user.role === "Job Seeker"
            ? "My Applications"
            : "Applications From Job Seekers"}
        </h1>
        {applications.length === 0 ? (
          <h4>No Applications Found</h4>
        ) : (
          applications.map((element) =>
            user.role === "Job Seeker" ? (
              <JobSeekerCard
                key={element._id}
                element={element}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ) : (
              <EmployerCard
                key={element._id}
                element={element}
                openModal={openModal}
              />
            )
          )
        )}
      </div>
      {modalOpen && <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />}
    </section>
  );
};

export default MyApplications;

// Job Seeker Card
const JobSeekerCard = ({ element, deleteApplication, openModal }) => (
  <div className="job_seeker_card">
    <div className="detail">
      <p>
        <span>Name:</span> {element.name || "N/A"}
      </p>
      <p>
        <span>Email:</span> {element.email || "N/A"}
      </p>
      <p>
        <span>Phone:</span> {element.phone || "N/A"}
      </p>
      <p>
        <span>Address:</span> {element.address || "N/A"}
      </p>
      <p>
        <span>CoverLetter:</span> {element.coverLetter || "N/A"}
      </p>
    </div>
    <div className="resume">
      {element.resume?.url ? (
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url)}
        />
      ) : (
        <p>No Resume Available</p>
      )}
    </div>
    <div className="btn_area">
      <button onClick={() => deleteApplication(element._id)}>
        Delete Application
      </button>
    </div>
  </div>
);

// Employer Card
const EmployerCard = ({ element, openModal }) => (
  <div className="job_seeker_card">
    <div className="detail">
      <p>
        <span>Name:</span> {element.name || "N/A"}
      </p>
      <p>
        <span>Email:</span> {element.email || "N/A"}
      </p>
      <p>
        <span>Phone:</span> {element.phone || "N/A"}
      </p>
      <p>
        <span>Address:</span> {element.address || "N/A"}
      </p>
      <p>
        <span>CoverLetter:</span> {element.coverLetter || "N/A"}
      </p>
    </div>
    <div className="resume">
      {element.resume?.url ? (
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url)}
        />
      ) : (
        <p>No Resume Available</p>
      )}
    </div>
  </div>
);
