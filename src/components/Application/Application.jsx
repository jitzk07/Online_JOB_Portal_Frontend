import axios from "axios";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!isAuthorized || (user && user.role === "Employer")) {
      navigateTo("/"); // Redirect unauthorized users or employers
    }
  }, [isAuthorized, user, navigateTo]);

  // Handle file input changes with type and size validation
  const handleFileChange = (event) => {
    const selectedResume = event.target.files[0];
    if (selectedResume) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxFileSize = 5 * 1024 * 1024; // 5 MB

      if (!allowedTypes.includes(selectedResume.type)) {
        toast.error("Invalid file type. Please upload a PDF, JPG, or PNG file.");
        return;
      }

      if (selectedResume.size > maxFileSize) {
        toast.error("File size exceeds 5MB. Please upload a smaller file.");
        return;
      }

      setResume(selectedResume);
    }
  };

  const handleApplication = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !email || !phone || !address || !coverLetter || !resume) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const baseURL = import.meta.env.VITE_BASE_URL;

      const { data } = await axios.post(
        `${baseURL}/api/v1/application/post`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Clear form inputs on success
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume(null);

      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      console.error("Error:", error); // Debugging: Log the entire error object

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section className="application">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <textarea
            placeholder="Cover Letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
          />
          <div>
            <label
              style={{ textAlign: "start", display: "block", fontSize: "20px" }}
            >
              Select Resume
            </label>
            <input
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={handleFileChange}
              style={{ width: "100%" }}
              required
            />
          </div>
          <button type="submit">Send Application</button>
        </form>
      </div>
    </section>
  );
};

export default Application;
