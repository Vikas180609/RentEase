import { useEffect } from "react"; // 👈 Added useEffect
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom"; // 👈 Added useNavigate
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyRentals from "./pages/MyRentals";
import MyListings from "./pages/MyListings";
import Success from './pages/Success';
import Register from './pages/Register';

// ✨ NEW: Helper component to force redirect to home on a fresh tab
const InitialRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If this is a brand new tab, force them to the home page
    if (!sessionStorage.getItem("rentEaseSessionStarted")) {
      sessionStorage.setItem("rentEaseSessionStarted", "true");
      navigate("/"); 
    }
  }, [navigate]);

  return null; // This component doesn't show any UI, it just handles the redirect logic
};

function App() {
  return (
    <Router>
      {/* ✨ NEW: Place the redirect helper inside the Router, before the Navbar */}
      <InitialRedirect />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-rentals" element={<ProtectedRoute><MyRentals /></ProtectedRoute>} />
        <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/success" element={<Success />} />
        <Route path="/register" element={<Register />} />
        
        {/* 🛡️ Wrap the AddProduct route in the ProtectedRoute */}
        <Route
          path="/add-product" // 👈 Changed from /add-property
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        {/* 🚨 KEY FIX: Changed from /property/:id to match Home.jsx links */}
        <Route path="/product/:id" element={<ProductDetails />} />
        
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;