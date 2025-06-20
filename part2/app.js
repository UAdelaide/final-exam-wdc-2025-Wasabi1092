const express = require('express');
const router = express.Router();
const path = require('path');
const db = require ('./models/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

app.use('/', router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const [rows] = db.execute("SELECT * FROM Users WHERE username=?", [username]);
  
}))

// Export the app instead of listening here
module.exports = app;
