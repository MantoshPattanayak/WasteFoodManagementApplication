import React, { useEffect, useState } from "react";
import "./Header.css"; // Import the CSS file for styling
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/soul_share.svg";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faRightFromBracket, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../store/reducers/authReducer";
import axiosInstance from "../services/axios";
import api from "../utils/apiList";
import { toast } from "react-toastify";
import profile_image from "../assets/profile.png";
import axios from "axios";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [givenReq, setGivenReq] = useState('');
  const [itemCategory, setItemCategory] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  async function logoutUser(e) {
    e.preventDefault();
    try {
      let res = await axiosInstance.post(api.LOGOUT.url);
      console.log("response of log out API", res);
      dispatch(logout());
      toast.success("Logged out successfully!", {
        autoClose: 1500,
        onClose: () => {
          setTimeout(() => {
            navigate("/");
            sessionStorage.clear();
            localStorage.clear();
          }, 500);
        }
      });
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

  function handleSearch(e) {
    let searchLink = '/AvailableFood';
    if ((givenReq && itemCategory) || givenReq) {
      givenReq ? searchLink += `?s=${givenReq}` : '';
      itemCategory ? searchLink += `?category=${itemCategory}` : '';
      givenReq && itemCategory ? searchLink += `?s=${givenReq}&category=${itemCategory}` : '';
      navigate(searchLink);
    }
    else {
      return;
    }
  }

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && navigator.serviceWorker) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    }

    // Fetch notifications on mount and set interval for updates
    fetchNotifications();
    const intervalId = setInterval(() => {
      console.log("Fetching notifications again...");
      fetchNotifications();
    }, 10000);  // Fetch every 10 seconds

    // Cleanup interval on unmount
    return () => {
      console.log("Clearing notification interval...");
      clearInterval(intervalId);
    };
  }, []);

  const fetchNotifications = async () => {
    console.log('Fetching notifications...');
    try {
      const response = await axios.post(`http://localhost:8000/sshare/food/viewFoodDonationList?t=${Date.now()}`, {
          randomKey: Math.random()
      });
      const data = response.data;
      console.log('Fetched Notifications:', data);

      // Ensure data.message exists before sending it
      if (data.message && navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'NOTIFICATIONS',
          data: data.message, // Assuming data.message is a string or similar
        });
      } else {
        console.error('Service worker controller is not available or data.message is undefined.');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <img className="app_logo" src={Logo} onClick={(e) => { user ? navigate('/') : navigate('/') }} />
        </div>
        {
          !user &&
          <div className="header_search_bar">
            <div className="search_categories">
              <select value={itemCategory} onChange={(e) => setItemCategory(e.target.value)}>
                <option value={""}>Select categories</option>
                <option value={"Food"}>Food</option>
                <option value={"Clothes"}>Clothes</option>
              </select>
            </div>
            <div className="search_field">
              <input type="text" value={givenReq} onChange={(e) => setGivenReq(e.target.value)} />
              <button onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></button>
            </div>
          </div>
        }
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
                user && <li className="header__nav-item header-profile-container">
                  <FontAwesomeIcon icon={faUser} className="icon_profile" />
                  <ul className="profile-submenu">
                    <li>
                      <Link to="/profile">View Profile</Link>
                    </li>
                    {/* <li>
                      <Link to="/settings">Settings</Link>
                    </li> */}
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
        {
          !user &&
          <div className="header_search_bar_mobile">
            <div className="search_categories">
              <select>
                <option value={""}>Select categories</option>
                <option value={"Food"}>Food</option>
                <option value={"Clothes"}>Clothes</option>
              </select>
            </div>
            <div className="search_field">
              <input type="text" value={givenReq} onChange={(e) => setGivenReq(e.target.value)} />
              <button onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></button>
            </div>
          </div>
        }
      </div>
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="sidebar__close" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faClose} size="sm" />
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
