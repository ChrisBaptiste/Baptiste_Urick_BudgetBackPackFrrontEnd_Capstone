
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import axios from 'axios'; // Import axios
import './index.css';

// Set base URL for Axios for all requests
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
// The token for authenticated requests will be set by AuthContext

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);