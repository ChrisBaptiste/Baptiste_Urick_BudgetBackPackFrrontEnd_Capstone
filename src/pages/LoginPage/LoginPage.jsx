// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // I'll use this for redirecting after login.
import axios from 'axios'; // For making API calls to my backend.
import './LoginPage.css'; // My specific styles for this login page. // My specific styles for this login page.

const LoginPage = () => {
  // I need state to hold the email and password from the form.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // State for loading indication and any error messages from the API.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // For general login errors.
  // I might not need field-specific errors for login as much as for registration,
  // often it's just "Invalid credentials". But let's keep it flexible.
  const [fieldErrors, setFieldErrors] = useState({});


  const navigate = useNavigate(); // Hook for navigation.

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
    setError(''); // Clearing any previous errors.
    setFieldErrors({}); // Clearing previous field errors.
    setLoading(true); // Setting loading state to true.

    try {
      // My backend login endpoint is '/api/auth/login'.
      // Vite's proxy will route this to http://localhost:5001/api/auth/login.
      const response = await axios.post('/api/auth/login', formData);

      // If login is successful, the backend sends back a token.
      console.log('Login successful:', response.data); // For my debugging.
      localStorage.setItem('token', response.data.token); // Storing the token in localStorage.

      // TODO: I'll need to update a global auth state here (e.g., Context or Zustand).
      // This is important for the rest of the app to know the user is logged in.

      setLoading(false);
      // After successful login, I want to redirect the user.
      // For now, let's redirect to the home page ('/').
      // Later, this might be a dashboard page.
      navigate('/'); 

    } catch (err) {
      setLoading(false); // Resetting loading state.
      // Handling errors from the API.
      if (err.response && err.response.data) {
        const responseData = err.response.data;
        if (responseData.errors && Array.isArray(responseData.errors)) {
          // My backend sends login errors as an array: [{ msg: "Invalid credentials" }]
          // I'll take the first message as the general error.
          setError(responseData.errors[0]?.msg || 'Login failed. Please try again.');
        } else if (responseData.msg) {
          // If it's a single 'msg' property.
          setError(responseData.msg);
        } else {
          setError('Login failed. An unknown error occurred.');
        }
      } else {
        // For network errors or if the server is down.
        setError('Login failed. Could not connect to the server.');
      }
      console.error('Login error:', err); // For my debugging.
    }
  };

  return (
    <div className="login-page-container"> {/* Main container for centering the form. */}
      <div className="login-form-wrapper"> {/* Wrapper for styling the form box. */}
        <h2>Welcome Back!</h2>
        <p>Log in to continue planning your adventures with BudgetBackpack.</p>
        
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Displaying the general error message if one exists. */}
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
              aria-invalid={!!fieldErrors.email || !!error} // Mark as invalid if general error or specific field error
            />
            {/* Typically, login errors are general ("Invalid credentials") rather than field-specific */}
            {/* but I'm leaving this structure in case I want to refine it later. */}
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

          <button type="submit" className="btn-login primary" disabled={loading}>
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