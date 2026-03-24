import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user has their VIP pass in local storage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!userInfo) {
    // 🛑 No pass? Redirect them immediately to the login page!
    return <Navigate to="/login" replace />;
  }

  // ✅ Pass valid! Let them through to the page they requested
  return children;
};

export default ProtectedRoute;