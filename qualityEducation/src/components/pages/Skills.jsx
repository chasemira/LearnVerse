import React, { useState } from 'react';
import { Button, Input, Modal, Textarea } from '../ui';

const SkillTradingPost = ({ offer, request, image }) => (
  <div className="border rounded-2xl shadow-md p-4 flex flex-col items-center gap-2">
    {image && <img src={image} alt="Skill Example" className="w-32 h-32 object-cover rounded-lg" />}
    <h2 className="font-bold text-lg">Offering: {offer}</h2>
    <p className="text-sm">Looking for: {request}</p>
  </div>
);

const SkillTradeModal = ({ isOpen, onClose, onSubmit }) => {
  const [offer, setOffer] = useState('');
  const [request, setRequest] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = () => {
    onSubmit({ offer, request, image });
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-black p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Create a Skill Trade Post</h2>
        <Input
          placeholder="What can you teach?"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
        />
        <Input
          placeholder="What do you want to learn?"
          value={request}
          onChange={(e) => setRequest(e.target.value)}
        />
        <Input
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} className="bg-gray-300">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-500 text-white">Post</Button>
        </div>
      </div>
    </div>
  ) : null;
};

export default function Skills() {
  const [posts, setPosts] = useState([
    { offer: 'Math Tutoring', request: 'Crochet Lessons', image: '' },
    { offer: 'Guitar Lessons', request: 'French Practice', image: '' },
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
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-4">Skill Trading Marketplace</h1>
      <Input
        placeholder="Search for a skill..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-1/2 mx-auto p-2 mb-4 border rounded-xl"
      />
      <Button onClick={() => setModalOpen(true)} className="bg-green-500 text-white w-1/2 p-2 mb-4 rounded-xl">Post a Skill Trade</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
