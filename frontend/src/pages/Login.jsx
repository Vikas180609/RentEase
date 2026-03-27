import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles } from 'lucide-react'; 
import axios from 'axios'; 

const Login = () => {
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true); 
  const [error, setError] = useState(''); 

  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      if (isLogin) {
        // 🚪 LOGIN REQUEST
        const response = await axios.post('https://rentease-iz7b.onrender.com/api/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        navigate('/'); 
        
      } else {
        // 📝 REGISTER REQUEST
        await axios.post('https://rentease-iz7b.onrender.com/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        alert('Vault access granted! Please sign in.');
        setIsLogin(true); 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-zinc-950 font-sans">
      
      {/* 🌌 Ambient Luxury Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-2xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLogin ? 'Member Access' : 'Apply for Access'}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            {isLogin ? 'Welcome back.' : 'Join the Vault.'}
          </h2>
          <p className="text-sm text-zinc-400 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-bold text-amber-500 hover:text-amber-400 cursor-pointer transition-colors"
            >
              {isLogin ? 'Sign up today' : 'Sign in instead'}
            </span>
          </p>
        </div>

        {/* 🎛️ Frosted Glass Form Card */}
        <div className="bg-zinc-900/60 backdrop-blur-xl py-10 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-zinc-800 sm:rounded-[2.5rem] sm:px-12">
          
          {/* Show Error Message if there is one */}
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center">
              <p className="text-sm font-bold text-red-400">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Conditional Name Input */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="text" name="name" required={!isLogin}
                    value={formData.name} onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Email address</label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="password" name="password" required
                  value={formData.password} onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-zinc-950/50 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.2)] text-lg font-black text-zinc-950 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-amber-500 transition-all transform active:scale-[0.98]"
              >
                {isLogin ? 'Sign in' : 'Create Account'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
