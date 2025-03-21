import React, { useState } from 'react';
import './Dropdown.css';
import { Link, useNavigate } from 'react-router-dom';

function Dropdown({ closeMenu, paths }) {
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    // Close dropdown menu
    if (closeMenu) closeMenu();
    
    // Navigate to the selected path
    navigate(path);
  };

  return (
    <ul className="dropdown-menu">
      {paths.map((item, index) => (
        <li key={index}>
          <Link
            className={item.cName}
            to={item.path}
            onClick={() => handleItemClick(item.path)}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Dropdown;