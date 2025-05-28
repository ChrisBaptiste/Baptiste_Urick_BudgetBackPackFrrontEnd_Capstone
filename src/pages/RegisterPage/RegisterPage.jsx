// src/pages/RegisterPage/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // I need to import my useAuth hook.
import './RegisterPage.css'; 

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
  const { loginAction } = useAuth(); // Getting the loginAction from my AuthContext.

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    let currentClientSideFieldErrors = {}; 

    if (formData.password !== formData.confirmPassword) {
      currentClientSideFieldErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(currentClientSideFieldErrors).length > 0) {
      setFieldErrors(currentClientSideFieldErrors);
      return; 
    }

    setFieldErrors({}); 
    setLoading(true);

    try {
      const { username, email, password } = formData;
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password,
      });

      console.log('Registration successful:', response.data);
      
      // After successful registration, the backend also returns a token.
      // I'll use my loginAction from context to set this token,
      // effectively logging the user in immediately after they register.
      loginAction(response.data.token);

      setLoading(false);
      // After registration and automatic login, I'll redirect to the home page.
      navigate('/'); 

    } catch (err) {
      setLoading(false);
      let backendFieldErrors = {};
      let generalApiError = '';

      if (err.response && err.response.data) {
        const responseData = err.response.data;
        if (responseData.errors && Array.isArray(responseData.errors)) {
          responseData.errors.forEach(er => {
            const msgContent = er.msg;
            const lowerMsg = msgContent.toLowerCase();
            if (lowerMsg.includes('email')) {
              backendFieldErrors.email = msgContent;
            } else if (lowerMsg.includes('username')) {
              backendFieldErrors.username = msgContent;
            } else if (lowerMsg.includes('password')) {
              backendFieldErrors.password = msgContent;
            } else {
              generalApiError += (generalApiError ? '; ' : '') + msgContent;
            }
          });
        } else if (responseData.msg) {
          generalApiError = responseData.msg;
        } else {
          generalApiError = 'Registration failed. An unexpected error occurred with the server response.';
        }
      } else {
        generalApiError = 'Registration failed. Please check your internet connection and try again.';
      }
      
      setFieldErrors(prevErrors => ({...prevErrors, ...backendFieldErrors}));
      if (generalApiError) {
          setError(generalApiError);
      }
      console.error('Registration error object:', err);
    }
  };

  return (
    <div className="register-page-container"> 
      <div className="register-form-wrapper"> 
        <h2>Create Your Account</h2>
        <p>Join BudgetBackpack and start planning your dream trips!</p>
        
        <form onSubmit={handleSubmit} className="register-form" noValidate> 
          {error && <p className="form-error-message general-error">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required 
              aria-describedby={fieldErrors.username ? "username-error" : undefined}
              aria-invalid={!!fieldErrors.username}
            />
            {fieldErrors.username && <p id="username-error" className="form-error-message">{fieldErrors.username}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && <p id="email-error" className="form-error-message">{fieldErrors.email}</p>}
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
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              aria-invalid={!!fieldErrors.password}
            />
            {fieldErrors.password && <p id="password-error" className="form-error-message">{fieldErrors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
              aria-invalid={!!fieldErrors.confirmPassword}
            />
            {fieldErrors.confirmPassword && <p id="confirmPassword-error" className="form-error-message">{fieldErrors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="login-prompt">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;