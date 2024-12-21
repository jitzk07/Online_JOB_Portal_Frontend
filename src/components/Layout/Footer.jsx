import  { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";


const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved By Code With JiTZxJoD.</div>
      <div>
        <Link to={"https://github.com/jitzk07"} target="_blank">
          <FaGithub />
        </Link>

        <Link to={"https://www.linkedin.com/in/jitendra-kumar-61987b242/"} target="_blank">
          <FaLinkedin />
        </Link>

      </div>
    </footer>
  );
};

export default Footer;
