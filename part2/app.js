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
  if (rows.length === 0) {
    res.status(200).json({ result: 'failure' });
  } else {
    // normally you would use whatever hashing alg to check this,
    // but since the password is unhashed, just do this
    if (rows[0].password_hash === password) {
      res.status(200).json({ result: 'success' });
    }
  }
}))

// Export the app instead of listening here
module.exports = app;
