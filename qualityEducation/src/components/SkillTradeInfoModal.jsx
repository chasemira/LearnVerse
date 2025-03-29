import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import './SkillTradeInfoModal.css';

const SkillTradeInfoModal = ({ isOpen, onClose, onAccept, post, user }) => {

    const [isUsersOwnPost, setIsUsersOwnPost] = useState(false);

    // Check if the post belongs to the logged-in user
    const checkIfUsersPost = async () => {
        const userPostRef = doc(db, 'users', user.uid, 'posts', post.id);
        const postSnapshot = await getDoc(userPostRef);
        setIsUsersOwnPost(postSnapshot.exists());
    };

    useEffect(() => {
        if (user && post) {
            checkIfUsersPost();
        }
    }, [user, post]);

    const redirectToLogin = () => {
        window.location.href = '/login';
    };

    const redirectToUserProfile = () => {
        window.location.href = `/profile/${post.authorID}`;
    };

    const deletePost = async () => {
        const postRef = doc(db, 'posts', post.id);
        await deleteDoc(postRef);

        const userPostRef = doc(db, 'users', user.uid, 'posts', post.id);
        await deleteDoc(userPostRef);
        onClose(); // Close the modal after deletion
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
                    {
                        isUsersOwnPost ? (
                            <button onClick={deletePost} className="skill-trade-modal-submit-button">
                                Delete
                            </button>
                        ) : (
                            <button 
                                onClick={user ? onAccept : redirectToLogin} 
                                className="skill-trade-modal-submit-button"
                            >
                                {user ? 'Accept' : 'Login to Accept'}
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    ) : null;
};

export default SkillTradeInfoModal;