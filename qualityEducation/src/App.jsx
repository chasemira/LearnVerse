import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Contact from './pages/Contact';
import Community from './pages/Community';
import Multilingual from './pages/Multilingual';
import Skills from './pages/Skills';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';

function App() {

  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/community' element={<Community />} />
        <Route path='/multilingual' element={<Multilingual />} />
        <Route path='/skills' element={<Skills />} />
        {user ?
          (<Route path='logout' element={<Logout />} />)
          :
          (<Route path='/login' element={<Login />} />)
        }
      </Routes>
    </Router>
  );
}
export default App;


