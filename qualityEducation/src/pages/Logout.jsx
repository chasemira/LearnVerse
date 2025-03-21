import React from 'react'
import { Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function Logout() {

    const [user, setUser] = React.useState(null);
    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return unsubscribe;
    }, []);

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
