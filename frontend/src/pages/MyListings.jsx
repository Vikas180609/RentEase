import { useState, useEffect } from 'react';
import axios from 'axios';
import { Store, Trash2, Pencil, X, Sparkles } from 'lucide-react';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState({
    _id: '', title: '', category: '', monthlyRent: '', securityDeposit: '', image: ''
  });

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const response = await axios.get(`https://rentease-iz7b.onrender.com/api/products/owner/${userInfo.email}`);
        setListings(response.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) fetchMyListings();
  }, [userInfo]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing from your vault?")) {
      try {
        await axios.delete(`https://rentease-iz7b.onrender.com/api/products/${id}`);
        setListings(listings.filter((item) => item._id !== id));
      } catch (error) {
        alert("Failed to delete listing.");
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://rentease-iz7b.onrender.com/api/products/${editingProduct._id}`, editingProduct);
      setListings(listings.map(item => item._id === editingProduct._id ? response.data : item));
      setIsModalOpen(false); 
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update listing.");
    }
  };

  if (!userInfo) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-bold text-xl text-zinc-400">Please log in to view your listings.</div>;
  if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-bold text-sm tracking-widest uppercase text-amber-500 animate-pulse">Accessing Vault...</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-16 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center mb-12">
          <div className="bg-zinc-950 p-3 rounded-2xl mr-4 shadow-lg">
            <Store className="text-amber-500 w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black text-zinc-900 tracking-tight">My Listings</h2>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white py-20 px-10 rounded-[2.5rem] shadow-sm border border-zinc-100 text-center">
            <Sparkles className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <p className="text-zinc-500 text-lg font-medium">Your vault is empty. Start adding premium items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {listings.map((item) => (
              <div key={item._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-zinc-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                <div className="relative h-56 overflow-hidden bg-zinc-50">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-zinc-900 uppercase tracking-widest shadow-sm">
                    {item.category}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-zinc-900 mb-4 capitalize">{item.title}</h3>
                  
                  <div className="flex justify-between items-end mb-6 mt-auto">
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Monthly Lease</span>
                      <span className="font-black text-2xl text-zinc-900">${item.monthlyRent}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-100">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="flex items-center justify-center bg-zinc-950 text-white hover:bg-amber-500 py-3 rounded-xl text-sm font-bold transition-colors duration-300"
                    >
                      <Pencil className="w-4 h-4 mr-1.5" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center justify-center bg-zinc-50 text-zinc-400 hover:bg-red-50 hover:text-red-500 py-3 rounded-xl text-sm font-bold transition-colors duration-300"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🛠️ PREMIUM EDITING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
            
            <div className="flex justify-between items-center p-8 border-b border-zinc-100">
              <h3 className="text-2xl font-black text-zinc-900 flex items-center">
                <Pencil className="w-6 h-6 mr-3 text-amber-500"/> Edit Details
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 bg-zinc-50 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 space-y-5">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Item Title</label>
                <input type="text" name="title" value={editingProduct.title} onChange={handleInputChange} required className="w-full border-0 bg-zinc-50 px-5 py-4 rounded-2xl text-zinc-900 font-medium focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Picture URL</label>
                <input type="text" name="image" value={editingProduct.image} onChange={handleInputChange} required className="w-full border-0 bg-zinc-50 px-5 py-4 rounded-2xl text-zinc-500 font-mono text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Monthly Rent</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                    <input type="number" name="monthlyRent" value={editingProduct.monthlyRent} onChange={handleInputChange} required className="w-full border-0 bg-zinc-50 pl-9 pr-5 py-4 rounded-2xl text-zinc-900 font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2">Deposit</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                    <input type="number" name="securityDeposit" value={editingProduct.securityDeposit} onChange={handleInputChange} required className="w-full border-0 bg-zinc-50 pl-9 pr-5 py-4 rounded-2xl text-zinc-900 font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-zinc-950 hover:bg-amber-500 text-white py-5 rounded-2xl font-bold text-lg transition-colors duration-500 shadow-lg">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
