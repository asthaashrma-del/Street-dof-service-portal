require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ✅ Using bcryptjs
const cors = require('cors');
const Dog = require('./models/Dog'); // Import Dog model
const reportRoutes = require('./routes/report');
const dogRoutes = require('./routes/dogs');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', reportRoutes); 
app.use('/api/dogs', dogRoutes);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// ✅ User Schema & Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String, // Hashed Password
});

const User = mongoose.model("User", userSchema);

// Register Route
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "❌ All fields are required!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "❌ Email already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ success: true, message: "✅ Registration Successful!" });
    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ success: false, message: "❌ Server Error", error: error.message });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "❌ User not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "❌ Invalid credentials!" });

        res.status(200).json({ success: true, message: "✅ Login Successful!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Server Error" });
    }
});

// Route to get all dogs (for testing purposes)
app.get('/api/dogs', async (req, res) => {
    try {
        const dogs = await Dog.find();
        res.status(200).json(dogs); // Send list of all dogs
    } catch (error) {
        console.error("❌ Error fetching dogs:", error);
        res.status(500).json({ success: false, message: "❌ Error fetching dogs", error: error.message });
    }
});

// Route to get unique dog locations
app.get('/api/locations', async (req, res) => {
    try {
        const locations = await Dog.distinct('location');
        res.status(200).json(locations);
    } catch (error) {
        console.error("❌ Error fetching locations:", error);
        res.status(500).json({ success: false, message: "❌ Error fetching locations", error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
