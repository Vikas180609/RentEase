import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

const Success = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const finalizeOrder = async () => {
      // 1. Grab everything from local storage
      const cart = JSON.parse(localStorage.getItem('rentEaseCart'));
      const pendingOrder = JSON.parse(localStorage.getItem('rentEasePendingOrder'));
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      // If they somehow got here without a cart, just send them home
      if (!cart || cart.length === 0 || !userInfo || !pendingOrder) {
        setIsProcessing(false);
        return;
      }

      // 2. Calculate totals
      const totalMonthly = cart.reduce((sum, item) => sum + item.monthlyRent, 0);
      const totalDeposit = cart.reduce((sum, item) => sum + item.securityDeposit, 0);

      // 3. Build the final order object for MongoDB
      const finalOrderData = {
        userEmail: userInfo.email,
        items: cart.map(item => ({
          productId: item._id,
          title: item.title,
          image: item.image,
          monthlyRent: item.monthlyRent,
          securityDeposit: item.securityDeposit,
          tenure: item.selectedTenure || item.tenure || 3 
        })),
        deliveryAddress: pendingOrder.deliveryAddress,
        deliveryDate: pendingOrder.deliveryDate,
        totalMonthlyRent: totalMonthly,
        totalDeposit: totalDeposit
      };

      try {
        // 4. Save to the database!
        await axios.post('http://localhost:5000/api/orders', finalOrderData);
        
        // 5. Clean up local storage so the cart is empty again
        localStorage.removeItem('rentEaseCart');
        localStorage.removeItem('rentEasePendingOrder');
        
        setIsProcessing(false);
      } catch (error) {
        console.error("Failed to save order to database:", error);
        setIsProcessing(false);
      }
    };

    finalizeOrder();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col items-center justify-center px-4">
      <div className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl border border-zinc-100 text-center max-w-lg w-full">
        
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-zinc-900">Securing your Vault...</h2>
          </div>
        ) : (
          <>
            <div className="mx-auto bg-amber-50 w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-inner">
              <ShieldCheck className="w-12 h-12 text-amber-500" />
            </div>
            
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">
              Payment Successful
            </h1>
            
            <p className="text-zinc-500 font-medium mb-10 text-lg leading-relaxed">
              Your premium pieces have been secured. Our concierge team will contact you shortly to confirm your delivery window.
            </p>

            <Link 
              to="/" 
              className="w-full bg-zinc-950 hover:bg-amber-500 text-white py-5 rounded-2xl font-bold text-lg transition-colors flex justify-center items-center group shadow-lg"
            >
              Return to Collection
              <Sparkles className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </>
        )}

      </div>
    </div>
  );
};

export default Success;