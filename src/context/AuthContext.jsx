// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // I might need axios if I fetch user data after login.

// First, I'm creating the context itself.
const AuthContext = createContext();

// Then, I'm creating a custom hook to make it easier to use this context elsewhere in my app.
export const useAuth = () => {
  return useContext(AuthContext);
};

// This is my AuthProvider component. It will wrap around parts of my app that need auth state.
export const AuthProvider = ({ children }) => {
  // I need state to hold the authentication token.
  // I'll initialize it by checking localStorage to see if a token already exists (e.g., from a previous session).
  const [token, setToken] = useState(localStorage.getItem('token'));
  // I could also store user information here.
  const [user, setUser] = useState(null); // For now, null. I could fetch user data later.
  const [loading, setLoading] = useState(true); // To handle initial loading state while checking token.

  // This useEffect hook will run once when the AuthProvider mounts.
  // Its job is to validate the token from localStorage, if it exists.
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // If I have a token, I should set it in my state.
      setToken(storedToken);
      // I also need to set the default Authorization header for axios so that
      // all subsequent API calls automatically include the token.
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      // TODO: Here, I might want to fetch the user's details using the token
      // to confirm the token is valid and to get user data.
      // For example:
      // axios.get('/api/auth/me') // Assuming I have an endpoint to get current user
      //   .then(response => setUser(response.data))
      //   .catch(() => {
      //     // If fetching user fails (e.g., token invalid), I should clear the token.
      //     localStorage.removeItem('token');
      //     setToken(null);
      //     delete axios.defaults.headers.common['Authorization'];
      //   })
      //   .finally(() => setLoading(false));
      // For now, I'll just assume the token is valid if it exists, for simplicity given the deadline.
      setLoading(false); // Placeholder for now
    } else {
      // If no token, just finish loading.
      setLoading(false);
    }
  }, []); // The empty dependency array means this runs only once on mount.

  // This function will be called when a user successfully logs in or registers.
  const loginAction = (newToken) => {
    localStorage.setItem('token', newToken); // Storing the new token.
    setToken(newToken); // Updating the token in my state.
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`; // Setting for future axios calls.
    // TODO: Fetch user data after login as well.
    // setUser(userDataFromApi);
  };

  // This function will handle user logout.
  const logoutAction = () => {
    localStorage.removeItem('token'); // Removing the token from storage.
    setToken(null); // Clearing the token from my state.
    setUser(null); // Clearing user data.
    delete axios.defaults.headers.common['Authorization']; // Removing the auth header from axios.
    // I'll likely redirect the user to the login page after logout from the component calling this.
  };

  // The value prop of the Provider is what gets passed down to consuming components.
  // It includes the authentication state and the login/logout functions.
  const authContextValue = {
    token,
    user,
    isAuthenticated: !!token, // A simple way to check if the user is authenticated.
    loading, // To let components know if auth state is still being determined.
    loginAction,
    logoutAction,
    // setUser, // I might expose setUser if user data fetching is complex
  };

  // I'm returning the Provider component, wrapping the children.
  // I only render children once the initial loading (token check) is complete.
  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};