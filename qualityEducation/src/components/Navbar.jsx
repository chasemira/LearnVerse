import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './Navbar.css';
import Dropdown from './Dropdown'; 
import logo from './logo.webp'; 
import { ThemeContext } from '../context/ThemeContext';

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
  
  // Try-catch to prevent errors if context isn't available yet
  let themeContextValue = { theme: 'dark', toggleTheme: () => {} };
  try {
    themeContextValue = useContext(ThemeContext);
  } catch (error) {
    console.error("Error with ThemeContext:", error);
  }
  
  const { theme, toggleTheme } = themeContextValue;

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
            <Link to="/contacts" className="nav-links" onClick={closeMobileMenu}>
              Contacts
            </Link>
          </li>

          {
            !user && (
              <li className="nav-item">
                <Link to="/login" className="nav-links" onClick={closeMobileMenu}>
                  Login
                </Link>
              </li>
            )
          }
          
          {/* Theme toggle in mobile menu */}
          <li className="nav-item">
            <button 
              className="nav-links" 
              onClick={() => {
                toggleTheme();
                closeMobileMenu();
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {theme === 'dark' ? (
                <><i className="fas fa-sun" /></>
              ) : (
                <><i className="fas fa-moon" /></>
              )}
            </button>
          </li>
        </ul>

        {/* SEARCH BAR OR BUTTONS ON THE RIGHT */}
        <div className="nav-right-items">
          <div className="nav-search">
            <input type="text" placeholder="Search in site" />
            <i className="fas fa-search" />
          </div>

          {/* User icon (only if the user is logged in) */}
          {user && (
            <Link to={`/profile/${user.uid}`} className="nav-profile" onClick={closeMobileMenu}>
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