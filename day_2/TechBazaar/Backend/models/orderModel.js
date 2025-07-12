import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            seller: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            status: {
                type: String,
                enum: ["Pending","Shipped"],
                default: "Pending"
            }
        }
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: {
            type: String,
            default: "Pakistan",
            required: true
        }
    },
    paymentMethod: {
        type: String,
        default: "Cash on Delivery"
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
