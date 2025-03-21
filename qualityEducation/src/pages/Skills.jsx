import React, { useState } from 'react';
import './Skills.css';
import SkillChat from './SkillChat'; // Import the new SkillChat component

const SkillTradingPost = ({ offer, request, image, onClick }) => (
  <div className="skills-card" onClick={onClick}>
    {image && <img src={image} alt="Skill Example" className="skills-image" />}
    <h2 className="font-bold text-lg">Offering: {offer}</h2>
    <p className="text-sm">Looking for: {request}</p>
  </div>
);

const SkillTradeModal = ({ isOpen, onClose, onSubmit }) => {
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

const SkillTradeInfoModal = ({ isOpen, onClose, post, onAccept }) => {
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
          <button onClick={onClose} className="skill-trade-modal-cancel-button">
            <span className="button-icon">✕</span>
            <span className="button-text">Close</span>
          </button>
          <button onClick={onAccept} className="skill-trade-modal-submit-button">
            <span className="button-icon">✓</span>
            <span className="button-text">Accept Trade</span>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default function Skills() {

  // TODO: hard coded for now --> change later w backend 
  const [posts, setPosts] = useState([
    { 
      owner: "John Smith", 
      offer: 'Math Tutoring', 
      description: 'I can help with algebra, calculus, and statistics. I have 3 years of tutoring experience.', 
      request: 'Crochet Lessons', 
      image: '' 
    },
    { 
      owner: "Emma Wilson",
      offer: 'Guitar Lessons', 
      description: 'Learn guitar from a 10-year experienced player. I specialize in acoustic and blues.', 
      request: 'French Practice', 
      image: '' 
    },
  ]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = posts.filter(
    (post) =>
      post.offer.toLowerCase().includes(search.toLowerCase()) ||
      post.request.toLowerCase().includes(search.toLowerCase())
  );

  const handleNewPost = (newPost) => {
    // Add owner name to the new post (using a placeholder name)
    const newPostWithOwner = {
      ...newPost,
      owner: "Your Name" // In a real app, this would be the logged-in user's name
    };
    setPosts([...posts, newPostWithOwner]);
  };

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setInfoModalOpen(true);
  };

  const handleAccept = () => {
    // close the info modal
    setInfoModalOpen(false);
    
    // aafter a brief delay, open the chat modal
    setTimeout(() => {
      setIsChatOpen(true);
    }, 300);
  };

  return (
    <div className="skills-container">
      <div className="heading-container">
        <h1 className="skills-heading">Skill Trading Marketplace</h1>
        <div className="skills-search-container">
          <input
            type="text"
            placeholder="Search for a skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="skills-input"
          />
        </div>
      </div>
      
      <button
        onClick={() => setModalOpen(true)}
        className="fab"
      >
        +
      </button>
      <div className="skills-grid">
        {filteredPosts.map((post, index) => (
          <SkillTradingPost key={index} {...post} onClick={() => handleCardClick(post)} />
        ))}
      </div>
      <SkillTradeModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewPost}
      />
      <SkillTradeInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        onAccept={handleAccept}
        post={selectedPost}
      />
      {selectedPost && (
        <SkillChat 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          skillOwner={selectedPost.owner}
          skillOffer={selectedPost.offer}
        />
      )}
    </div>
  );
}