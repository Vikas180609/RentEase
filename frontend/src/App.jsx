import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct"; // 👈 Updated name
import ProductDetails from "./pages/ProductDetails"; // 👈 Updated name
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyRentals from "./pages/MyRentals";
import MyListings from "./pages/MyListings";
import Success from './pages/Success';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-rentals" element={<ProtectedRoute><MyRentals /></ProtectedRoute>} />
        <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/success" element={<Success />} />
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