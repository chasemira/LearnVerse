import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { collection, doc, addDoc, getDocs, getDoc, orderBy, onSnapshot, serverTimestamp, Timestamp, query, where, setDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const { chatId } = useParams(); // Get chatId from URL params
  const navigate = useNavigate();

  const getChatQuery = async (uid) => {
    const userDocRef = doc(db, 'users', uid); 
    const userChatsCollectionRef = collection(userDocRef, 'chats');
    const querySnapshot = await getDocs(userChatsCollectionRef);

    const chatIds = querySnapshot.docs.map(doc => doc.id).filter(id => id !== 'placeholder'); // Extract chat IDs
    const chatsCollectionRef = collection(db, 'chats');
    const chatsQuery = query(
      chatsCollectionRef, where('__name__', 'in', chatIds), orderBy('latestMessageTimestamp', 'desc')
    ); // Query chats by IDs
    

    return chatsQuery; 
  }

  const getContacts = async (uid, snapshot) => {
    return await Promise.all(
      snapshot.docs.map(async (chatDoc) => {
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

  }

  const fetchUserContacts = async (uid, chatId) => {

    const chatsQuery = await getChatQuery(uid); // Get chat query
    const chatsSnapshot = await getDocs(chatsQuery); // Fetch chat documents

    const userContacts = await getContacts(uid, chatsSnapshot); // Get contacts from chat documents
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

    // refresh contact order by latestMessageTimestamp when there is a new message
    useEffect(() => {
      async function updateContacts() {
        if (!user) return;
        const chatsQuery = await getChatQuery(user.uid); // Get chat query
        const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
          const userContacts = await getContacts(user.uid, snapshot); // Get contacts from chat documents
          console.log(userContacts);
          setContacts(userContacts); // Update state with fetched contacts
        });

        return () => unsubscribe(); // Clean up the listener on unmount
      }
      updateContacts();
    }, [user]);


  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async (query) => {

      const querySnapshot = await getDocs(query);
      const messagesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
  };

  useEffect(() => {
      async function initFetchMessages() {
          if (!chatId) return;
          const chatRef = doc(db, 'chats', chatId);
          const chat = await getDoc(chatRef);
          if (!chat.exists()) {
            setSelectedChat(null);
            setMessages([]);
            return;
          }
          const messagesRef = collection(chatRef, 'messages');
          const q = query(messagesRef, orderBy('timestamp', 'asc'));
          fetchMessages(q); // Fetch messages
      }
      initFetchMessages();
  }, [chatId]);

  useEffect(() => {
    async function updateMessages() {
      if (!chatId) return;
      const chatRef = doc(db, 'chats', chatId);
      const chat = await getDoc(chatRef);
      if (!chat.exists()) {
        setSelectedChat(null);
        setMessages([]);
        return;
      }
      const messagesRef = collection(chatRef, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(messagesData);
      });

      return () => unsubscribe(); // Clean up the listener on unmount
    }
    updateMessages();
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