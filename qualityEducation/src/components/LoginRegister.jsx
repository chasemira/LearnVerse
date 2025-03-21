import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp, collection, getDoc } from 'firebase/firestore';
import './LoginRegister.css';

const LoginRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            password: password,
            createdAt: serverTimestamp(),
          });
  
          const chatsCollectionRef = collection(userDocRef, 'chats');
          const postsCollectionRef = collection(userDocRef, 'posts');
  
          await setDoc(doc(chatsCollectionRef, 'placeholder'), {});
          await setDoc(doc(postsCollectionRef, 'placeholder'), {});

          navigate('/');
        } else {
          setErrorMessage('User with these credentials already exists.');
        }
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
          createdAt: serverTimestamp(),
          provider: 'google',
        });

        const chatsCollectionRef = collection(userDocRef, 'chats');
        const postsCollectionRef = collection(userDocRef, 'posts');

        await setDoc(doc(chatsCollectionRef, 'placeholder'), {});
        await setDoc(doc(postsCollectionRef, 'placeholder'), {});

        
      }
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Google sign-in error:', error.message);
    }
    
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='auth-input'
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='auth-input'
        />
        <button type="submit" className='auth-btn'>{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button className='google-btn' onClick={handleGoogleSignIn}>Sign in with Google</button>
      <button className='' onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
};

export default LoginRegister;
