import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Package } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  // 1. Load the cart when the page opens
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('rentEaseCart')) || [];
    setCart(savedCart);
  }, []);

  // 2. The Delete Function with the Magic Ping!
  const handleRemoveItem = (productId) => {
    // Filter out the item we want to delete
    const updatedCart = cart.filter(item => item._id !== productId);
    
    // Save the new, smaller list back to local storage
    localStorage.setItem('rentEaseCart', JSON.stringify(updatedCart));
    
    // Update the screen
    setCart(updatedCart); 

    // ✨ THE MAGIC LINE: Tell the Navbar we deleted something!
    window.dispatchEvent(new Event('cartUpdated')); 
  };

  // 3. Calculate Totals
  const totalMonthly = cart.reduce((sum, item) => sum + item.monthlyRent, 0);
  const totalDeposit = cart.reduce((sum, item) => sum + item.securityDeposit, 0);

  // If the vault is empty, show a nice empty state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center font-sans px-4">
        <Package className="w-20 h-20 text-zinc-200 mb-6" />
        <h2 className="text-3xl font-black text-zinc-900 mb-2">Your Selection is Empty</h2>
        <p className="text-zinc-500 font-medium mb-8">You haven't added any premium pieces to your vault yet.</p>
        <Link to="/" className="bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-md">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-16 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-10">
          Your Selection
        </h1>

        {/* --- Cart Items List --- */}
        <div className="space-y-4 mb-10">
          {cart.map((item, index) => (
            <div key={index} className="bg-white p-5 md:p-6 rounded-[2rem] flex items-center shadow-sm border border-zinc-100 transition-all hover:shadow-md">
              
              {/* Product Image */}
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-2xl bg-zinc-50 flex-shrink-0"
              />
              
              {/* Product Details */}
              <div className="flex-grow ml-4 md:ml-6">
                <h3 className="text-xl md:text-2xl font-black text-zinc-900">{item.title}</h3>
                <p className="text-zinc-500 text-sm font-medium mt-1">
                  Lease: {item.selectedTenure || item.tenure || 3} Months
                </p>
              </div>

              {/* Pricing & Trash */}
              <div className="flex items-center space-x-4 md:space-x-8">
                <div className="text-right">
                  <div className="flex items-baseline justify-end">
                    <span className="text-amber-500 font-black text-xl md:text-2xl">${item.monthlyRent}</span>
                    <span className="text-zinc-400 font-bold text-sm ml-1">/mo</span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    Dep: ${item.securityDeposit}
                  </p>
                </div>
                
                {/* Trash Button */}
                <button 
                  onClick={() => handleRemoveItem(item._id)}
                  className="p-3 md:p-4 bg-zinc-50 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-2xl transition-colors group"
                  title="Remove Item"
                >
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* --- Dark Mode Summary Box --- */}
        <div className="bg-zinc-950 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Monthly Total</span>
            <span className="text-3xl font-black text-white">${totalMonthly}</span>
          </div>
          
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Security Deposit</span>
            <span className="text-3xl font-black text-white">${totalDeposit}</span>
          </div>

          <div className="h-px w-full bg-zinc-800 mb-8"></div>

          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 py-5 rounded-2xl font-black text-xl transition-colors flex justify-center items-center shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)]"
          >
            Proceed to Checkout <ArrowRight className="w-6 h-6 ml-2" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;