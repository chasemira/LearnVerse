import React from 'react';
import {Link} from 'react-router-dom';
import './SkillTradeInfoModal.css';

const SkillTradeInfoModal = ({ isOpen, onClose, onAccept, post, user }) => {

    const redirectToLogin = () => {
        window.location.href = '/login';
    };

    const redirectToUserProfile = () => {
        window.location.href = `/profile/${post.authorID}`;
    };

    return isOpen ? (
        <div className="skill-trade-modal-overlay">
            <div className="skill-trade-modal-content">
                <h2 className="skill-trade-modal-heading">Skill Trade Details</h2>

                {/* Image positioned right after the heading */}
                {post.image && (
                    <div className="modal-image-container">
                        <img src={post.image} alt="Skill Example" className="skills-image-large" />
                    </div>
                )}

                <div className="modal-details-container">
                    <div className="modal-detail-item">
                        <span className="modal-detail-label">Posted By:</span>
                        <span 
                            onClick={redirectToUserProfile} 
                            className="modal-detail-value modal-author-name"
                        >
                            {post.authorName}
                        </span>
                    </div>

                    <div className="modal-detail-item">
                        <span className="modal-detail-label">Offering:</span>
                        <span className="modal-detail-value">{post.offer}</span>
                    </div>

                    <div className="modal-detail-item">
                        <span className="modal-detail-label">Looking for:</span>
                        <span className="modal-detail-value">{post.request}</span>
                    </div>

                    {post.description && (
                        <div className="modal-description">
                            <span className="modal-detail-label">Description:</span>
                            <p className="modal-detail-value description-text">{post.description}</p>
                        </div>
                    )}
                </div>

                <div className="skill-trade-modal-button-container">
                    <button onClick={onClose} className="skill-trade-modal-cancel-button">Close</button>
                    <button
                        onClick={user ? onAccept : redirectToLogin}
                        className="skill-trade-modal-submit-button"
                    >
                        {user ? "Accept" : "Login to Accept"}
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default SkillTradeInfoModal;