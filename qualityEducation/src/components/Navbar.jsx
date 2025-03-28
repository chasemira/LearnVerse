import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Navbar.css';
import Dropdown from './Dropdown'; 
import logo from './logo.webp'; 

const serviceMenuItems = [
  {
    title: 'Multilingual Resources',
    path: '/multilingual',
    cName: 'dropdown-link'
  },
  {
    title: 'Skills Marketplace',
    path: '/skills',
    cName: 'dropdown-link'
  },
];

const profileMenuItems = [
  {
    title: 'Logout',
    path: '/logout',
    cName: 'dropdown-link'
  }
];

function Navbar() {
  const [click, setClick] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Toggle mobile menu open/close
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  // Show dropdown on desktop hover for Services
  const onMouseEnterServices = () => {
    if (window.innerWidth < 960) {
      setServicesDropdown(false);
    } else {
      setServicesDropdown(true);
    }
  };
  const onMouseLeaveServices = () => {
    setServicesDropdown(false);
  };

  // Show dropdown on desktop hover for Profile
  const onMouseEnterProfile = () => {
    if (window.innerWidth < 960) {
      setProfileDropdown(false);
    } else {
      setProfileDropdown(true);
    }
  };
  const onMouseLeaveProfile = () => {
    setProfileDropdown(false);
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

          {/* Services Dropdown */}
          <li
            className="nav-item"
            onMouseEnter={onMouseEnterServices}
            onMouseLeave={onMouseLeaveServices}
          >
            <Link to="/services" className="nav-links" onClick={closeMobileMenu}>
              Services <i className="fas fa-caret-down" />
            </Link>
            {servicesDropdown && <Dropdown closeMenu={closeMobileMenu} paths={serviceMenuItems} />}
          </li>
          
          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={closeMobileMenu}>
              Contacts
            </Link>
          </li>

          {/* Profile Dropdown */}
          <li
            className="nav-item"
            onMouseEnter={onMouseEnterProfile}
            onMouseLeave={onMouseLeaveProfile}
          >
            {user ? (
              <>
                <Link to="/profile" className="nav-links" onClick={closeMobileMenu}>
                  Profile <i className="fas fa-caret-down" />
                </Link>
                {profileDropdown && <Dropdown closeMenu={closeMobileMenu} paths={profileMenuItems} />}
              </>
            ) : (
              <Link to="/login" className="nav-links" onClick={closeMobileMenu}>
                Login
              </Link>
            )}
          </li>
        </ul>

        {/* SEARCH BAR OR BUTTONS ON THE RIGHT */}
        <div className="nav-right-items">
          <div className="nav-search">
            <input type="text" placeholder="Search in site" />
            <i className="fas fa-search" />
          </div>

          {/* === NEW: A user icon (only if the user is logged in) === */}
          {user && (
            <Link to="/profile" className="nav-links" onClick={closeMobileMenu}>
              <i
                className="fas fa-user-circle"
                style={{ fontSize: '1.8rem', color: '#fff', marginLeft: '16px' }}
              />
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
