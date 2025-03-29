import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase'; // Import your Firebase auth instance
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebase'; // Import your Firebase Firestore instance
import { doc, setDoc, getDoc,  onSnapshot } from 'firebase/firestore';

import './Profile.css';

// Simple placeholders for the initial user data
const initialProfileData = {
  name: 'Your Name',
  email: 'youremail@example.com',
  description: 'Write a short bio or description here...',
  image: null, // We'll store a preview URL or File here
};

const Profile = () => {
  // Profile data state
  const [profileData, setProfileData] = useState(initialProfileData);
  // Controls whether we are editing or just viewing
  const [isEditing, setIsEditing] = useState(false);

  const [editable, setEditable] = useState(false);

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');

  const navigate = useNavigate(); 

  const { uid } = useParams();
  
  const fetchUserData = async () => {
    console.log('Fetching user data for UID:', uid);
    const userDocRef = doc(db, 'users', uid); // Assuming 'users' is your collection name
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        console.log('User data:', userDoc.data());
        const userData = userDoc.data();
        setProfileData({... userData }); // Set the image URL if it exists
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEditable(user.uid === uid); // Check if the logged-in user is the same as the profile being viewed
        fetchUserData();
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'users', uid), (doc) => {
      setProfileData(doc.data());
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Days of the week and time slots
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
    '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM'
  ];
  // We'll store the schedule in an object like:
  //   { Monday: Set([0,1,2,...]) , Tuesday: Set([...]) ... }
  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = new Set();
      return acc;
    }, {})
  );

  // Handle text changes (name, email, description)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile image upload
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const saveProfileData = async () => {

    if (!isEditing) {
      setIsEditing(true); // Enter edit mode
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const userDocRef = doc(db, 'users', uid); // Assuming 'users' is your collection name
      try {
        await setDoc(userDocRef, { ...profileData, photoURL: reader.result }, { merge: true });
        console.log('Profile data saved successfully!');  
      } catch (error) {
        console.error('Error saving profile data:', error);
      }
    };

    if (image) {
      reader.readAsDataURL(image); // Read the image file as a data URL
    }
    else { 
      const userDocRef = doc(db, 'users', uid); // Assuming 'users' is your collection name
      try {
        await setDoc(userDocRef, { ...profileData }, { merge: true });
        console.log('Profile data saved successfully!');  
      } catch (error) {
        console.error('Error saving profile data:', error);
      }
    }
    
      

    setIsEditing(false); // Exit edit mode after saving
  };


  const convertScheduleToJson = (s) => {
    const scheduleJson = Object.fromEntries(
      Object.entries(s).map(([day, slots]) => [day, Array.from(slots)])
    );
    return JSON.stringify(scheduleJson, null, 2);
  }

  const jsonToSchedule = (json) => {
    const parsed = JSON.parse(json);
    const schedule = Object.fromEntries(
      Object.entries(parsed).map(([day, slots]) => [day, new Set(slots)])
    );
    return schedule;
  }

  useEffect(() => {
    console.log(convertScheduleToJson(schedule));
  }, [schedule])

  // Toggle a timeslot in the schedule
  const toggleTimeSlot = (day, slotIndex) => {
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const updatedSlots = new Set(newSchedule[day]);
      if (updatedSlots.has(slotIndex)) {
        updatedSlots.delete(slotIndex);
      } else {
        updatedSlots.add(slotIndex);
      }
      newSchedule[day] = updatedSlots;
      return newSchedule;
    });
    
  };

  // Display a textual summary of availability
  const getScheduleSummary = () => {
    const lines = [];
    daysOfWeek.forEach((day) => {
      if (schedule[day].size > 0) {
        const sortedIndices = [...schedule[day]].sort((a, b) => a - b);
        const times = sortedIndices.map((idx) => timeSlots[idx]).join(', ');
        lines.push(`${day}: ${times}`);
      }
    });
    return lines.length > 0 ? lines.join('\n') : 'No hours selected.';
  };

  return (
    <div className="profile-container">
      {/* PROFILE CARD */}
      <div className="profile-card">
        <div className="profile-image-section">
          {profileData.photoURL ? (
            <img
              src={profileData.photoURL}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <div className="profile-image-placeholder">
              No Image
            </div>
          )}
        </div>

        <div className="profile-info-section">
          {isEditing ? (
            <>
              {/* Editable fields */}
              <input
                type="text"
                name="name"
                value={profileData.displayName}
                onChange={handleChange}
                className="profile-input"
              />
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="profile-input"
              />
              <textarea
                name="description"
                value={profileData.description}
                onChange={handleChange}
                className="profile-textarea"
                placeholder='Write a short bio or description here...'
              />
              <div className="profile-image-upload">
                <label htmlFor="profileImage" className="upload-label">
                  {fileName ? fileName : 'Upload Profile Image'} 
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="profile-file-input"
                />
              </div>
            </>
          ) : (
            <>
              {/* Display-mode fields */}
              <h2 className="profile-name">{profileData.displayName}</h2>
              <p className="profile-email">{profileData.email}</p>
              <p className="profile-description">{profileData.description}</p>
            </>
          )}

          {
            editable && (
              <div className="profile-buttons">
                <button
                  className="edit-button"
                  onClick={() => saveProfileData()}
                >
                  {isEditing ? 'Save' : 'Edit Profile'}
                </button>
                <button
                  className="edit-button"
                  onClick={() => navigate('/logout')}
                >
                  Logout
                </button>
              </div>
            )
          }
        </div>
      </div>

      {/* WEEKLY SCHEDULE */}
      <div className="schedule-container">
        <h3 className="schedule-heading">Select Your Availability</h3>
        <div className="schedule-grid">
          {/* Header row with day names */}
          <div className="schedule-grid-header">
            <div className="schedule-grid-cell time-label" />
            {daysOfWeek.map((day) => (
              <div key={day} className="schedule-grid-cell day-label">
                {day}
              </div>
            ))}
          </div>

          {/* Rows for each timeslot */}
          {timeSlots.map((timeLabel, rowIndex) => (
            <div key={timeLabel} className="schedule-grid-row">
              <div className="schedule-grid-cell time-label">
                {timeLabel}
              </div>
              {daysOfWeek.map((day) => {
                const isSelected = schedule[day].has(rowIndex);
                return (
                  <div
                    key={day}
                    className={`schedule-grid-cell slot-cell ${
                      isSelected ? 'selected-slot' : ''
                    }`}
                    onClick={() => toggleTimeSlot(day, rowIndex)}
                  >
                    {isSelected ? '✓' : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* SCHEDULE SUMMARY (text-based) */}
      <div className="schedule-summary">
        <h4>Availability Summary</h4>
        <pre>{getScheduleSummary()}</pre>
      </div>
    </div>
  );
};

export default Profile;
