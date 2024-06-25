// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ element: Element }) => {
  const token = localStorage.getItem('token');
  const isUserSignedIn = !!token;
  return isUserSignedIn ? <Element /> : <Navigate to="/" />;
};

const AdminRoute = ({ element: Element }) => {
  const token = localStorage.getItem('token');
  const isUserSignedIn = !!token;

  if (isUserSignedIn) {
    try {
      const decodedToken = jwtDecode(token);
      const isAdmin = decodedToken.userId === '6650160f0b6714346b51519e';
      return isAdmin ? <Element /> : <Navigate to="/" />;
    } catch (error) {
      console.error("Invalid token:", error);
      return <Navigate to="/" />;
    }
  }

  return <Navigate to="/" />;
};

export { ProtectedRoute, AdminRoute };
