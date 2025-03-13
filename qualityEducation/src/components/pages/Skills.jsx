import React, { useState } from 'react';
import './Skills.css';

const SkillTradingPost = ({ offer, request, image }) => (
  <div className="skills-card">
    {image && <img src={image} alt="Skill Example" className="skills-image" />}
    <h2 className="font-bold text-lg">Offering: {offer}</h2>
    <p className="text-sm">Looking for: {request}</p>
  </div>
);

const SkillTradeModal = ({ isOpen, onClose, onSubmit }) => {
  const [offer, setOffer] = useState('');
  const [request, setRequest] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = () => {
    onSubmit({ offer, request, image });
    onClose();
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
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="modal-input"
        />
        <div className="modal-button-container">
          <button onClick={onClose} className="modal-cancel-button">Cancel</button>
          <button onClick={handleSubmit} className="modal-submit-button">Post</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default function Skills() {
  const [posts, setPosts] = useState([
    { offer: 'Math Tutoring', description: 'Lorem ipsum' , request: 'Crochet Lessons', image: '' },
    { offer: 'Guitar Lessons', description: 'Lorem ipsum' , request: 'French Practice', image: '' },
  ]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  const filteredPosts = posts.filter(
    (post) =>
      post.offer.toLowerCase().includes(search.toLowerCase()) ||
      post.request.toLowerCase().includes(search.toLowerCase())
  );

  const handleNewPost = (newPost) => setPosts([...posts, newPost]);

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
          <SkillTradingPost key={index} {...post} />
        ))}
      </div>
      <SkillTradeModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewPost}
      />
    </div>
  );
}
