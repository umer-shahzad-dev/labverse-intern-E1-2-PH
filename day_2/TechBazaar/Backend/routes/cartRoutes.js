import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Add item to cart
router.post("/add", protect, addToCart);

// ✅ Get all cart items of the logged-in user
router.get("/", protect, getUserCart);

// ✅ Update quantity of a cart item
router.put("/:id", protect, updateCartItem);

// ✅ Delete a cart item
router.delete("/:id", protect, removeCartItem);

// 🔄 Optional: Clear all cart items
router.delete("/", protect, clearCart);

export default router;
