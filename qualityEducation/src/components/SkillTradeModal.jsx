import React, { useState } from 'react';
import './SkillTradeModal.css';

const SkillTradeModal = ({ isOpen, onClose, onSubmit, user }) => {
    const [offer, setOffer] = useState('');
    const [request, setRequest] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');
  
    const handleImageChange = (e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
        setFileName(e.target.files[0].name);
      }
    };
  
    const handleSubmit = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSubmit({ offer, request, description, image: reader.result });
        // Reset form
        setOffer('');
        setRequest('');
        setDescription('');
        setImage(null);
        setFileName('No file chosen');
        onClose();
      };
      
      if (image) {
        reader.readAsDataURL(image);
      } else {
        onSubmit({ offer, request, description, image: '' });
        onClose();
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="create-skill-modal-overlay">
        <div className="create-skill-modal-content">
          <h2 className="create-skill-modal-heading">Create a Skill Trade Post</h2>
          
          <div className="create-skill-form-container">
            <div className="create-skill-input-group">
              <label className="create-skill-label">Offering:</label>
              <input
                type="text"
                placeholder="What can you teach?"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="create-skill-input"
              />
            </div>
            
            <div className="create-skill-input-group">
              <label className="create-skill-label">Looking for:</label>
              <input
                type="text"
                placeholder="What do you want to learn?"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                className="create-skill-input"
              />
            </div>
            
            <div className="create-skill-input-group">
              <label className="create-skill-label">Description:</label>
              <textarea
                placeholder="Tell us more about what you're offering"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="create-skill-textarea"
              />
            </div>
            
            <div className="create-skill-file-container">
              <label className="create-skill-file-label">Upload an image</label>
              <p className="create-skill-file-info">Accepted file types: .jpg, .jpeg, .png</p>
              
              <div className="create-skill-file-input-wrapper">
                <div className="create-skill-file-button">
                  <span className="create-button-icon">📁</span>
                  <span>Choose File</span>
                  <span className="create-skill-file-text">{fileName}</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="create-skill-file-input"
                />
              </div>
            </div>
          </div>
          
          <div className="create-skill-button-container">
            <button onClick={onClose} className="create-skill-cancel-button">
              <span className="create-button-icon">✕</span>
              <span>Cancel</span>
            </button>
            <button onClick={handleSubmit} className="create-skill-submit-button">
              <span className="create-button-icon">✓</span>
              <span>Post</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

export default SkillTradeModal;