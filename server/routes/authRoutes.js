const express = require("express");
const { registerUser ,loginUser ,getMe} = require("../controllers/authController");
const { protect , authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiter");
const { registerSchema, loginSchema } = require("../validators/schemas");

const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
router.post("/register", authLimiter, validate(registerSchema), registerUser);
router.post("/login", authLimiter, validate(loginSchema), loginUser);
router.get("/me", protect, getMe);
router.get("/staff-only", protect, authorize("staff", "admin"), (req, res) => {
  res.json({ message: "Welcome, staff member" });
});

module.exports = router;