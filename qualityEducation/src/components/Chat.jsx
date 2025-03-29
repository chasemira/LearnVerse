import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import { collection, doc, addDoc, getDocs, onSnapshot, query, serverTimestamp, orderBy, Timestamp, setDoc } from 'firebase/firestore';
import { useParams, useOutletContext } from 'react-router-dom';

import './Chat.css';


export default function Chat() {

    const { chatId } = useParams();
    const { selectedChat, user } = useOutletContext();



    return (
        <div className="chat-panel">
            <div className="chat-header">
                <img
                    src={selectedChat.user.photoURL}
                    alt={selectedChat.user.displayName}
                    className="chat-avatar"
                />
                <div className="chat-header-info">
                    <h2>{selectedChat.user.displayName}</h2>
                    <p>{selectedChat.skill} Exchange</p>
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
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    )
}