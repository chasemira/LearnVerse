import React from 'react'
import { Navigate } from 'react-router-dom'
import { auth } from '../firebase/firebase'
import { useAuth } from '../hooks/useAuth'

export default function Logout() {

    const user = useAuth();

    if (user) {
        auth.signOut();
        return (
            <Navigate to='/' />
        )
    }

    return (
        <div>Logging out...</div>
    )
}
