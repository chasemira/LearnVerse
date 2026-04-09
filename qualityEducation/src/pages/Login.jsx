import React from 'react'
import './Login.css'
import LoginRegister from '../components/LoginRegister'

export default function Login() {

  return (
    <div className="login-page">
      <div className="login-space-bg" aria-hidden="true">
        <span className="login-space-glow" />
        <span className="login-stars login-stars-slow" />
        <span className="login-stars login-stars-fast" />
      </div>
      <div className="login-container">
        <LoginRegister />
      </div>
    </div>
  )
}
