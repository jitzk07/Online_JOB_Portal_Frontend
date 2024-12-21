import { useContext, useEffect, useState } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";

const App = () => {
  const { setIsAuthorized, setUser, isAuthorized, user } = useContext(Context);
  const [loading, setLoading] = useState(true); // Manage loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const baseURL = import.meta.env.VITE_BASE_URL;

        // Configure Axios globally for credentials
        axios.defaults.withCredentials = true;

        // Fetch the user data
        const response = await axios.get(`${baseURL}/api/v1/user/getuser`, {
          withCredentials: true,
        });

        // Update context with user data
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error fetching user:", error);

        // Handle unauthorized state
        setIsAuthorized(false);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchUser();
  }, [setIsAuthorized, setUser]);

  // If loading, show a spinner or loading text
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!isAuthorized ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthorized ? <Register /> : <Navigate to="/" />}
        />

        {/* Protected Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/job/getall" element={<Jobs />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route
          path="/application/:id"
          element={user?.role === "Employer" ? <Application /> : <Navigate to="/" />}
        />
        <Route
          path="/applications/me"
          element={user?.role === "Job Seeker" ? <MyApplications /> : <Navigate to="/" />}
        />
        <Route
          path="/job/post"
          element={user?.role === "Employer" ? <PostJob /> : <Navigate to="/" />}
        />
        <Route
          path="/job/me"
          element={user?.role === "Employer" ? <MyJobs /> : <Navigate to="/" />}
        />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
