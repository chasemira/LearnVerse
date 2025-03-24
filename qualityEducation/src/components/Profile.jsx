// File: src/pages/Profile.jsx
import React, { useState } from 'react';
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
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Create a temporary URL for preview
      const previewURL = URL.createObjectURL(file);
      setProfileData((prev) => ({
        ...prev,
        image: previewURL, 
      }));
    }
  };

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
          {profileData.image ? (
            <img
              src={profileData.image}
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
                value={profileData.name}
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
              />
              <div className="profile-image-upload">
                <label htmlFor="profileImage" className="upload-label">
                  Upload New Image
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="profile-file-input"
                />
              </div>
            </>
          ) : (
            <>
              {/* Display-mode fields */}
              <h2 className="profile-name">{profileData.name}</h2>
              <p className="profile-email">{profileData.email}</p>
              <p className="profile-description">{profileData.description}</p>
            </>
          )}

          <button
            className="edit-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Save' : 'Edit Profile'}
          </button>
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
