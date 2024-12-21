import { useContext, useEffect } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";

// Components
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import MyJobs from "./components/Job/MyJobs";
import NotFound from "./components/NotFound/NotFound";

const App = () => {
  const { setIsAuthorized, setUser } = useContext(Context);

  // Set Axios Base URL
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
  axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/v1/user/getuser`);
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        setIsAuthorized(false);
      }
    };

    fetchUser();
  }, [setIsAuthorized, setUser]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
