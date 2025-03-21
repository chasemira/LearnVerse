import React, { useState, useRef, useEffect } from 'react';
import './SkillChat.css';

const SkillChat = ({ isOpen, onClose, skillOwner, skillOffer }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: skillOwner,
      text: `Hi there! I see you're interested in my ${skillOffer} skills. How can I help you?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus on input when chat opens
  useEffect(() => {
    if (isOpen) {
      document.getElementById('chat-input').focus();
    }
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'You',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // TODO: hard coded for now, change later w backend 
    setTimeout(() => {
      const responseMessages = [
        "That sounds great! When would you like to start?",
        "I'm available most evenings. Does that work for you?",
        "Perfect! Would you prefer to meet in person or online?",
        "I've been teaching this skill for about 2 years now.",
        "Let me know if you have any questions about what we'll cover."
      ];
      
      const responseMessage = {
        id: messages.length + 2,
        sender: skillOwner,
        text: responseMessages[Math.floor(Math.random() * responseMessages.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, responseMessage]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="chat-overlay">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-user-info">
            <div className="chat-avatar">{skillOwner.charAt(0)}</div>
            <div className="chat-user-details">
              <h3>{skillOwner}</h3>
              <p className="chat-skill">Offering: {skillOffer}</p>
            </div>
          </div>
          <button className="chat-close-button" onClick={onClose}>
            <span>✕</span>
          </button>
        </div>
        
        <div className="chat-messages">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`chat-message ${message.sender === 'You' ? 'user-message' : 'other-message'}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">{message.timestamp}</span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        
        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <input
            id="chat-input"
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="chat-input"
          />
          <button 
            type="submit" 
            className="chat-send-button"
            disabled={newMessage.trim() === ''}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SkillChat;