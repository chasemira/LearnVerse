import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  getDocsFromCache, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  query, 
  where, 
  setDoc
} from 'firebase/firestore';
import './Skills.css';
import SkillTradeModal from '../components/SkillTradeModal';
import SkillTradeInfoModal from '../components/SkillTradeInfoModal';
import SkillChat from './SkillChat'; // Import the new SkillChat component

const SkillTradingPost = ({ offer, request, image, onClick }) => (
  <div className="skills-card" onClick={onClick}>
    {image && <img src={image} alt="Skill Example" className="skills-image" />}
    <h2 className="font-bold text-lg">Offering: {offer}</h2>
    <p className="text-sm">Looking for: {request}</p>
  </div>
);

export default function Skills() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const fetchPosts = async (ref) => {
    let querySnapshot;
    try {
      querySnapshot = await getDocsFromCache(ref);
    } catch (e) {
      querySnapshot = await getDocs(ref);
    }

    const postsData = querySnapshot.docs.map((doc) => doc.data());
    setPosts(postsData);
  };

  useEffect(() => {
    const postsCollectionRef = collection(db, 'posts');
    
    fetchPosts(postsCollectionRef);

    const postsListener = onSnapshot(postsCollectionRef, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    });

    return postsListener;
  }, []);

  const handleNewPost = async (newPost) => {
    const postsCollectionRef = collection(db, 'posts');
    const userPostsCollectionRef = collection(db, 'users', user.uid, 'posts');
    console.log(userPostsCollectionRef);
    console.log(newPost);

    const postDocRef = await addDoc(
      postsCollectionRef, 
      { ...newPost, authorID: user.uid, authorName: user.displayName }
    );
    // add the post to the user's posts collection with custom id being the postID from newPost
    const userPostDocRef = doc(userPostsCollectionRef, postDocRef.id);
    setDoc(userPostDocRef, {});
    
  };

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

  const handleCardClick = (post) => {
    setSelectedPost(post);
    console.log(post);
    setInfoModalOpen(true);
  };

  const handleAccept = async (post) => {

    console.log(post);
    const userChatsCollectionRef = collection(db, 'users', user.uid, 'chats');
    const posterChatsCollectionRef = collection(db, 'users', post.authorID, 'chats');
    const chatsCollectionRef = collection(db, 'chats');
    // find if the chat already exists using firestore query
    const userChat = await getDocs(
      query(
        userChatsCollectionRef, where('postID', '==', post.id)
      )
    );
    // if the chat already exists, redirect to it
    if (userChat.docs.length > 0) {
      window.location.href = `/chat/${userChat.docs[0].id}`;
      return;
    }

    const result = await addDoc(chatsCollectionRef, {
      posterID: post.authorID,
      accepteeID: user.uid,
      skill: post.offer,
      postID: post.id,
    });

    // create message collection for the chat
    const messagesCollectionRef = collection(chatsCollectionRef, result.id, 'messages');
    await addDoc(messagesCollectionRef, {
      sender: user.uid,
      text: `I accept your offer of ${post.offer} for ${post.request}.`,
      timestamp: serverTimestamp(),
    });
    
    const userChatDocRef = doc(userChatsCollectionRef, result.id);
    setDoc(userChatDocRef, { postID: post.id });

    const posterChatDocRef = doc(posterChatsCollectionRef, result.id);
    setDoc(posterChatDocRef, { postID: post.id });

    setChatId(result.id);

    // close the info modal
    setInfoModalOpen(false);
    console.log("balls");
    
    // aafter a brief delay, open the chat modal
    setTimeout(() => {
      console.log("balls");
      setIsChatOpen(true);
    }, 300);
  };

  const getUserProfile = async (userID) => {
    const userDocRef = doc(db, 'users', userID);
    const userDoc = await getDoc(userDocRef);
    return userDoc;
  }

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
      
      <div className="fab-container">
        <button
          onClick={user ? () => setModalOpen(true) : () => window.location.href = '/login'}
          className="fab"
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          +
        </button>
        {tooltipVisible && (
          <div className="fab-tooltip">
            {user ? "Create a new post" : "Login to create a post"}
          </div>
        )}
      </div>
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
        onAccept={() => handleAccept(selectedPost)}
        post={selectedPost}
        user={user}
      />
      {selectedPost && (
        <SkillChat 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          skillOwner={getUserProfile(selectedPost.authorID).then(doc => doc.data())}
          offer={selectedPost.offer}
          user={user}
          chatId={chatId}
        />
      )}
    </div>
  );
}