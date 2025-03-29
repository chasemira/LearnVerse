import React, { useState, useRef, useEffect } from 'react';
import { collection, doc, addDoc, getDocs, onSnapshot, query, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import './SkillChat.css';

const SkillChat = ({ isOpen, onClose, skillOwner, offer, user, chatId }) => {

  const [messages , setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const fetchMessages = async (query) => {
    
    const querySnapshot = await getDocs(query);
    const messagesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMessages(messagesData);
  };

  useEffect(() => {
    if (isOpen && chatId) {
      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(chatRef, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      fetchMessages(q);
    }
  }, [isOpen, chatId]);


  useEffect(() => {

    if (isOpen && chatId) {
      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(chatRef, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      // snaopshot listener for real-time updates order by timestamp
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          // firebase has this weird thing where serverTimestamps only
          // has a real value at the moment a request hits the server
          // so we need to check if the timestamp will be updated later (hasPendingWrites)
          // and if so, we set it to serverTimestamp() to avoid showing "undefined"
          console.log(data);
          if (!data.timestamp && snapshot.metadata.hasPendingWrites) {
            data.timestamp = Timestamp.now();
          }
          return { id: doc.id, ...data };
        });
        console.log(messagesData);
        setMessages(messagesData);
      });
      return () => unsubscribe(); // Clean up the listener on unmount
    }
  }, [isOpen, chatId]);

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

    const chatRef = doc(db, 'chats', chatId);
    const messagesRef = collection(chatRef, 'messages');

    addDoc(messagesRef, {
      text: newMessage,
      sender: user.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');

    // // TODO: hard coded for now, change later w backend 
    // setTimeout(() => {
    //   const responseMessages = [
    //     "That sounds great! When would you like to start?",
    //     "I'm available most evenings. Does that work for you?",
    //     "Perfect! Would you prefer to meet in person or online?",
    //     "I've been teaching this skill for about 2 years now.",
    //     "Let me know if you have any questions about what we'll cover."
    //   ];
      
    //   const responseMessage = {
    //     id: messages.length + 2,
    //     sender: skillOwner,
    //     text: responseMessages[Math.floor(Math.random() * responseMessages.length)],
    //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    //   };
      
    //   setMessages(prevMessages => [...prevMessages, responseMessage]);
    // }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="chat-overlay">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-user-info">
            {
              skillOwner.photoURL ? (
                <img src={skillOwner.photoURL} alt="User Avatar" className="chat-avatar" />
              ) : (
                <div className="chat-avatar">
                  {skillOwner.displayName ? skillOwner.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )
            }
            <div className="chat-user-details">
              <h3>{skillOwner.displayName}</h3>
              <p className="chat-skill">Offering: {offer}</p>
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
              className={`chat-message ${message.sender === user.uid ? 'user-message' : 'other-message'}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
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