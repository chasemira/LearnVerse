import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import './SkillTradeInfoModal.css';
import { TranslationContext } from '../context/TranslationContext';
import { useTranslatedLabels } from '../hooks/useTranslatedLabels';

const SkillTradeInfoModal = ({ isOpen, onClose, onAccept, post, user }) => {
    const navigate = useNavigate();
    const { language, translateText } = useContext(TranslationContext);
    const labels = useTranslatedLabels(
      useMemo(
        () => ({
          skillTradeDetails: 'Skill Trade Details',
          postedBy: 'Posted By:',
          offering: 'Offering:',
          lookingFor: 'Looking for:',
          description: 'Description:',
          close: 'Close',
          deletePost: 'Delete',
          accept: 'Accept',
          loginToAccept: 'Login to Accept',
          skillExampleAlt: 'Skill Example',
        }),
        []
      )
    );

    const [isUsersOwnPost, setIsUsersOwnPost] = useState(false);
    const [displayOffer, setDisplayOffer] = useState('');
    const [displayRequest, setDisplayRequest] = useState('');
    const [displayDescription, setDisplayDescription] = useState('');

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

    useEffect(() => {
        if (!isOpen || !post) return;
        let cancelled = false;

        setDisplayOffer(post.offer);
        setDisplayRequest(post.request);
        setDisplayDescription(post.description || '');

        if (language === 'en') {
            return () => {
                cancelled = true;
            };
        }

        const cached = post.translations?.[language];
        if (cached?.offer && cached?.request) {
            setDisplayOffer(cached.offer);
            setDisplayRequest(cached.request);
            if (post.description) {
                if (cached.description) {
                    setDisplayDescription(cached.description);
                } else {
                    (async () => {
                        try {
                            const d = await translateText(post.description);
                            if (cancelled) return;
                            setDisplayDescription(d);
                            await updateDoc(doc(db, 'posts', post.id), {
                                [`translations.${language}.description`]: d,
                            });
                        } catch (e) {
                            console.error('Description translation error:', e);
                        }
                    })();
                }
            }
            return () => {
                cancelled = true;
            };
        }

        (async () => {
            try {
                const [o, r] = await Promise.all([
                    translateText(post.offer),
                    translateText(post.request),
                ]);
                const d = post.description ? await translateText(post.description) : '';
                if (cancelled) return;
                setDisplayOffer(o);
                setDisplayRequest(r);
                if (post.description) setDisplayDescription(d);
                await updateDoc(doc(db, 'posts', post.id), {
                    [`translations.${language}`]: {
                        offer: o,
                        request: r,
                        ...(post.description ? { description: d } : {}),
                    },
                });
            } catch (e) {
                console.error('Modal translation error:', e);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [
        isOpen,
        post?.id,
        post?.offer,
        post?.request,
        post?.description,
        post?.translations,
        language,
        translateText,
    ]);

    const redirectToLogin = () => {
        navigate('/login');
    };

    const redirectToUserProfile = () => {
        if (post?.authorID) navigate(`/profile/${post.authorID}`);
    };

    const deletePost = async () => {
        const postRef = doc(db, 'posts', post.id);
        await deleteDoc(postRef);

        const userPostRef = doc(db, 'users', user.uid, 'posts', post.id);
        await deleteDoc(userPostRef);
        onClose(); // Close the modal after deletion
    };

    return isOpen && post ? (
        <div className="skill-trade-modal-overlay">
            <div className="skill-trade-modal-content">
                <h2 className="skill-trade-modal-heading">{labels.skillTradeDetails}</h2>

                {/* Image positioned right after the heading */}
                {post.image && (
                    <div className="modal-image-container">
                        <img src={post.image} alt={labels.skillExampleAlt} className="skills-image-large" />
                    </div>
                )}

                <div className="modal-details-container">
                    <div className="modal-detail-item">
                        <span className="modal-detail-label">{labels.postedBy}</span>
                        <span 
                            onClick={redirectToUserProfile} 
                            className="modal-detail-value modal-author-name"
                        >
                            {post.authorName}
                        </span>
                    </div>

                    <div className="modal-detail-item">
                        <span className="modal-detail-label">{labels.offering}</span>
                        <span className="modal-detail-value">{displayOffer}</span>
                    </div>

                    <div className="modal-detail-item">
                        <span className="modal-detail-label">{labels.lookingFor}</span>
                        <span className="modal-detail-value">{displayRequest}</span>
                    </div>

                    {post.description && (
                        <div className="modal-description">
                            <span className="modal-detail-label">{labels.description}</span>
                            <p className="modal-detail-value description-text">{displayDescription}</p>
                        </div>
                    )}
                </div>

                <div className="skill-trade-modal-button-container">
                    <button onClick={onClose} className="skill-trade-modal-cancel-button">{labels.close}</button>
                    {
                        isUsersOwnPost ? (
                            <button onClick={deletePost} className="skill-trade-modal-submit-button">
                                {labels.deletePost}
                            </button>
                        ) : (
                            <button 
                                onClick={user ? onAccept : redirectToLogin} 
                                className="skill-trade-modal-submit-button"
                            >
                                {user ? labels.accept : labels.loginToAccept}
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    ) : null;
};

export default SkillTradeInfoModal;