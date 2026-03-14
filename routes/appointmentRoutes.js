const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getMyAppointments,
  getAppointment,
  cancelAppointment,
  getAllAppointments
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

// Create appointment
router.post("/", createAppointment);

// Get logged in user appointments (must be before /:id to avoid "my" being captured as id)
router.get("/my", getMyAppointments);

// Cancel appointment (must be before /:id to avoid "cancel" being captured as id)
router.put("/cancel/:id", cancelAppointment);

// Admin - get all appointments (must be before /:id to avoid being captured as id)
router.get("/", getAllAppointments);

// Get single appointment (must be last as it's the catch-all)
router.get("/:id", getAppointment);

module.exports = router;

