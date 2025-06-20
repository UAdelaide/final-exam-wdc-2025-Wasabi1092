const express = require('express');
const router = express.Router();
const path = require('path');
var session = require('express-session');
const db = require ('./models/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const indexRoutes = require('./routes/index');
app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.use('/', indexRoutes);

// Export the app instead of listening here
module.exports = app;
