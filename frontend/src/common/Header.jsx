import React, { useEffect, useState } from "react";
import "./Header.css"; // Import the CSS file for styling
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/soul_share.svg";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../store/reducers/authReducer";
import axiosInstance from "../services/axios";
import api from "../utils/apiList";
import { toast } from "react-toastify";
import profile_image from "../assets/profile.png";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("user", user);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  async function logoutUser(e) {
    e.preventDefault();
    try {
      let res = await axiosInstance.post(api.LOGOUT.url);
      console.log("response of log out API", res);
      dispatch(logout());
      sessionStorage.clear();
      localStorage.clear();
      navigate("/");
      toast.dismiss();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("error in log out api", error);
    }
  }

  function handleNavigation(e) {
    // console.log("handle navigation");
    if (user) {
      navigate("/DonorDetails");
    } else {
      toast.error("Kindly log in or register first!");
    }
  }

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">

          <img src={Logo} />
        </div>
        <nav className={`header__nav ${isSidebarOpen ? "open" : ""}`}>
          <ul className="header__nav-list">
            <li className="header__nav-item">
              {!user && <Link to={user ? "/DonorLandingPage" : "/"}>Home</Link>}
            </li>
            <li className="header__nav-item">
              {/* {!user && ( */}
                <Link
                  to={user ? "/DonorDetails" : ""}
                  onClick={handleNavigation}
                >
                  Donate Now
                </Link>
              {/* )} */}
            </li>

            {user && (
              <li className="header__nav-item">
                <Link to={"/DonateHistory"}>Donation History</Link>
              </li>
            )}
            <li className="header__nav-item">
              <Link to={"/About"}>About</Link>
            </li>
            <li className="header__nav-item">
              {!user && (
                <Link className="Login_button" to={"/Login"}>
                  Login
                </Link>
              )}
              {
                user && <li className="header__nav-item profile-container">
                  <FontAwesomeIcon icon={faUser} className="icon_profile" />
                  <ul className="profile-submenu">
                    <li>
                      <Link to="/profile">View Profile</Link>
                    </li>
                    <li>
                      <Link to="/settings">Settings</Link>
                    </li>
                    <li className="logout" onClick={logoutUser}>
                      <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                    </li>
                  </ul>
                </li>
              }
            </li>
            
          </ul>
        </nav>
        <div className="header__hamburger" onClick={toggleSidebar}>
          <span
            className="header__hamburger-line"
            onClick={toggleSidebar}
          ></span>
          <span
            className="header__hamburger-line"
            onClick={toggleSidebar}
          ></span>
          <span
            className="header__hamburger-line"
            onClick={toggleSidebar}
          ></span>
        </div>
      </div>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="sidebar__close" onClick={toggleSidebar}>
          X
        </button>
        <ul className="sidebar__list">
          <li className="sidebar__item">
            {!user && <Link to={user ? "/DonorLandingPage" : "/"}>Home</Link>}
          </li>
          <li className="sidebar__item">
            {/* {!user && ( */}
              <Link to={user ? "/DonorDetails" : ""} onClick={handleNavigation}>
                Donate Now
              </Link>
            {/* )} */}
          </li>

          {user && (
            <li className="sidebar__item">
              <Link to={"/DonateHistory"}>Donation History</Link>
            </li>
          )}
          <li className="sidebar__item">
            {" "}
            <Link to={"/About"}>About</Link>
          </li>
          <li className="sidebar__item">
            {!user && (
              <Link className="Login_button" to={"/Login"}>
                Login
              </Link>
            )}
            {user && (
              <Link className="Login_button" onClick={logoutUser} to={"/"}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                &nbsp; Logout
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
