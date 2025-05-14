
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // I need to import my AuthProvider.
import './index.css'; // Global base styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* I'm wrapping my entire App component with the AuthProvider. */}
    {/* This makes the authentication context available to all components within App. */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);