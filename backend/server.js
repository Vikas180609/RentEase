import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe'; 

import Product from './models/Product.js'; 
import Order from './models/Order.js'; 
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// 💳 Initialize Stripe with your Secret Key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(express.json());
app.use(cors());

// 🚨 Database Connection
mongoose.connect('mongodb://localhost:27017/rentease')
    .then(() => console.log('✅ RentEase Database Connected'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));


// ==========================================
// 🔐 AUTHENTICATION API
// ==========================================
app.use('/api/auth', authRoutes);


// ==========================================
// 🛋️ PRODUCT API (Furniture & Appliances)
// ==========================================

// GET all products (Supports category filtering on Home Page)
app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};
        
        if (category && category !== 'All') {
            filter.category = category;
        }

        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error: Could not fetch products" });
    }
});

// GET products by owner email (For 'My Listings' Page)
app.get('/api/products/owner/:email', async (req, res) => {
    try {
        const myProducts = await Product.find({ ownerEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(myProducts);
    } catch (error) {
        res.status(500).json({ message: "Server Error: Could not fetch your listings" });
    }
});

// GET a single product by ID (For Product Details Page)
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server Error: Could not fetch product details" });
    }
});

// POST a new product (For Add Product Page)
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Post Error:", error);
        res.status(400).json({ message: "Failed to list product." });
    }
});

// DELETE a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product removed from inventory" });
    } catch (error) {
        res.status(500).json({ message: "Server Error: Delete failed" });
    }
});

// PUT (Update) a product
app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Server Error: Update failed" });
    }
});


// ==========================================
// 💳 STRIPE PAYMENT API
// ==========================================
app.post('/api/stripe/create-checkout-session', async (req, res) => {
    try {
        const { items, userEmail } = req.body;

        const lineItems = items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.image],
                    description: `${item.tenure || 3} Month Lease | Security Deposit Included`,
                },
                // Stripe requires amounts in cents!
                unit_amount: (item.monthlyRent + item.securityDeposit) * 100,
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: userEmail,
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:5173/success', 
            cancel_url: 'http://localhost:5173/checkout',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ error: error.message });
    }
});


// ==========================================
// 📦 ORDERS API (Checkout & Order History)
// ==========================================

// POST: Create a new rental order (From Checkout Page)
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Order Error:", error);
        res.status(400).json({ message: "Failed to place order." });
    }
});

// GET: Fetch orders for a specific user
app.get('/api/orders/:email', async (req, res) => {
    try {
        const userOrders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(userOrders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user orders." });
    }
});


// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 RentEase Backend running on port ${PORT}`);
});