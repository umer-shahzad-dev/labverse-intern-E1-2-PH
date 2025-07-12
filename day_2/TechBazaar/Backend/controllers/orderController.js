import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// ✅ Create new order (Cash on Delivery)
export const placeOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            totalAmount
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items to order" });
        }

        // Extract seller from each product
        const fullItems = await Promise.all(items.map(async item => {
            const product = await Product.findById(item.product);
            return {
                product: item.product,
                quantity: item.quantity || 1,
                seller: product.seller
            };
        }));

        const order = await Order.create({
            user: req.user.id,
            items: fullItems,
            shippingAddress,
            totalAmount,
        });

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        console.error("placeOrder error:", error);
        res.status(500).json({ message: "Failed to place order" });
    }
};

// ✅ Get orders for logged-in user
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate("items.product");
        res.status(200).json(orders);
    } catch (error) {
        console.error("getMyOrders error:", error);
        res.status(500).json({ message: "Failed to fetch your orders" });
    }
};

// ✅ Update order status (for seller only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // check if current user is the seller for at least one item
        const isSeller = order.items.some(item => item.seller.toString() === req.user.id);

        if (!isSeller) {
            return res.status(403).json({ message: "Not authorized to update this order" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        console.error("updateOrderStatus error:", error);
        res.status(500).json({ message: "Failed to update order status" });
    }
};

// ✅ Cancel order (only if not delivered)
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to cancel this order" });
        }

        if (order.status === "Shipped") {
            return res.status(400).json({ message: "Delivered order cannot be cancelled" });
        }

        await order.deleteOne();
        res.status(200).json({ message: "Order cancelled successfully" });
    } catch (error) {
        console.error("cancelOrder error:", error);
        res.status(500).json({ message: "Failed to cancel order" });
    }
};

// ✅ Get all orders (Admin or Seller view)
export const getAllOrders = async (req, res) => {
    try {
        let orders;

        if (req.user.role === "admin") {
            orders = await Order.find().populate("user", "fullname email").populate("items.product", "name price");
        } else if (req.user.role === "seller") {
            orders = await Order.find({ "items.seller": req.user.id })
                .populate("user", "fullname email")
                .populate("items.product", "name price");
        } else {
            return res.status(403).json({ message: "Not authorized to view orders" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("getAllOrders error:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

