import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Profile() {
    
    const [userData, setUserData] = useState(null);
    let { uid } = useParams();

    useEffect(() => {
        console.log(uid);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            
            if (!uid) {
                uid = user.uid;
            }

            const getUserData = async () => {
                const data = await getDoc(doc(db, 'users', uid));
                if (data.exists()) {
                    setUserData(data.data());
                    console.log(data.data().photoURL);
                }
            }
            getUserData();
        });
        
        return unsubscribe;
    },[]);

    return (
        <div>
            <h1>Profile</h1>
            {userData && (
                <div>
                    <img src={userData.photoURL}></img>
                    <p>Name: {userData.displayName}</p>
                    <p>Email: {userData.email}</p>
                    <p>Date Joined: {userData.createdAt.toDate().toDateString()}</p>
                </div>
            )}
            <Link to='/'>Home</Link>
        </div>
    )
}