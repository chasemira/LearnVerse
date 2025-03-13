import React from "react";

// Button Component
export function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${className}`}
    >
      {children}
    </button>
  );
}

// Input Component
export function Input({ type = "text", placeholder, value, onChange, className = "" }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    />
  );
}

// Textarea Component
export function Textarea({ placeholder, value, onChange, className = "" }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    ></textarea>
  );
}

// Modal Component
export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
