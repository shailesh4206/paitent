const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require('fs');
require("dotenv").config();

const logFile = path.join(__dirname, 'server_log.txt');
const log = (msg, type = 'LOG') => {
  const t = new Date().toISOString();
  const line = `[${t}] ${type}: ${msg}\n`;
  fs.appendFileSync(logFile, line);
};

// Override console to capture everything
const originalLog = console.log;
const originalError = console.error;
console.log = (...args) => {
  log(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '), 'LOG');
  originalLog(...args);
};
console.error = (...args) => {
  log(args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' '), 'ERR');
  originalError(...args);
};

console.log('--- SERVER STARTING ---');

// Enhanced error logging for debugging silent crashes
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

// Set default JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "vectorax_healthcare_secret_key_2024";
}
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = "mongodb+srv://shaileshmitkari40:Shailesh@cluster0.jyajky2.mongodb.net/venetcta?retryWrites=true&w=majority";
}

const connectDB = require("./config/db");

// Connect MongoDB
connectDB();

const app = express();

// Middleware
// CORS - Allow requests from Vercel frontend
// ✅ Render/Vercel: origins updated for both platforms

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:*',
  'https://*.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Frontend serving removed - Pure API backend for Render
// app.use(express.static(path.join(__dirname, '../frontend')));

// -------- ROUTE IMPORTS --------
const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const helpRoutes = require("./routes/helpRoutes");
const patientRoutes = require("./routes/patientRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// -------- ROUTE MOUNT --------
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/payment", paymentRoutes);

// -------- HEALTH CHECK --------
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server running"
  });
});

// -------- ROOT ROUTE --------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "WealthIris Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      doctors: "/api/doctors",
      appointments: "/api/appointments",
      help: "/api/help",
      patient: "/api/patient"
    }
  });
});

// -------- 404 --------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// -------- START SERVER --------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("-----------------------------------------");
  console.log("🚀 Server Started Successfully");
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🧪 Health: http://localhost:${PORT}/api/health`);
  console.log("-----------------------------------------");
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`ERROR: Port ${PORT} is already in use.`);
  } else {
    console.error('ERROR starting server:', err.message);
  }
  process.exit(1);
});