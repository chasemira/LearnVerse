// File: src/App.jsx

import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';
import Contact from './pages/Contact';
import Multilingual from './pages/Multilingual';
import Skills from './pages/Skills';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/Profile';

function App() {
  return (
    <TranslationProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/multilingual" element={<Multilingual />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:uid" element={<Profile />} />
        </Routes>
      </Router>
    </TranslationProvider>
  );
}

export default App;
