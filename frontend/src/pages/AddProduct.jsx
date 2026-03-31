import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Upload, DollarSign, Image as ImageIcon, Tag, MapPin, CheckCircle, Loader2 } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✨ FIX 1: Set the default category to exactly match your backend enum
  const [formData, setFormData] = useState({
    title: '',
    category: 'Furniture', 
    subCategory: '',
    monthlyRent: '',
    securityDeposit: '',
    image: '',
    tenureOptions: [3, 6, 12] 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTenureToggle = (months) => {
    setFormData((prev) => {
      const options = prev.tenureOptions.includes(months)
        ? prev.tenureOptions.filter((t) => t !== months)
        : [...prev.tenureOptions, months].sort((a, b) => a - b);
      return { ...prev, tenureOptions: options };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}` 
        }
      };

      const payload = {
        ...formData,
        ownerName: userInfo?.name,
        ownerEmail: userInfo?.email,
      };

      await api.post('/api/products', payload, config);
      
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error("Full Backend Error:", error);
      const backendMessage = error.response?.data?.message || error.response?.data || error.message;
      alert(`Backend Error: ${JSON.stringify(backendMessage)}\n\nCheck your backend terminal for more details.`);
      setLoading(false);
    }
  };

  if (!userInfo) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-16 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">List a Piece</h1>
          <p className="text-zinc-500 font-medium mt-2 text-lg">Add your premium items to the vault.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          <div className="lg:col-span-3 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-zinc-100">
            {success ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                <h2 className="text-3xl font-black text-zinc-900 mb-2">Successfully Listed!</h2>
                <p className="text-zinc-500 font-medium">Your piece is now live in the collection.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Piece Title</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <input 
                        type="text" name="title" required
                        value={formData.title} onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                        placeholder="e.g. Velvet Mid-Century Sofa"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Category</label>
                    <select 
                      name="category" 
                      value={formData.category} onChange={handleChange}
                      className="w-full px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-colors appearance-none"
                    >
                      {/* ✨ FIX 2: Updated dropdown options to perfectly match your Mongoose enum */}
                      <option value="Furniture">Furniture</option>
                      <option value="Appliances">Appliances</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Sub-Category / Type</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                    <input 
                      type="text" name="subCategory" required
                      value={formData.subCategory} onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                      placeholder="e.g. Bed, Fridge, Sofa"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Monthly Rent (₹)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <input 
                        type="number" name="monthlyRent" required
                        value={formData.monthlyRent} onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-lg focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                        placeholder="999"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Security Deposit (₹)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <input 
                        type="number" name="securityDeposit" required
                        value={formData.securityDeposit} onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-black text-lg focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                        placeholder="2500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">High-Res Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                    <input 
                      type="url" name="image" required
                      value={formData.image} onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Available Lease Terms (Months)</label>
                  <div className="flex flex-wrap gap-4">
                    {[3, 6, 9, 12, 24].map((months) => (
                      <button
                        type="button"
                        key={months}
                        onClick={() => handleTenureToggle(months)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                          formData.tenureOptions.includes(months)
                            ? 'border-zinc-950 bg-zinc-950 text-white'
                            : 'border-zinc-100 text-zinc-400 bg-zinc-50 hover:border-zinc-300'
                        }`}
                      >
                        {months} mo
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-amber-500 text-zinc-950 py-5 rounded-2xl font-black text-lg hover:bg-amber-400 transition-all flex items-center justify-center space-x-3 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                  <span>{loading ? 'Vaulting...' : 'List in Vault'}</span>
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 sticky top-24 hidden lg:block">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Live Card Preview</h3>
            
            <div className="bg-white p-5 rounded-[2rem] border border-zinc-100 shadow-xl overflow-hidden pointer-events-none">
              <div className="w-full h-64 rounded-[1.5rem] overflow-hidden mb-6 bg-zinc-100 flex items-center justify-center">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-zinc-300" />
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-2 capitalize">
                  {formData.category}
                </span>
                <h2 className="text-2xl font-black text-zinc-900 mb-2 line-clamp-1">
                  {formData.title || 'Your Product Title'}
                </h2>
                
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-zinc-100">
                  <div>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-1">Lease From</span>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-black text-zinc-900">
                        ₹{formData.monthlyRent || '0'}
                      </span>
                      <span className="text-zinc-500 font-medium ml-1">/mo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-zinc-400 text-sm font-medium mt-6">
              This is exactly how users will see your piece in the collection.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddProduct;
