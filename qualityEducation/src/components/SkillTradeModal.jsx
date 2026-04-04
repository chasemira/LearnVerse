import React, { useState, useMemo } from 'react';
import './SkillTradeModal.css';
import { useTranslatedLabels } from '../hooks/useTranslatedLabels';

const SkillTradeModal = ({ isOpen, onClose, onSubmit, user }) => {
    const labels = useTranslatedLabels(
      useMemo(
        () => ({
          title: 'Create a Skill Trade Post',
          offering: 'Offering:',
          lookingFor: 'Looking for:',
          description: 'Description:',
          phOffer: 'What can you teach?',
          phRequest: 'What do you want to learn?',
          phDescription: "Tell us more about what you're offering",
          uploadImage: 'Upload an image',
          fileTypes: 'Accepted file types: .jpg, .jpeg, .png',
          chooseFile: 'Choose File',
          noFileChosen: 'No file chosen',
          cancel: 'Cancel',
          post: 'Post',
        }),
        []
      )
    );

    const [offer, setOffer] = useState('');
    const [request, setRequest] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    /** null = show translated “no file chosen”; string = actual filename */
    const [selectedFileName, setSelectedFileName] = useState(null);

    const handleImageChange = (e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
        setSelectedFileName(e.target.files[0].name);
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
        setSelectedFileName(null);
        onClose();
      };
      
      if (image) {
        reader.readAsDataURL(image);
      } else {
        onSubmit({ offer, request, description, image: '' });
        setSelectedFileName(null);
        onClose();
      }
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="create-skill-modal-overlay">
        <div className="create-skill-modal-content">
          <h2 className="create-skill-modal-heading">{labels.title}</h2>
          
          <div className="create-skill-form-container">
            <div className="create-skill-input-group">
              <label className="create-skill-label">{labels.offering}</label>
              <input
                type="text"
                placeholder={labels.phOffer}
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="create-skill-input"
              />
            </div>
            
            <div className="create-skill-input-group">
              <label className="create-skill-label">{labels.lookingFor}</label>
              <input
                type="text"
                placeholder={labels.phRequest}
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                className="create-skill-input"
              />
            </div>
            
            <div className="create-skill-input-group">
              <label className="create-skill-label">{labels.description}</label>
              <textarea
                placeholder={labels.phDescription}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="create-skill-textarea"
              />
            </div>
            
            <div className="create-skill-file-container">
              <label className="create-skill-file-label">{labels.uploadImage}</label>
              <p className="create-skill-file-info">{labels.fileTypes}</p>
              
              <div className="create-skill-file-input-wrapper">
                <div className="create-skill-file-button">
                  <span className="create-button-icon">📁</span>
                  <span>{labels.chooseFile}</span>
                  <span className="create-skill-file-text">
                    {selectedFileName ?? labels.noFileChosen}
                  </span>
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
              <span>{labels.cancel}</span>
            </button>
            <button onClick={handleSubmit} className="create-skill-submit-button">
              <span className="create-button-icon">✓</span>
              <span>{labels.post}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

export default SkillTradeModal;