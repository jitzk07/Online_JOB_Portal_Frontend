import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("");

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleJobPost = async (e) => {
    e.preventDefault();

    // Field validation
    if (!title || !description || !category || !country || !city || !location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (salaryType === "Fixed Salary" && !fixedSalary) {
      toast.error("Please provide a fixed salary.");
      return;
    }

    if (salaryType === "Ranged Salary") {
      if (!salaryFrom || !salaryTo) {
        toast.error("Please provide both salary range values.");
        return;
      }
      if (Number(salaryFrom) > Number(salaryTo)) {
        toast.error("'Salary From' cannot be greater than 'Salary To'.");
        return;
      }
    }

    try {
      const baseURL = import.meta.env.VITE_BASE_URL;

      const jobData =
        salaryType === "Fixed Salary"
          ? {
              title,
              description,
              category,
              country,
              city,
              location,
              fixedSalary,
            }
          : {
              title,
              description,
              category,
              country,
              city,
              location,
              salaryFrom,
              salaryTo,
            };

      const { data } = await axios.post(`${baseURL}/api/v1/job/post`, jobData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success(data.message);

      // Reset form fields
      setTitle("");
      setDescription("");
      setCategory("");
      setCountry("");
      setCity("");
      setLocation("");
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
      setSalaryType("");
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Redirect unauthorized users or non-employers
  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
    return null;
  }

  return (
    <div className="job_post page">
      <div className="container">
        <h3>Post a New Job</h3>
        <form onSubmit={handleJobPost}>
          <div className="wrapper">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title *"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category *</option>
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
              <option value="Account & Finance">Account & Finance</option>
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
              <option value="Data Entry Operator">Data Entry Operator</option>
            </select>
          </div>
          <div className="wrapper">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country *"
              required
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City *"
              required
            />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location *"
            required
          />
          <div className="salary_wrapper">
            <select
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
              required
            >
              <option value="">Select Salary Type *</option>
              <option value="Fixed Salary">Fixed Salary</option>
              <option value="Ranged Salary">Ranged Salary</option>
            </select>
            <div>
              {salaryType === "Fixed Salary" ? (
                <input
                  type="number"
                  placeholder="Enter Fixed Salary *"
                  value={fixedSalary}
                  onChange={(e) => setFixedSalary(e.target.value)}
                  required
                />
              ) : salaryType === "Ranged Salary" ? (
                <div className="ranged_salary">
                  <input
                    type="number"
                    placeholder="Salary From *"
                    value={salaryFrom}
                    onChange={(e) => setSalaryFrom(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Salary To *"
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <p>Please select a salary type *</p>
              )}
            </div>
          </div>
          <textarea
            rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Job Description *"
            required
          />
          <button type="submit">Post Job</button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
