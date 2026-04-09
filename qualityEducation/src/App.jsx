// src/App.jsx
import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import Contact from './pages/Contact';
import Chat from './components/Chat';
import Multilingual from './pages/Multilingual';
import Skills from './pages/Skills';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/Profile';

/** Match Vite `base` (e.g. /LearnVerse/) so client routes work when not hosted at domain root */
const routerBasename =
  import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/'
    ? import.meta.env.BASE_URL.replace(/\/$/, '')
    : undefined;

function App() {
  return (
    <ThemeProvider> {/* Wrap with ThemeProvider */}
      <TranslationProvider>
        <Router basename={routerBasename}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contacts" element={<Contact />} />
            <Route path="/contacts/:chatId" element={<Contact />} />
            <Route path="/multilingual" element={<Multilingual />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile/:uid" element={<Profile />} />
          </Routes>
        </Router>
      </TranslationProvider>
    </ThemeProvider>
  );
}

export default App;