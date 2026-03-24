import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            title: String,
            image: String,
            monthlyRent: Number,
            securityDeposit: Number,
            tenure: Number // e.g., 3, 6, 12 months
        }
    ],
    deliveryAddress: {
        type: String,
        required: true,
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    totalMonthlyRent: {
        type: Number,
        required: true,
    },
    totalDeposit: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending Delivery', // Can be: Pending Delivery, Active, Completed
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;