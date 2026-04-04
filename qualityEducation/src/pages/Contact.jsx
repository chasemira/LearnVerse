import React, { useState, useEffect, useLayoutEffect, useRef, useContext, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { collection, doc, addDoc, getDocs, getDoc, orderBy, onSnapshot, serverTimestamp, Timestamp, query, where, setDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import './Contact.css';
import { TranslationContext } from '../context/TranslationContext';
import { useTranslatedLabels } from '../hooks/useTranslatedLabels';

function ChatMessageBubble({ message, chatId, userUid, language, translateText }) {
  const [display, setDisplay] = useState(message.text);

  useEffect(() => {
    setDisplay(message.text);
    if (language === 'en') return;

    if (message.translations?.[language]) {
      setDisplay(message.translations[language]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const t = await translateText(message.text);
        if (cancelled) return;
        setDisplay(t);
        if (chatId && message.id) {
          await updateDoc(doc(db, 'chats', chatId, 'messages', message.id), {
            [`translations.${language}`]: t,
          });
        }
      } catch (e) {
        console.error('Message translation error:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [message.id, message.text, language, message.translations, chatId, translateText]);

  return (
    <div
      className={`chat-message ${message.sender === (userUid || 'currentUser') ? 'sent' : 'received'}`}
    >
      {display}
    </div>
  );
}

const Contact = () => {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const messagesAreaRef = useRef(null);

  const [chatId, setChatId] = useState(useParams().chatId || null);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const labels = useTranslatedLabels(
    useMemo(
      () => ({
        loginRequired: 'Login Required',
        loginPrompt: 'Please log in to access your contacts and messages.',
        goToLogin: 'Go to Login',
        contactsHeading: 'Skill Trade Contacts',
        exchange: 'Exchange',
        typeMessage: 'Type a message...',
        send: 'Send',
        selectContact: 'Select a contact to start chatting',
      }),
      []
    )
  );

  const { language, translateText } = useContext(TranslationContext);

  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages, messages]);


  const getChatQuery = async (uid) => {
    const userDocRef = doc(db, 'users', uid); 
    const userChatsCollectionRef = collection(userDocRef, 'chats');
    const querySnapshot = await getDocs(userChatsCollectionRef);

    const chatIds = querySnapshot.docs.map(doc => doc.id).filter(id => id !== 'placeholder'); // Extract chat IDs
    
    // If no chats exist, return a query that will return no results
    if (chatIds.length === 0) {
      const chatsCollectionRef = collection(db, 'chats');
      return query(chatsCollectionRef, where('__name__', '==', 'nonexistent'));
    }
    
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
          setContacts(userContacts); // Update state with fetched contacts
        });

        return () => unsubscribe(); // Clean up the listener on unmount
      }
      updateContacts();
    }, [user]);

  useEffect(() => {
      async function fetchMessages() {
          if (!chatId || !user) return;
          const chatRef = doc(db, 'chats', chatId);
          const userChatRef = doc(db, 'users', user.uid, 'chats', chatId);

          const chat = await getDoc(chatRef);
          if (!chat.exists()) {
            setSelectedChat(null);
            setMessages([]);
            navigate('/contacts'); // Redirect to contacts page if chat doesn't exist
            return;
          }
          const messagesRef = collection(chatRef, 'messages');
          const q = query(messagesRef, orderBy('timestamp', 'asc'));
          const querySnapshot = await getDocs(q);
          const messagesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setMessages(messagesData);
          setDoc(userChatRef, { 
            latestMessageId: messagesData[messagesData.length - 1]?.id 
          }, { merge: true });
      }
      fetchMessages();
  }, [chatId, user]);

  useEffect(() => {
    async function updateMessages() {
      if (!chatId || !user) return;

      const chatRef = doc(db, 'chats', chatId);
      const userChatRef = doc(db, 'users', user.uid, 'chats', chatId);
      const chat = await getDoc(chatRef);
      if (!chat.exists()) {
        setSelectedChat(null);
        setMessages([]);
        navigate('/contacts'); // Redirect to contacts page if chat doesn't exist
        return;
      }
      const messagesRef = collection(chatRef, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // WHY
        const currentChatId = window.location.pathname.split('/').pop()
        if (messagesData.some(msg => msg.id && msg.chatId === currentChatId)) {
          setMessages(messagesData); 
          setDoc(userChatRef, { 
            latestMessageId: messagesData[messagesData.length - 1]?.id 
          }, { merge: true });
        } 
        
      });

      return () => unsubscribe(); // Clean up the listener on unmount
    }
    updateMessages();
  }, [chatId, user, selectedChat]);

  const handleSendMessage = async () => {
      if (newMessage.trim() === '') return;

      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(chatRef, 'messages');

      const msgData = {
          text: newMessage,
          sender: user.uid,
          timestamp: serverTimestamp(),
          chatId: chatId,
      }

      const msgDoc = await addDoc(messagesRef, msgData);
      setDoc(chatRef, { 
        latestMessageText: msgData.text, 
        latestMessageId: msgDoc.id,
        latestMessageTimestamp: serverTimestamp(),
      }, { merge: true });


      setNewMessage('');
  };

  const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
          handleSendMessage();
      }
  };

  const checkMessagesSynced = async (contact) => {
    if (!chatId || !user) return;
    const userChatRef = doc(db, 'users', user.uid, 'chats', chatId);

    const chatDoc = await getDoc(userChatRef);



    
    return chatDoc.exists() && chatDoc.data().latestMessageId === contact.latestMessageId;
  }

  const renderContent = () => {
    if (!user) {
      return (
        <div className="contact-login-required">
          <div className="contact-login-modal">
            <h2>{labels.loginRequired}</h2>
            <p>{labels.loginPrompt}</p>
            <button onClick={() => window.location.href = '/login'}>
              {labels.goToLogin}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="contact-container">
        <div className="contacts-list">
          <div className="contacts-header">
            <h2>{labels.contactsHeading}</h2>
          </div>
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className={`contact-item ${selectedChat && selectedChat.id === contact.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedChat(contact);
                setChatId(contact.id);
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
                <p>{contact.skill} {labels.exchange}</p>
                <p 
                  className={`last-messsage${checkMessagesSynced(contact) ? '' : '-unread'}`}>
                    {contact.latestMessageText}
                </p>
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
                <p>{selectedChat?.skill} {labels.exchange}</p>
              </div>
            </div>
            <div className="chat-messages" ref={messagesAreaRef}>
              {messages.map((message) => (
                <ChatMessageBubble
                  key={message.id}
                  message={message}
                  chatId={chatId}
                  userUid={user?.uid}
                  language={language}
                  translateText={translateText}
                />
              ))}
            </div>
            <div className="chat-input">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={labels.typeMessage}
                className="message-input"
              />
              <button onClick={handleSendMessage} className="send-button">
                {labels.send}
              </button>
            </div>
          </div>
        ) : (
          <div className="no-chat-selected">
            <p>{labels.selectContact}</p>
          </div>
        )}
      </div>
    );
  };

  return renderContent();
};

export default Contact;