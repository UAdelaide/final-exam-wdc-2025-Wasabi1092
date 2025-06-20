var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql2 = require('mysql2/promise');

var apiRouter = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  try {
    const con = await mysql2.createConnection({
      host: "localhost"
    });
    await con.query("CREATE DATABASE IF NOT EXISTS DogWalkService");
    await con.end();
    const db = await mysql2.createConnection({
      host: 'localhost',
      database: 'DogWalkService'
    });

    await db.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('owner', 'walker') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    // handle error
  }
})();

app.use('/api', apiRouter);

module.exports = app;
