import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, ShieldCheck, Sparkles } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [cart, setCart] = useState([]);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('rentEaseCart')) || [];
    if (savedCart.length === 0) {
      navigate('/cart');
    }
    setCart(savedCart);
  }, [navigate]);

  const totalMonthly = cart.reduce((sum, item) => sum + item.monthlyRent, 0);
  const totalDeposit = cart.reduce((sum, item) => sum + item.securityDeposit, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      alert("Please log in to finalize your vault request.");
      return navigate('/login');
    }

    // 1. Temporarily save the address & date so we have them when they return from Stripe!
    localStorage.setItem('rentEasePendingOrder', JSON.stringify({
      deliveryAddress: address,
      deliveryDate: deliveryDate
    }));

    try {
      // 2. Ask backend to generate a Stripe Checkout URL
      const response = await axios.post('https://rentease-iz7b.onrender.com/api/stripe/create-checkout-session', {
        items: cart,
        userEmail: userInfo.email,
      });
      
      // 3. Redirect the user to the secure Stripe page!
      if (response.data.url) {
        window.location.href = response.data.url; 
      }
    } catch (error) {
      console.error("Stripe Checkout Error:", error);
      alert("Failed to initialize secure checkout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-16 px-4 font-sans flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-zinc-100">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-zinc-900 tracking-tight mb-3">Finalize Delivery</h2>
          <p className="text-zinc-500 font-medium flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-amber-500" />
            Secure Encrypted Checkout
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-8">
          
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-zinc-900" /> Delivery Address
            </label>
            <textarea 
              required
              className="w-full bg-zinc-50 border-0 p-6 rounded-2xl text-zinc-900 font-medium placeholder-zinc-300 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
              placeholder="Enter your full residential address"
              rows="3"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-zinc-900" /> Preferred Date
            </label>
            <input 
              type="date" 
              required
              className="w-full bg-zinc-50 border-0 p-6 rounded-2xl text-zinc-900 font-medium focus:ring-2 focus:ring-amber-500 outline-none transition-all cursor-pointer"
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>

          {/* Dark Mode Receipt */}
          <div className="bg-zinc-950 p-8 rounded-3xl text-white mt-4">
            <h4 className="font-bold text-zinc-400 uppercase tracking-widest text-xs mb-6">Order Summary</h4>
            <div className="flex justify-between items-center mb-4">
               <span className="font-medium text-zinc-300">Items Selected</span>
               <span className="font-bold">{cart.length}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
               <span className="font-medium text-zinc-300">Monthly Rent</span>
               <span className="font-bold">${totalMonthly}</span>
            </div>
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-zinc-800">
               <span className="font-medium text-zinc-300">Security Deposit</span>
               <span className="font-bold">${totalDeposit}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="font-black text-lg">Total Due Now</span>
               <span className="font-black text-3xl text-amber-500">${totalMonthly + totalDeposit}</span>
            </div>
          </div>

          <button type="submit" className="w-full bg-zinc-950 hover:bg-amber-500 text-white py-5 rounded-2xl font-bold text-lg transition-colors flex justify-center items-center group shadow-xl">
            Confirm & Schedule
            <Sparkles className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
