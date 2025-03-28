// File: src/App.jsx

import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Contact from './pages/Contact';
import Multilingual from './pages/Multilingual';
import Skills from './pages/Skills';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './components/Profile';   // or './components/Profile' if you put it there
import AuthState from './components/AuthState'; // if you're still using this anywhere

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/multilingual" element={<Multilingual />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* NEW or RE-ENABLED: The Profile route */}
        <Route path="/profile" element={<Profile />} />

        {/* If you want a dynamic profile route as well: */}
        <Route path="/profile/:uid" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
