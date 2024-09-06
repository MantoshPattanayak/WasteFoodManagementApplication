import React, { useState } from 'react';
import './Header.css'; // Import the CSS file for styling

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">Logo</div>
        <nav className={`header__nav ${isSidebarOpen ? 'open' : ''}`}>
          <ul className="header__nav-list">
            <li className="header__nav-item"><a href="#home">Home</a></li>
            <li className="header__nav-item"><a href="#about">About</a></li>
            <li className="header__nav-item"><a href="#services">Services</a></li>
            <li className="header__nav-item"><a href="#contact">Contact</a></li>
             <li className="header__nav-item"><button className='Login_button'>Login</button></li>
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
          <li className="header__nav-item"><button className='Login_button' onClick={toggleSidebar}>Login</button></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
