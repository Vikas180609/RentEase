import { Link, useNavigate } from "react-router-dom";
// Cleaned up the imports: removed the unused icons (LayoutGrid, PlusCircle, Store, Key)
import { User, LogOut, ShoppingBag } from "lucide-react"; 
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  
  // Cart Badge State
  const [cartCount, setCartCount] = useState(0);
  
  // ✨ NEW: Smart Scroll States
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Update Cart Logic
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('rentEaseCart')) || [];
    setCartCount(cart.length);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  // ✨ NEW: Smart Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling DOWN and we've scrolled past the top 80px, hide it
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } 
      // If scrolling UP, show it
      else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-zinc-100 shadow-sm transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 🌟 Luxury Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-black tracking-tighter text-zinc-900 group-hover:text-amber-500 transition-colors duration-300">
              Rent<span className="text-amber-500 group-hover:text-zinc-900 transition-colors duration-300">Ease</span>
            </span>
          </Link>

          {/* 🧭 Navigation Links (Icons Removed) */}
          <div className="flex items-center space-x-8">
            
            <Link to="/" className="hidden md:flex items-center text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">
              Collection
            </Link>
            
            {userInfo && (
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/add-product" className="flex items-center text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">
                  List Item
                </Link>
                <Link to="/my-listings" className="flex items-center text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">
                  My Listings
                </Link>
                <Link to="/my-rentals" className="flex items-center text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors">
                  My Rentals
                </Link>
              </div>
            )}

            {/* 🛒 Premium Cart Link (Kept the bag icon as it's standard UI) */}
            {userInfo && (
              <Link to="/cart" className="relative text-zinc-500 hover:text-zinc-900 transition-colors flex items-center">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm transition-all transform scale-100 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* 👤 User Profile / Login */}
            {userInfo ? (
              <div className="flex items-center space-x-4 pl-6 border-l border-zinc-200">
                <div className="flex items-center text-sm font-bold text-zinc-900 bg-zinc-100 px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4 mr-1.5 text-amber-500" />
                  {userInfo.name.split(" ")[0]}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 pl-4">
                <Link to="/login" className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="bg-zinc-950 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-amber-500 hover:text-zinc-950 transition-colors duration-300 shadow-md">
                  Join Elite
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;