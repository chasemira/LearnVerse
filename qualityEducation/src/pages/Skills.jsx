import React, { useEffect, useMemo, useState, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  doc,
  query,
  where,
  setDoc,
  getDocsFromCache,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import './Skills.css';
import { TranslationContext } from '../context/TranslationContext';
import SkillTradeModal from '../components/SkillTradeModal';
import SkillTradeInfoModal from '../components/SkillTradeInfoModal';
import SkillChat from './SkillChat';
import { useTranslatedLabels } from '../hooks/useTranslatedLabels';

const SkillTradingPost = ({ post, onClick, labels }) => {
  const { language, translateText } = useContext(TranslationContext);
  const { offer: rawOffer, request: rawRequest, image } = post;
  const [offer, setOffer] = useState(rawOffer);
  const [request, setRequest] = useState(rawRequest);

  useEffect(() => {
    setOffer(rawOffer);
    setRequest(rawRequest);

    if (language === 'en') return;

    const cached = post.translations?.[language];
    if (cached?.offer && cached?.request) {
      setOffer(cached.offer);
      setRequest(cached.request);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [o, r] = await Promise.all([
          translateText(rawOffer),
          translateText(rawRequest),
        ]);
        if (cancelled) return;
        setOffer(o);
        setRequest(r);
        if (post.id) {
          await updateDoc(doc(db, 'posts', post.id), {
            [`translations.${language}`]: { offer: o, request: r },
          });
        }
      } catch (e) {
        console.error('Post translation error:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [post.id, rawOffer, rawRequest, language, post.translations, translateText]);

  return (
    <div className="skills-card" onClick={onClick}>
      {image && <img src={image} alt="Skill Example" className="skills-image" />}
      <h2 className="font-bold text-lg">{labels.offering}: {offer}</h2>
      <p className="text-sm">{labels.lookingFor}: {request}</p>
    </div>
  );
};

export default function Skills() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // For toggling between "My Posts" and "Other Posts"
  const [showMyPosts, setShowMyPosts] = useState(false);

  // For search
  const [search, setSearch] = useState('');

  // For modals and chats
  const [isModalOpen, setModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [chatId, setChatId] = useState(null);
  const labels = useTranslatedLabels(
    useMemo(
      () => ({
        offering: 'Offering',
        lookingFor: 'Looking for',
        heading: 'Skill Trading Marketplace',
        myPosts: 'My Posts',
        otherPosts: 'Other Posts',
        searchPlaceholder: 'Search for a skill...',
        createNewPost: 'Create a new post',
        loginToCreate: 'Login to create a post',
      }),
      []
    )
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      async function fetchUserData() {
        if (loggedUser) {
          const userDocRef = doc(db, 'users', loggedUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ uid: loggedUser.uid, ...userDoc.data() });
          }
        }
      }
      fetchUserData();
    });
    return unsubscribe;
  }, []);

  // Fetch the "posts" collection from Firestore
  const fetchPosts = async (ref) => {
    let querySnapshot;
    try {
      // Attempt to get from cache first
      querySnapshot = await getDocsFromCache(ref);
    } catch (e) {
      // If not available in cache, fallback to server
      querySnapshot = await getDocs(ref);
    }
    const postsData = querySnapshot.docs.map((doc) => doc.data());
    setPosts(postsData);
  };

  // Real-time listener for posts
  useEffect(() => {
    const postsCollectionRef = collection(db, 'posts');
    fetchPosts(postsCollectionRef);

    const postsListener = onSnapshot(postsCollectionRef, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    });

    return () => postsListener();
  }, []);

  // Create new post
  const handleNewPost = async (newPost) => {
    if (!user) return; // Just a safeguard
    const postsCollectionRef = collection(db, 'posts');
    const userPostsCollectionRef = collection(db, 'users', user.uid, 'posts');

    // Add the post to the global "posts" collection
    const postDocRef = await addDoc(postsCollectionRef, {
      ...newPost,
      authorID: user.uid,
      authorName: user.displayName,
    });
    // Mirror the post in the user's "posts" subcollection
    const userPostDocRef = doc(userPostsCollectionRef, postDocRef.id);
    await setDoc(userPostDocRef, {});
  };

  // Filter the posts
  const filteredPosts = posts.filter((post) => {
    // Check for matching search
    const matchesSearch =
      post.offer.toLowerCase().includes(search.toLowerCase()) ||
      post.request.toLowerCase().includes(search.toLowerCase());

    // If user is logged in, show My Posts or Other Posts
    if (user) {
      if (showMyPosts) {
        return matchesSearch && post.authorID === user.uid;
      } else {
        return matchesSearch && post.authorID !== user.uid;
      }
    }
    // If not logged in, just show everything that matches search
    return matchesSearch;
  });

  // Click on a card -> open details modal
  const handleCardClick = (post) => {
    setSelectedPost(post);
    setInfoModalOpen(true);
  };

  // Handle when user "Accepts" a skill trade
  const handleAccept = async (post) => {
    if (!user) return;
    const userChatsCollectionRef = collection(db, 'users', user.uid, 'chats');
    const posterChatsCollectionRef = collection(db, 'users', post.authorID, 'chats');
    const chatsCollectionRef = collection(db, 'chats');

    // Check if a chat already exists for this post (avoid duplicates)
    const existingChats = await getDocs(
      query(userChatsCollectionRef, where('postID', '==', post.id))
    );
    if (existingChats.docs.length > 0) {
      // Chat already exists -> go to that chat
      window.location.href = `/contacts/${existingChats.docs[0].id}`;
      return;
    }

    // Create the initial message
    const msgData = {
      sender: user.uid,
      text: `I accept your offer of ${post.offer} for ${post.request}.`,
      timestamp: serverTimestamp(),
    };

    // Create the chat doc
    const newChatDocRef = await addDoc(chatsCollectionRef, {
      posterID: post.authorID,
      accepteeID: user.uid,
      skill: post.offer,
      postID: post.id,
      latestMessageSender: msgData.sender,
      latestMessageText: msgData.text,
      latestMessageTimestamp: msgData.timestamp,
    });

    // Add first message
    const messagesRef = collection(chatsCollectionRef, newChatDocRef.id, 'messages');
    await addDoc(messagesRef, msgData);

    // Mirror doc references for both participants
    const userChatDocRef = doc(userChatsCollectionRef, newChatDocRef.id);
    await setDoc(userChatDocRef, { postID: post.id, latestClientMessage: {} });

    const posterChatDocRef = doc(posterChatsCollectionRef, newChatDocRef.id);
    await setDoc(posterChatDocRef, { postID: post.id, latestClientMessage: {} });

    // *** Notify the *poster* that someone accepted ***
    try {
      if (post.authorID) {
        const posterNotificationsRef = collection(db, 'users', post.authorID, 'notifications');
        await addDoc(posterNotificationsRef, {
          senderId: user.uid,
          senderName: user.displayName || '(Unknown)',
          chatId: newChatDocRef.id,
          postId: post.id,
          read: false,
          message: `${user.displayName} wants to chat with you!`,
          timestamp: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Error creating notification:', err);
    }

    // Close Info Modal, open chat
    setChatId(newChatDocRef.id);
    setInfoModalOpen(false);
    setTimeout(() => {
      setIsChatOpen(true);
    }, 300);
  };

  return (
    <div className="skills-container">
      <div className="heading-container">
        <h1 className="skills-heading">{labels.heading}</h1>
        <div className="skills-search-container">
          {/* Toggle to filter "My Posts" vs "Other Posts" */}
          {user && (
            <div className="filter-toggle-container">
              <label className="filter-toggle-label">
                <input
                  type="checkbox"
                  checked={showMyPosts}
                  onChange={() => setShowMyPosts(!showMyPosts)}
                  className="filter-toggle-input"
                />
                <span className="filter-toggle-text">
                  {showMyPosts ? labels.myPosts : labels.otherPosts}
                </span>
              </label>
            </div>
          )}

          {/* Search box */}
          <input
            type="text"
            placeholder={labels.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="skills-input"
          />
        </div>
      </div>

      {/* Floating action button to create a new post */}
      <div className="fab-container">
        <button
          onClick={user ? () => setModalOpen(true) : () => window.location.href = '/login'}
          className="skills-fab"
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          +
        </button>
        {tooltipVisible && (
          <div className="fab-tooltip">
            {user ? labels.createNewPost : labels.loginToCreate}
          </div>
        )}
      </div>

      {/* Display the filtered posts */}
      <div className="skills-grid">
        {filteredPosts.map((post) => (
          <SkillTradingPost
            key={post.id || post.offer + post.request}
            post={post}
            labels={labels}
            onClick={() => handleCardClick(post)}
          />
        ))}
      </div>

      {/* Create New Skill Post Modal */}
      <SkillTradeModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewPost}
      />

      {/* Skill Details Modal */}
      <SkillTradeInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        onAccept={() => handleAccept(selectedPost)}
        post={selectedPost}
        user={user}
      />

      {/* Skill Chat Overlay */}
      {selectedPost && (
        <SkillChat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          skillOwner={
            // returns a Promise => we pass down or do an effect in SkillChat
            // For simplicity, we leave as is in your code. If you need it to be actual data, you can fetch in SkillChat.
            // Or remove "skillOwner" if you prefer. 
            // We'll keep your original logic.
            Promise.resolve({ 
              displayName: selectedPost.authorName,
              photoURL: '' // or fetch user doc
            })
          }
          offer={selectedPost.offer}
          user={user}
          chatId={chatId}
        />
      )}
    </div>
  );
}
