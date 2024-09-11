import React, { useState } from 'react';
import './Header.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom';
import Logo from '../assets/food-donation-icon 1.svg'

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <img src={Logo}/>
          <p>SOUL SHARE</p>
        </div>
        <nav className={`header__nav ${isSidebarOpen ? 'open' : ''}`}>
          <ul className="header__nav-list">
            <li className="header__nav-item"> <Link to={'/'}>Home</Link> </li>
            <li className="header__nav-item"><a href="#services">Donate Now</a></li>
            <li className="header__nav-item"> <Link to={"/About"}>About</Link></li>
            <li className="header__nav-item"><a href="#services"></a></li>
            <li className="header__nav-item"><a href="#contact">Contact</a></li>
             <li className="header__nav-item">
              <Link className='Login_button' onClick={toggleSidebar} to={'/Login'}>
                Login
              </Link>
              {/* <button className='Login_button'>
                Login
              </button> */}
            </li>
          </ul>
        </nav>
        <div className="header__hamburger" onClick={toggleSidebar}>
          <span className="header__hamburger-line"></span>
          <span className="header__hamburger-line"></span>
          <span className="header__hamburger-line"></span>
        </div>
      </div>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="sidebar__close" onClick={toggleSidebar}>X</button>
        <ul className="sidebar__list">
          <li className="sidebar__item"><a href="#home" onClick={toggleSidebar}>Home</a></li>
          <li className="sidebar__item"><a href="#about" onClick={toggleSidebar}>About</a></li>
          <li className="sidebar__item"><a href="#services" onClick={toggleSidebar}>Services</a></li>
          <li className="sidebar__item"><a href="#contact" onClick={toggleSidebar}>Contact</a></li>
          <li className="header__nav-item">
            <Link className='Login_button' onClick={toggleSidebar} to={'/Login'}>
              Login
            </Link>
            {/* <button className='Login_button' onClick={toggleSidebar}>
              Login
            </button> */}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
