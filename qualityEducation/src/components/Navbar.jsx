import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Dropdown from './Dropdown'; 
import logo from './logo.webp'; 

function Navbar() {
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  // Toggle mobile menu open/close
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  // Show dropdown on desktop hover
  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };
  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        {/* LOGO / BRAND */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={logo} alt="logo" className="nav-logo-img" />
          LearnVerse
        </Link>

        {/* MOBILE MENU ICON */}
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        {/* NAV ITEMS */}
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>

          {/* EXAMPLE DROPDOWN (Hover on desktop) */}
          <li
            className="nav-item"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Link to="/services" className="nav-links" onClick={closeMobileMenu}>
              Services <i className="fas fa-caret-down" />
            </Link>
            {/* Smooth dropdown component */}
            {dropdown && <Dropdown closeMenu={closeMobileMenu} />}
          </li>

          <li className="nav-item">
            <Link to="/community" className="nav-links" onClick={closeMobileMenu}>
              Community
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={closeMobileMenu}>
              Contacts
            </Link>
          </li>
        </ul>

        {/* SEARCH BAR OR BUTTONS ON THE RIGHT */}
        <div className="nav-right-items">
          <div className="nav-search">
            <input type="text" placeholder="Search in site" />
            <i className="fas fa-search" />
          </div>
          {/* If you want a button, e.g. "Donate" */}
          {/* <button className="nav-btn">Donate</button> */}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
