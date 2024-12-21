import { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const baseURL = import.meta.env.VITE_BASE_URL;

      const response = await axios.get(`${baseURL}/api/v1/user/logout`, {
        withCredentials: true,
      });

      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
      <div className="container">
        <div className="logo">
          <img src="/JobZee-logos__white.png" alt="JobZee Logo" />
        </div>
        <ul className={`menu ${show ? "show-menu" : ""}`}>
          <li>
            <Link to="/" onClick={() => setShow(false)}>
              HOME
            </Link>
          </li>
          <li>
            <Link to="/job/getall" onClick={() => setShow(false)}>
              ALL JOBS
            </Link>
          </li>
          <li>
            <Link to="/applications/me" onClick={() => setShow(false)}>
              {user && user.role === "Employer"
                ? "APPLICANT'S APPLICATIONS"
                : "MY APPLICATIONS"}
            </Link>
          </li>
          {user && user.role === "Employer" && (
            <>
              <li>
                <Link to="/job/post" onClick={() => setShow(false)}>
                  POST NEW JOB
                </Link>
              </li>
              <li>
                <Link to="/job/me" onClick={() => setShow(false)}>
                  VIEW YOUR JOBS
                </Link>
              </li>
            </>
          )}
          <li>
            <button onClick={handleLogout} className="logout-btn">
              LOGOUT
            </button>
          </li>
        </ul>
        <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow((prev) => !prev)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
