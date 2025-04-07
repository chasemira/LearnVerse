import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import './Profile.css';

/** Creates an empty schedule object with days as keys, each an empty array. */
function createEmptySchedule() {
  return {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  };
}

/**
 * Default user data structure
 */
const defaultProfileData = {
  displayName: '',
  email: '',
  description: '',
  photoURL: null,
  schedule: createEmptySchedule()
};

export default function Profile() {
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [editable, setEditable] = useState(false);
  const [userExists, setUserExists] = useState(true);

  // For uploading a new image
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');

  // For notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();
  const { uid } = useParams();

  // For the days/times schedule grid
  const daysOfWeek = Object.keys(createEmptySchedule());
  const timeSlots = [
    '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
    '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM'
  ];

  // We'll keep a ref to a "debounce" timer for schedule saves
  const scheduleSaveTimer = useRef(null);

  /**
   * 1) Check if it's our own profile => set `editable`
   */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setEditable(currentUser.uid === uid);
      }
    });
    return () => unsub();
  }, [uid]);

  /**
   * 2) On mount, do a single getDoc for the user,
   *    store it in local state. No real-time snapshot
   *    => avoids flicker on partial updates.
   */
  useEffect(() => {
    if (!uid) return;
    async function fetchUser() {
      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        // no doc => keep default
        setUserExists(false);
        return;
      }
      const data = snap.data();
      if (!data.schedule) {
        data.schedule = createEmptySchedule();
      }
      setProfileData(data);
    }
    fetchUser();
  }, [uid]);

  /**
   * 3) If it's your profile => fetch notifications once
   *    (If you want them real-time, you can do onSnapshot for notifications only)
   */
  useEffect(() => {
    if (!uid) return;
    async function fetchNotifications() {
      const notifsRef = collection(db, 'users', uid, 'notifications');
      const notifSnap = await getDocs(notifsRef);
      const items = notifSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort by time descending
      items.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setNotifications(items);
    }
    fetchNotifications();
  }, [uid]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // If you want real-time notifications, you could do a small onSnapshot() for notifications only,
  // but that's unlikely to cause flicker with the schedule.

  /** Toggle the notifications dropdown */
  function handleBellClick() {
    setShowNotifications(!showNotifications);
  }

  /** Mark a notification read and go to chat */
  async function handleNotificationClick(notif) {
    if (!uid) return;
    try {
      const notifRef = doc(db, 'users', uid, 'notifications', notif.id);
      await updateDoc(notifRef, { read: true });
      navigate(`/contacts/${notif.chatId}`);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }

  /** Input changes for name, email, description */
  function handleChange(e) {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  }

  /**
   * 4) Pressing "Edit Profile" => toggles isEditing,
   *    or if isEditing => we do a full doc write to Firestore (merge).
   *    This is for the text fields + photo. (We do schedule separately.)
   */
  async function handleSaveClick() {
    if (!uid) return;
    if (!isEditing) {
      // Start editing
      setIsEditing(true);
      return;
    }
    // If already in edit mode => "Save"
    const docRef = doc(db, 'users', uid);
    const updated = { ...profileData };

    // If a new image is chosen
    if (image) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        updated.photoURL = reader.result;
        await setDoc(docRef, updated, { merge: true });
        console.log('Saved entire profile (with new photo).');
      };
      reader.readAsDataURL(image);
    } else {
      await setDoc(docRef, updated, { merge: true });
      console.log('Saved entire profile (no new photo).');
    }
    setIsEditing(false);
  }

  /** Handling the image input */
  function handleImageChange(e) {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  }

  /**
   * 5) Toggling a timeslot:
   *    - Immediately update local state => user sees check/uncheck instantly
   *    - Debounce a partial update to Firestore => avoid flicker
   */
  function toggleTimeSlot(day, slotIndex) {
    if (!editable) return;
    setProfileData((prev) => {
      const clone = structuredClone(prev);
      const arr = clone.schedule[day] || [];
      const i = arr.indexOf(slotIndex);
      if (i >= 0) {
        arr.splice(i, 1);
      } else {
        arr.push(slotIndex);
      }
      clone.schedule[day] = arr;
      return clone;
    });

    // Debounce the write
    if (scheduleSaveTimer.current) {
      clearTimeout(scheduleSaveTimer.current);
    }
    scheduleSaveTimer.current = setTimeout(updateScheduleInFirestore, 300);
  }

  /**
   * 6) Actually writes the updated schedule to Firestore
   */
  async function updateScheduleInFirestore() {
    if (!uid) return;
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        schedule: profileData.schedule
      });
      console.log('Schedule updated (debounced).');
    } catch (err) {
      console.error('Error updating schedule:', err);
    }
  }

  /** Summarize the schedule for display */
  function getScheduleSummary() {
    const lines = [];
    for (const day of daysOfWeek) {
      const arr = profileData.schedule[day] || [];
      if (arr.length > 0) {
        const sorted = [...arr].sort((a, b) => a - b);
        const timeStr = sorted.map((i) => timeSlots[i]).join(', ');
        lines.push(`${day}: ${timeStr}`);
      }
    }
    return lines.length > 0 ? lines.join('\n') : 'No hours selected.';
  }

  if (!userExists) {
    return (
      <>
      <div className="error-container">
        <p className="error-text">404: User does not exist.</p>
        <Link to="/" className="back-link">Back to Home</Link>
      </div>
      </>
    )
  }

  return (
    <div className="profile-container">
      {/* NOTIFICATIONS BELL (only if it's my profile) */}
      {editable && (
        <div className="notification-bell-container">
          <button className="bell-button" onClick={handleBellClick}>
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
          </button>
          {showNotifications && (
            <div className="notifications-panel">
              {notifications.length === 0 ? (
                <p className="no-notifications-text">No notifications yet</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <p>{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

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
              <input
                type="text"
                name="displayName"
                value={profileData.displayName}
                onChange={handleChange}
                className="profile-input"
                placeholder="Name"
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
                placeholder="Write a short bio..."
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
              <h2 className="profile-name">{profileData.displayName}</h2>
              <p className="profile-email">{profileData.email}</p>
              <p className="profile-description">{profileData.description}</p>
            </>
          )}

          {editable && (
            <div className="profile-buttons">
              <button className="edit-button" onClick={handleSaveClick}>
                {isEditing ? 'Save' : 'Edit Profile'}
              </button>
              <button
                className="edit-button"
                onClick={() => navigate('/logout')}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SCHEDULE */}
      <div className="schedule-container">
        <h3 className="schedule-heading">Select Your Availability</h3>
        <div className="schedule-grid">
          {/* Header row */}
          <div className="schedule-grid-header">
            <div className="schedule-grid-cell time-label" />
            {daysOfWeek.map((day) => (
              <div key={day} className="schedule-grid-cell day-label">
                {day}
              </div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots.map((timeLabel, rowIndex) => (
            <div key={timeLabel} className="schedule-grid-row">
              <div className="schedule-grid-cell time-label">{timeLabel}</div>
              {daysOfWeek.map((day) => {
                const arr = profileData.schedule[day] || [];
                const isSelected = arr.includes(rowIndex);
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

      {/* SCHEDULE SUMMARY */}
      <div className="schedule-summary">
        <h4>Availability Summary</h4>
        <pre>{getScheduleSummary()}</pre>
      </div>
    </div>
  );
}
