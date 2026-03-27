import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, ShieldCheck, Clock, ArrowLeft, ShoppingCart, Sparkles } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTenure, setSelectedTenure] = useState(3); 

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://rentease-iz7b.onrender.com/api/products/${id}`);
        setProduct(response.data);
        if (response.data.tenureOptions?.length > 0) {
          setSelectedTenure(response.data.tenureOptions[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('rentEaseCart')) || [];
    const isDuplicate = cart.some(item => item._id === product._id);
    
    if (isDuplicate) {
      alert("This piece is already in your selection!");
      // Decide if you still want to force navigate here, or just show the alert
      // navigate('/cart'); 
      return;
    }

    const itemToOrder = { ...product, selectedTenure };
    cart.push(itemToOrder);
    localStorage.setItem('rentEaseCart', JSON.stringify(cart));
    
    // ✨ THE MAGIC LINE: Tell the rest of the app the cart changed!
    window.dispatchEvent(new Event('cartUpdated'));
    
    const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('rentEaseCart')) || [];
    const isDuplicate = cart.some(item => item._id === product._id);
    
    if (isDuplicate) {
      alert("This piece is already in your selection!");
      // Decide if you still want to force navigate here, or just show the alert
      // navigate('/cart'); 
      return;
    }

    const itemToOrder = { ...product, selectedTenure };
    cart.push(itemToOrder);
    localStorage.setItem('rentEaseCart', JSON.stringify(cart));
    
    // ✨ THE MAGIC LINE: Tell the rest of the app the cart changed!
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Optional: You can remove navigate('/cart') if you want them to stay on the page!
    navigate('/cart'); 
  };
    navigate('/cart'); 
  };

  if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-black text-2xl text-zinc-900 animate-pulse">Unlocking Vault...</div>;
  if (!product) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-black text-2xl text-zinc-900">Piece not found.</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24 font-sans">
      
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-zinc-500 hover:text-zinc-900 font-bold tracking-wide transition-colors uppercase text-xs">
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Collection
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left: Premium Image Display */}
        <div className="rounded-[2.5rem] overflow-hidden bg-white shadow-sm border border-zinc-100 h-[500px] lg:h-[650px] sticky top-8">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Right: Details & Configurator */}
        <div className="space-y-10">
          <div>
            <div className="inline-block bg-zinc-900 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              {product.category}
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-zinc-900 leading-none tracking-tight">{product.title}</h1>
            <p className="flex items-center text-zinc-500 mt-4 text-lg font-medium">
              <MapPin className="w-5 h-5 mr-2 text-zinc-900" /> {product.subCategory}
            </p>
          </div>

          {/* Premium Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-zinc-100 flex flex-col justify-center space-y-2">
              <ShieldCheck className="text-amber-500 w-7 h-7" />
              <div>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Deposit</p>
                <p className="font-black text-zinc-900 text-lg">${product.securityDeposit}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-zinc-100 flex flex-col justify-center space-y-2">
              <Clock className="text-amber-500 w-7 h-7" />
              <div>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Coverage</p>
                <p className="font-black text-zinc-900 text-lg">24/7 Support</p>
              </div>
            </div>
          </div>

          {/* Tenure Configurator */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-zinc-100">
            <div className="mb-10">
              <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest mb-2">Lease Starting At</p>
              <div className="flex items-baseline">
                <span className="text-6xl font-black text-zinc-900">${product.monthlyRent}</span>
                <span className="text-zinc-400 ml-2 font-bold text-lg">/ mo</span>
              </div>
            </div>

            <div className="space-y-5 mb-10">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Select Tenure</label>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {product.tenureOptions?.map((months) => (
                  <button
                    key={months}
                    onClick={() => setSelectedTenure(months)}
                    className={`py-5 rounded-2xl font-black transition-all border-2 ${
                      selectedTenure === months 
                      ? 'border-zinc-950 bg-zinc-950 text-white shadow-lg scale-[1.02]' 
                      : 'border-zinc-100 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 bg-zinc-50'
                    }`}
                  >
                    {months} <span className="text-xs uppercase block mt-1 opacity-80 font-bold">Months</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total Box */}
            <div className="bg-zinc-950 rounded-3xl p-8 mb-8 text-white">
              <div className="flex justify-between items-center mb-4 text-zinc-400 font-medium">
                <span>First Month Rent</span>
                <span className="font-bold text-white">${product.monthlyRent}</span>
              </div>
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-zinc-800 text-zinc-400 font-medium">
                <span>Refundable Deposit</span>
                <span className="font-bold text-white">${product.securityDeposit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase text-xs tracking-widest text-zinc-400">Total Due Today</span>
                <span className="text-4xl font-black text-amber-500">${product.monthlyRent + product.securityDeposit}</span>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-amber-500 text-zinc-950 py-5 rounded-2xl font-black text-lg hover:bg-amber-400 transition-all flex items-center justify-center space-x-3 shadow-xl"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>Secure This Piece</span>
            </button>
          </div>

          <div className="p-6 bg-zinc-900 text-zinc-400 rounded-3xl flex items-start space-x-4 border border-zinc-800">
            <Sparkles className="text-amber-500 w-6 h-6 flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed font-medium">
              <strong className="text-white">Premium Guarantee:</strong> Every piece undergoes a rigorous quality inspection before entering the vault. Includes complimentary white-glove delivery and maintenance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
