import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";



const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  // New states for error and loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // IMPORTANT: Update this URL if your backend route is different!
      // If deployed, this should be your Render URL: 'https://rentease-api.onrender.com/api/users/register'
      const { data } = await axios.post("https://rentease-iz7b.onrender.com/api/users/register", formData);

      // Save the user data (and token) to localStorage so the Navbar knows they are logged in
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Redirect the user to the home page after successful registration
      navigate("/");
      
      // Force a reload so the Navbar updates instantly with their name
      window.location.reload(); 

    } catch (err) {
      // If the backend sends an error (like "User already exists"), show it to the user
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 pt-20">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-lg border border-zinc-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
            Join the <span className="text-amber-500">Elite.</span>
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Create an account to unlock premium rentals.
          </p>
        </div>

        {/* Display Error Message if Registration Fails */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-3.5 rounded-lg transition-colors duration-300 shadow-md ${
              loading ? "bg-zinc-400 cursor-not-allowed" : "bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-600">
            Already a member?{" "}
            <Link to="/login" className="font-bold text-zinc-900 hover:text-amber-500 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
