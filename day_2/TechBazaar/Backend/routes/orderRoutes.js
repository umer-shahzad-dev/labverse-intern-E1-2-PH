import express from "express";
import {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Place new order (Logged-in user only)
router.post("/", protect, placeOrder);

// ✅ Get my orders (User)
router.get("/my-orders", protect, getMyOrders);

// ✅ Cancel my order (Only user, and only if not delivered)
router.delete("/cancel/:id", protect, cancelOrder);

// ✅ Update order status (Only seller who owns the product)
router.put("/update-status/:id", protect, authorizeRoles("seller"), updateOrderStatus);

// ✅ Get all orders (Admin or seller)
router.get("/", protect, authorizeRoles("admin", "seller"), getAllOrders);

export default router;
