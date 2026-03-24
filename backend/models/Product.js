import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Furniture', 'Appliances'] // As per PRD
  },
  subCategory: { type: String, required: true }, // e.g., Bed, Fridge, Sofa
  monthlyRent: { type: Number, required: true }, // Monthly rental plan
  securityDeposit: { type: Number, required: true }, // Security deposit requirement
  tenureOptions: { 
    type: [Number], 
    default: [3, 6, 12] // Flexible tenure plans
  },
  image: { type: String, required: true },
  ownerName: String,
  ownerEmail: String,
  isAvailable: { type: Boolean, default: true } // Track availability
}, { timestamps: true });

export default mongoose.model('Product', productSchema);