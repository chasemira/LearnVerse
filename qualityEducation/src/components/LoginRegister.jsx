// File: src/components/LoginRegister.jsx
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDoc
} from 'firebase/firestore';
import './LoginRegister.css';

const LoginRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isLogin) {
      if (!email || !password) {
        setErrorMessage('Email and password are required.');
        return;
      }
    } else {
      if (!email || !password || !firstName) {
        setErrorMessage('All fields are required.');
        return;
      }
      
    }

    try {
      if (isLogin) {
        // === LOGIN ===
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Immediately redirect to that user's profile
        navigate(`/profile/${user.uid}`);
      } else {
        // === REGISTER ===
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            firstName: firstName,
            lastName: lastName || '',
            createdAt: serverTimestamp(),
          });

          const chatsCollectionRef = collection(userDocRef, 'chats');
          const postsCollectionRef = collection(userDocRef, 'posts');

          await setDoc(doc(chatsCollectionRef, 'placeholder'), {});
          await setDoc(doc(postsCollectionRef, 'placeholder'), {});
        }
        // After register, also redirect to profile
        navigate(`/profile/${user.uid}`);
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Authentication error:', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          provider: 'google',
        });

        const chatsCollectionRef = collection(userDocRef, 'chats');
        const postsCollectionRef = collection(userDocRef, 'posts');

        await setDoc(doc(chatsCollectionRef, 'placeholder'), {});
        await setDoc(doc(postsCollectionRef, 'placeholder'), {});
      }
      // Also redirect on Google Sign In
      navigate(`/profile/${user.uid}`);
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Google sign-in error:', error.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${!isLogin ? 'register-mode' : ''}`}>
        {!isLogin && (
          <div className="auth-left-panel">
            <div className="brand-logo">LearnVerse</div>
            <div className="back-link">
              <span onClick={() => navigate('/')}>Back to website</span>
            </div>
            <div className="auth-tagline">
              <h3>Quality Education:<br /> A Universe of Learning Experience</h3>
            </div>
            <div className="auth-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot active"></span>
            </div>
          </div>
        )}
        
        <div className="auth-form-container">
          <h2>{isLogin ? 'Log in to Your Account' : 'Create an account'}</h2>
          {isLogin && <p className="subtitle">Access your personalized learning experience.</p>}
          {!isLogin && (
            <p className="account-toggle">
              Already have an account? <span onClick={() => setIsLogin(true)}>Log in</span>
            </p>
          )}
          
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="name-fields">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="auth-input half-width"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="auth-input half-width"
                />
              </div>
            )}
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
            
            <div className="password-field">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
              {!isLogin && (
                <span className="password-visibility">
                  <svg className="eye-icon" width="16" height="16" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </span>
              )}
            </div>
            
            <button type="submit" className="auth-btn">
              {isLogin ? 'LOGIN' : 'Create account'}
            </button>
          </form>
          
          {!isLogin && <div className="divider">Or register with</div>}
          {isLogin && <div className="auth-separator"></div>}
          
          <div className="social-signin">
            <button className="social-btn google-btn" onClick={handleGoogleSignIn}>
              <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              <span>Google</span>
            </button>
          </div>
          
          {isLogin && (
            <button className="switch-mode-btn" onClick={() => setIsLogin(false)}>
              Need an account? Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;