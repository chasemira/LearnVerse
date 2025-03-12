import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Contact from './components/pages/Contact';
import Community from './components/pages/Community';
import Multilingual from './components/pages/Multilingual';
import Skills from './components/pages/Skills';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/community' element={<Community />} />
        <Route path='/multilingual' element={<Multilingual />} />
        <Route path='/skills' element={<Skills />} />
      </Routes>
    </Router>
  );
}
export default App;


