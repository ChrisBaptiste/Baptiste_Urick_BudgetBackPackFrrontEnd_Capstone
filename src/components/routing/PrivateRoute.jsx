// src/components/routing/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // I need Navigate for redirection and Outlet to render nested routes/child component.
import { useAuth } from '../../context/AuthContext'; // My auth context to check isAuthenticated.

// This component will guard routes that require authentication.
// It can be used in two ways:
// 1. As a wrapper for a single route: or
// 2. As a layout route for multiple nested protected routes: 
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Getting the authentication status and loading state.

  // If the authentication status is still loading (e.g., checking token on initial app load),
  // I don't want to redirect prematurely. I'll show a loading indicator or nothing.
  if (loading) {
    // It's good to have some loading UI, but for now, returning null is simple.
    // Or I could return a spinner component: return <LoadingSpinner />;
    return <div>Loading authentication status...</div>; // Or a proper spinner component
  }

  // If the user is authenticated, I'll render the child component that this PrivateRoute is protecting,
  // or an <Outlet /> if this PrivateRoute is used as a layout for nested routes.
  if (isAuthenticated) {
    return children ? children : <Outlet />; // Render children if passed, otherwise Outlet for nested routes.
  }

  // If the user is NOT authenticated and loading is false,
  // I'll redirect them to the login page.
  // The 'replace' prop is important for UX; it replaces the current entry in the history stack,
  // so the user doesn't get stuck in a redirect loop if they hit the back button.
  // I'm also passing the current location via `state` so that after logging in,
  // the user can be redirected back to the page they were trying to access.
  return <Navigate to="/login" replace />;
  // To use the state for redirecting back:
  // return <Navigate to="/login" state={{ from: location }} replace />;
  // The LoginPage would then need to check location.state.from and navigate there.
};

export default PrivateRoute;