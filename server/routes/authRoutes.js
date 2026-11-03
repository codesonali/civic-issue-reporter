const express = require("express");
const { registerUser ,loginUser ,getMe} = require("../controllers/authController");
const { protect , authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/staff-only", protect, authorize("staff", "admin"), (req, res) => {
  res.json({ message: "Welcome, staff member" });
});

module.exports = router;