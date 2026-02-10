// server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // serve static files (HTML, CSS, JS)

// In-memory OTP store
const otpStore = {}; // { phone: otp }

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ===== Send OTP =====
app.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.json({ success: false, message: 'Phone number required' });

  const otp = generateOTP();
  otpStore[phone] = otp;

  console.log(`OTP for ${phone}: ${otp}`); // demo, replace with SMS API in production

  res.json({ success: true, message: 'OTP sent!' });
});

// ===== Verify OTP =====
app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.json({ success: false, message: 'Invalid request' });

  if (otpStore[phone] && otpStore[phone] === otp) {
    delete otpStore[phone]; // OTP used
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Incorrect OTP' });
  }
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
