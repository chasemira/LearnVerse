import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { collection, doc, addDoc, getDocs, getDoc, orderBy, onSnapshot, serverTimestamp, query, where, setDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const { chatId } = useParams(); // Get chatId from URL params
  const navigate = useNavigate();

  const fetchUserContacts = async (uid, chatId) => {
    const userDocRef = doc(db, 'users', uid); // Assuming 'users' is your collection name
    const userChatsCollectionRef = collection(userDocRef, 'chats');
    const querySnapshot = await getDocs(userChatsCollectionRef);

    const chatIds = querySnapshot.docs.map(doc => doc.id); // Extract chat IDs
    const chatsCollectionRef = collection(db, 'chats');
    const chatsQuery = query(chatsCollectionRef, where('__name__', 'in', chatIds)); // Query chats by IDs
    const chatsSnapshot = await getDocs(chatsQuery);

    const userContacts = await Promise.all(
      chatsSnapshot.docs.map(async (chatDoc) => {
        const chatData = chatDoc.data();

        let userId;
        if (chatData.accepteeID === uid) {
          userId = chatData.posterID;
        } else {
          userId = chatData.accepteeID;
        }

        const userDoc = await getDoc(doc(db, 'users', userId)); // Fetch user data
        console.log(userDoc.data());
        return {
          id: chatDoc.id,
          ...chatData,
          user: userDoc.exists() ? { id: userDoc.id, ...userDoc.data()} : null // Add user data
        };
      })
    );

    console.log(userContacts);
    setContacts(userContacts); // Update state with fetched contacts
    if (chatId) {
      setSelectedChat(userContacts.find(contact => contact.id === chatId));
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserContacts(currentUser.uid, chatId);
      }
    });

    return () => unsubscribe();
  }, [chatId]);


  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async (query) => {

      const querySnapshot = await getDocs(query);
      const messagesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
  };

  useEffect(() => {
      if (chatId) {
        const chatRef = doc(db, 'chats', chatId);
        const messagesRef = collection(chatRef, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        fetchMessages(q);
      }
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
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
  }, [chatId]);


  const handleSendMessage = () => {
      if (newMessage.trim() === '') return;

      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(chatRef, 'messages');

      const msgData = {
          text: newMessage,
          sender: user.uid,
          timestamp: serverTimestamp(),
      }

      addDoc(messagesRef, msgData);
      setDoc(chatRef, { 
        latestMessageText: msgData.text, 
        latestMessageSender: msgData.sender,
        latestMessageTimestamp: msgData.timestamp
      }, { merge: true });

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
                navigate(`/contacts/${contact.id}`)
              }}
            >
              <img 
                src={contact.user.photoURL} 
                alt={contact.user.displayName} 
                className="contact-avatar" 
              />
              <div className="contact-info">
                <h3>{contact.user.displayName}</h3>
                <p>{contact.skill} Exchange</p>
                <p className="last-message">{contact.latestMessageText}</p>
              </div>
            </div>
          ))}
        </div>
        
        {(chatId) ? (
          <div className="chat-panel">
            <div className="chat-header">
              <img 
                src={selectedChat?.user.photoURL} 
                alt={selectedChat?.user.displayName} 
                className="chat-avatar" 
                onClick={() => window.location.href = `/profile/${selectedChat?.user.id}`}
              />
              <div className="chat-header-info">
                <h2>{selectedChat?.user.displayName}</h2>
                <p>{selectedChat?.skill} Exchange</p>
              </div>
            </div>
            <div className="chat-messages">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`chat-message ${message.sender === (user?.uid || 'currentUser') ? 'sent' : 'received'}`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="message-input"
              />
              <button onClick={handleSendMessage} className="send-button">
                Send
              </button>
            </div>
          </div>
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