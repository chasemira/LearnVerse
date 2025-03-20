import React, { useState } from 'react';
import './Skills.css';

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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    setOffer('');
    setRequest('');
    setDescription('');
    setImage(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      onSubmit({ offer, request, description, image: reader.result });
      onClose();
    };
    if (image) {
      reader.readAsDataURL(image);
    } else {
      onSubmit({ offer, request, description, image: '' });
      onClose();
    }
  };

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-heading">Create a Skill Trade Post</h2>
        <input
          type="text"
          placeholder="What can you teach?"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
          className="modal-input"
        />
        <input
          type="text"
          placeholder="What do you want to learn?"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          className="modal-input"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="modal-textarea"
        />
        
        <label htmlFor="image" className="modal-label">Upload an image (optional)</label>
        <br />
        <small className="modal-small">Accepted file types: .jpg, .jpeg, .png</small>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="image-file-input"
        />
        <div className="modal-button-container">
          <button onClick={onClose} className="modal-cancel-button">Cancel</button>
          <button onClick={handleSubmit} className="modal-submit-button">Post</button>
        </div>
      </div>
    </div>
  ) : null;
};

const SkillTradeInfoModal = ({ isOpen, onClose, post }) => {
  return isOpen ? (
    <div className="skill-trade-modal-overlay">
      <div className="skill-trade-modal-content">
        <h2 className="skill-trade-modal-heading">Skill Trade Details</h2>
        <h3 className="font-bold text-lg">Offering: {post.offer}</h3>
        <p className="text-sm">Looking for: {post.request}</p>
        {post.description && <p className="skill-trade-modal-description">Description: {post.description}</p>}
        {post.image && <img src={post.image} alt="Skill Example" className="skills-image" />}
        <div className="skill-trade-modal-button-container">
          <button onClick={onClose} className="skill-trade-modal-cancel-button">Close</button>
          <button onClick={onClose} className="skill-trade-modal-submit-button">Accept</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default function Skills() {
  const [posts, setPosts] = useState([
    { offer: 'Math Tutoring', description: 'Lorem ipsum', request: 'Crochet Lessons', image: '' },
    { offer: 'Guitar Lessons', description: 'Lorem ipsum', request: 'French Practice', image: '' },
  ]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = posts.filter(
    (post) =>
      post.offer.toLowerCase().includes(search.toLowerCase()) ||
      post.request.toLowerCase().includes(search.toLowerCase())
  );

  const handleNewPost = (newPost) => setPosts([...posts, newPost]);

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setInfoModalOpen(true);
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
        post={selectedPost}
      />
    </div>
  );
}
