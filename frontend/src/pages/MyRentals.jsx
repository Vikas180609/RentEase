import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyRentals = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Get the logged-in user
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchMyRentals = async () => {
      if (!userInfo) {
        setIsLoading(false);
        return;
      }

      try {
        // 2. Fetch only THIS user's orders using the endpoint we built
        const response = await axios.get(`http://localhost:5000/api/orders/${userInfo.email}`);
        setOrders(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch rentals:", error);
        setIsLoading(false);
      }
    };

    fetchMyRentals();
  }, []);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <h2 className="text-2xl font-bold text-zinc-900 mb-4">Please log in to view your vault.</h2>
        <Link to="/login" className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-16 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-black text-zinc-900 tracking-tight mb-8">My Active Rentals</h2>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] text-center border border-zinc-100 shadow-sm">
            <Package className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Your vault is empty</h3>
            <p className="text-zinc-500 mb-6">You haven't secured any premium pieces yet.</p>
            <Link to="/" className="bg-zinc-950 hover:bg-amber-500 transition-colors text-white px-8 py-4 rounded-xl font-bold">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-zinc-100">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-zinc-100 pb-6 mb-6">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Order ID: {order._id.slice(-6)}</p>
                    <div className="flex items-center text-zinc-900 font-medium mt-2">
                      <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                      Delivery Scheduled: {new Date(order.deliveryDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-zinc-500 text-sm mt-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      {order.deliveryAddress}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-left md:text-right">
                    <p className="text-sm font-medium text-zinc-500">Total Monthly</p>
                    <p className="text-2xl font-black text-zinc-900">${order.totalMonthlyRent}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>

                {/* Rented Items List */}
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-xl bg-zinc-100" />
                      <div>
                        <h4 className="font-bold text-zinc-900">{item.title}</h4>
                        <p className="text-sm text-zinc-500">{item.tenure} Months Lease</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentals;