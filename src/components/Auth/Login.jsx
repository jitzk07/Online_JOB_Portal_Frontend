import { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_BASE_URL;

      const { data } = await axios.post(
        `${baseURL}/api/v1/user/login`,
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      console.error("Error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message || "An error occurred.");
      } else if (error.request) {
        console.error("Network error:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.message || "Something went wrong.");
      }
    }
  };

  if (isAuthorized) {
    return <Navigate to="/" />;
  }

  return (
    <section className="authPage">
      <div className="container">
        <div className="header">
          <img src="/JobZeelogo.png" alt="JobZee Logo" />
          <h3>Login to your account</h3>
        </div>
        <form onSubmit={handleLogin}>
          <div className="inputTag">
            <label htmlFor="role">Login As</label>
            <div>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Employer">Employer</option>
                <option value="Job Seeker">Job Seeker</option>
              </select>
              <FaRegUser />
            </div>
          </div>
          <div className="inputTag">
            <label htmlFor="email">Email Address</label>
            <div>
              <input
                id="email"
                type="email"
                placeholder="xyz@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <MdOutlineMailOutline />
            </div>
          </div>
          <div className="inputTag">
            <label htmlFor="password">Password</label>
            <div>
              <input
                id="password"
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <RiLock2Fill />
            </div>
          </div>
          <button type="submit">Login</button>
          <Link to="/register">Register Now</Link>
        </form>
      </div>
      <div className="banner">
        <img src="/login.png" alt="Login Banner" />
      </div>
    </section>
  );
};

export default Login;
