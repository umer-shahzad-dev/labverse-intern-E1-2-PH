import CartItem from "../models/cartModel.js";
import Product from "../models/productModel.js";

// ✅ Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if item already in cart
        let cartItem = await CartItem.findOne({
            user: req.user.id,
            product: productId,
        });

        if (cartItem) {
            cartItem.quantity += quantity || 1;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                user: req.user.id,
                product: productId,
                quantity: quantity || 1,
            });
        }

        res.status(200).json({ message: "Item added to cart", cartItem });
    } catch (error) {
        console.error("addToCart error:", error);
        res.status(500).json({ message: "Failed to add item to cart" });
    }
};

// ✅ Get all items in user's cart
export const getUserCart = async (req, res) => {
    try {
        const cartItems = await CartItem.find({ user: req.user.id }).populate("product");
        res.status(200).json(cartItems);
    } catch (error) {
        console.error("getUserCart error:", error);
        res.status(500).json({ message: "Failed to fetch cart" });
    }
};

// ✅ Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const cartItem = await CartItem.findById(id);
        if (!cartItem || cartItem.user.toString() !== req.user.id) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: "Cart updated", cartItem });
    } catch (error) {
        console.error("updateCartItem error:", error);
        res.status(500).json({ message: "Failed to update cart item" });
    }
};

// ✅ Remove single item from cart
export const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        const cartItem = await CartItem.findById(id);
        if (!cartItem || cartItem.user.toString() !== req.user.id) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        await cartItem.deleteOne();
        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("removeCartItem error:", error);
        res.status(500).json({ message: "Failed to remove item" });
    }
};

// 🔄 (Optional) Clear all items from cart
export const clearCart = async (req, res) => {
    try {
        await CartItem.deleteMany({ user: req.user.id });
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error("clearCart error:", error);
        res.status(500).json({ message: "Failed to clear cart" });
    }
};
