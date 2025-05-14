// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // I'll use this to redirect the user after successful registration.
import axios from 'axios'; // For making HTTP requests to my backend.
import './RegisterPage.css'; // My specific styles for this page.

const RegisterPage = () => {
  // I need to manage the state for my form inputs.
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', 
  });

  // I'll also need state for loading indicators and error messages.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // For general errors from the API.
  const [fieldErrors, setFieldErrors] = useState({}); // For specific field validation errors.

  const navigate = useNavigate(); // Hook for navigation.

  // This function will handle changes in my form inputs.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field-specific error when user starts typing in that field
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
    setError(''); // Clear general error when user interacts with the form
  };

  // This function will handle the form submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // I need to prevent the default form submission behavior.
    setError(''); // Reset previous general errors.
    setFieldErrors({}); // Reset previous field errors.

    // Basic client-side validation.
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ ...fieldErrors, confirmPassword: "Passwords do not match." });
      return; // Stop submission if passwords don't match.
    }
    // I can add more client-side validation here (e.g., password complexity, email format)
    // but the backend also validates.

    setLoading(true); // Indicate that the request is in progress.

    try {
      // My API endpoint for registration is '/api/auth/register'.
      // The Vite proxy will handle redirecting this to my backend at http://localhost:5001.
      // I'm preparing the data to send, excluding confirmPassword as the backend doesn't need it.
      const { username, email, password } = formData;
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password,
      });

      // If registration is successful, the backend sends back a token.
      // I should store this token (e.g., in localStorage) and then redirect.
      console.log('Registration successful:', response.data);
      localStorage.setItem('token', response.data.token); // Storing the token.

      // TODO: Update auth state (e.g., using Context or Zustand)

      setLoading(false);
      navigate('/login'); // Redirecting to login page after successful registration.
                        // Or maybe to a dashboard page if I log them in directly. For now, login.

    } catch (err) {
      setLoading(false);
      // Now I need to handle errors from the API.
      if (err.response && err.response.data && err.response.data.errors) {
        // If the backend sends specific field errors (like 'User already exists').
        const backendErrors = err.response.data.errors;
        let newFieldErrors = {};
        let generalErrorMessage = '';

        backendErrors.forEach(er => {
            // My backend sends errors as { msg: "..." }
            // I need to map these to fields if possible.
            // This is a simple mapping, might need refinement based on backend error structure.
            if (er.msg.toLowerCase().includes('email')) {
                newFieldErrors.email = er.msg;
            } else if (er.msg.toLowerCase().includes('username')) {
                newFieldErrors.username = er.msg;
            } else if (er.msg.toLowerCase().includes('password')) { // For password validation from backend
                newFieldErrors.password = er.msg;
            }
            else {
                // Collect general errors if they don't map to a specific field
                generalErrorMessage += (generalErrorMessage ? '; ' : '') + er.msg;
            }
        });
        setFieldErrors(newFieldErrors);
        if (generalErrorMessage) {
            setError(generalErrorMessage);
        }

      } else if (err.response && err.response.data && err.response.data.msg) {
        // For a single general error message from the backend.
        setError(err.response.data.msg);
      }
      else {
        // For other types of errors (network error, etc.).
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-form-wrapper">
        <h2>Create Your Account</h2>
        <p>Join BudgetBackpack and start planning your dream trips!</p>
        <form onSubmit={handleSubmit} className="register-form">
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
              // My backend User model has password validation, so errors might come from there.
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
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
            />
            {fieldErrors.confirmPassword && <p id="confirmPassword-error" className="form-error-message">{fieldErrors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn-register primary" disabled={loading}>
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