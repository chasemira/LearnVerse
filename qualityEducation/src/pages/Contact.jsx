import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { collection, doc, addDoc, getDocs, getDoc, getDocsFromCache, onSnapshot, serverTimestamp, query, where, setDoc } from 'firebase/firestore';
import { useParams, Outlet } from 'react-router-dom';
import './Contact.css';

// Hardcoded contacts for testing
const HARDCODED_CONTACTS = [
  {
    id: 'contact1',
    userName: 'Web Dev Mentor',
    userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    lastMessage: 'Looking forward to our next session!',
    skill: 'Web Development'
  },
  {
    id: 'contact2',
    userName: 'Language Exchange Partner',
    userImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    lastMessage: 'Shall we practice Spanish today?',
    skill: 'Language Learning'
  },
  {
    id: 'contact3',
    userName: 'Photography Tutor',
    userImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    lastMessage: 'Check out the new camera techniques I learned',
    skill: 'Photography'
  },
  {
    id: 'contact4',
    userName: 'Cooking Skills Buddy',
    userImage: 'https://randomuser.me/api/portraits/women/4.jpg',
    lastMessage: 'Here\'s that recipe we discussed',
    skill: 'Culinary Arts'
  }
];

const Contact = () => {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState(HARDCODED_CONTACTS);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { chatId } = useParams(); // Get chatId from URL params
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const userRef = 0;
  });

  // Simulate fetching messages for a chat
  const fetchMessages = (contactId) => {
    // Hardcoded messages for testing
    const simulatedMessages = [
      {
        id: 'msg1',
        senderId: 'other',
        text: 'Hi there! Ready to learn some web development?',
        timestamp: new Date(Date.now() - 1000000)
      },
      {
        id: 'msg2',
        senderId: user?.uid || 'currentUser',
        text: 'Absolutely! What topic should we cover today?',
        timestamp: new Date(Date.now() - 500000)
      },
      {
        id: 'msg3',
        senderId: 'other',
        text: 'How about React hooks?',
        timestamp: new Date()
      }
    ];

    setMessages(simulatedMessages);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const newMessageObj = {
      id: `msg_${Date.now()}`,
      senderId: user?.uid || 'currentUser',
      text: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="contact-login-required">
          <div className="contact-login-modal">
            <h2>Login Required</h2>
            <p>Please log in to access your contacts and messages.</p>
            <button onClick={() => window.location.href = '/login'}>
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="contact-container">
        <div className="contacts-list">
          <div className="contacts-header">
            <h2>Skill Trade Contacts</h2>
          </div>
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className={`contact-item ${selectedChat && selectedChat.id === contact.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedChat(contact);
                fetchMessages(contact.id);
              }}
            >
              <img 
                src={contact.userImage} 
                alt={contact.userName} 
                className="contact-avatar" 
              />
              <div className="contact-info">
                <h3>{contact.userName}</h3>
                <p>{contact.skill} Exchange</p>
                <p className="last-message">{contact.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
        
        {(chatId || selectedChat) ? (
          <Outlet /> // Render nested route content when chatId exists
        ) : (
          <div className="no-chat-selected">
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    );
  };

  return renderContent();
};

export default Contact;