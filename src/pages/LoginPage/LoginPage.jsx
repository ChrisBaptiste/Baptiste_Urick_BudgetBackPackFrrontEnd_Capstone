// src/pages/LoginPage/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // I'll use this for redirecting after login.
import axios from 'axios'; // For making API calls to my backend.
import { useAuth } from '../../context/AuthContext'; // I need to import my useAuth hook to access context.
import './LoginPage.css'; // My specific styles for this login page.

const LoginPage = () => {
  // I need state to hold the email and password from the form.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State for loading indication and any error messages from the API.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate(); // Hook for navigation.
  const { loginAction } = useAuth(); // Getting the loginAction function from my AuthContext.

  // This function will update my state when the user types in the form fields.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    // If there was an error, I'll clear it when the user starts typing again.
    if (error) setError('');
    if (fieldErrors[name]) {
        setFieldErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  // This function handles the form submission when the user tries to log in.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Preventing the default form submission (page reload).
    setError('');
    setFieldErrors({});
    setLoading(true);

    try {
      // My backend login endpoint is '/api/auth/login'.
      const response = await axios.post('/api/auth/login', formData);

      // If login is successful, the backend sends back a token.
      console.log('Login successful:', response.data); // For my debugging.
      
      // Instead of directly setting localStorage here, I'll use the loginAction from my context.
      // The loginAction will handle setting the token in localStorage, updating the context's state,
      // and setting the axios default header.
      loginAction(response.data.token); 

      setLoading(false);
      // After successful login, I want to redirect the user.
      navigate('/'); 

    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        const responseData = err.response.data;
        if (responseData.errors && Array.isArray(responseData.errors)) {
          setError(responseData.errors[0]?.msg || 'Login failed. Please try again.');
        } else if (responseData.msg) {
          setError(responseData.msg);
        } else {
          setError('Login failed. An unknown error occurred.');
        }
      } else {
        setError('Login failed. Could not connect to the server.');
      }
      console.error('Login error:', err); // For my debugging.
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <h2>Welcome Back!</h2>
        <p>Log in to continue planning your adventures with BudgetBackpack.</p>
        
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {error && <p className="form-error-message general-error">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-invalid={!!fieldErrors.email || !!error}
            />
            {fieldErrors.email && <p className="form-error-message">{fieldErrors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              aria-invalid={!!fieldErrors.password || !!error}
            />
            {fieldErrors.password && <p className="form-error-message">{fieldErrors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <p className="register-prompt">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;