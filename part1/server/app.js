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
    // dump all tables in one go
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
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Dogs (
        dog_id INT AUTO_INCREMENT PRIMARY KEY,
        owner_id INT NOT NULL,
        name VARCHAR(50) NOT NULL,
        size ENUM('small', 'medium', 'large') NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES Users(user_id)
      );
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS WalkRequests (
        request_id INT AUTO_INCREMENT PRIMARY KEY,
        dog_id INT NOT NULL,
        requested_time DATETIME NOT NULL,
        duration_minutes INT NOT NULL,
        location VARCHAR(255) NOT NULL,
        status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
      );
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS WalkApplications (
        application_id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT NOT NULL,
        walker_id INT NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
        FOREIGN KEY (walker_id) REFERENCES Users(user_id),
        CONSTRAINT unique_application UNIQUE (request_id, walker_id)
      );
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS WalkRatings (
        rating_id INT AUTO_INCREMENT PRIMARY KEY,
        request_id INT NOT NULL,
        walker_id INT NOT NULL,
        owner_id INT NOT NULL,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        comments TEXT,
        rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
        FOREIGN KEY (walker_id) REFERENCES Users(user_id),
        FOREIGN KEY (owner_id) REFERENCES Users(user_id),
        CONSTRAINT unique_rating_per_walk UNIQUE (request_id)
      );
    `);
    let [rows] = await db.execute("SELECT COUNT(*) as count from Users");
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO Users (username, email, password_hash, role) VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
        ('davidwalker', 'david@example.com', 'hashed012', 'walker'),
        ('ethan123', 'ethan@example.com', 'hashed345', 'owner');
      `);
    }

    [rows] = await db.execute("SELECT COUNT(*) as count from Dogs");
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO Dogs (owner_id, name, size) VALUES
        ((SELECT user_id FROM Users WHERE username='alice123'), 'Max', 'medium'),
        ((SELECT user_id FROM Users WHERE username='carol123'), 'Bella', 'small'),
        ((SELECT user_id FROM Users WHERE username='ethan123'), 'Bobby', 'large'),
        ((SELECT user_id FROM Users WHERE username='alice123'), 'Richie', 'medium'),
        ((SELECT user_id FROM Users WHERE username='carol123'), 'Monty', 'small');
      `);
    }

    [rows] = await db.execute("SELECT COUNT(*) as count from WalkRequests");
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
        ((SELECT dog_id FROM Dogs WHERE name='Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name='Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
        ((SELECT dog_id FROM Dogs WHERE name='Bobby'), '2025-06-12 08:00:00', 15, 'Glenelg Beach', 'completed'),
        ((SELECT dog_id FROM Dogs WHERE name='Richie'), '2025-06-18 08:30:00', 60, 'Parklands', 'completed'),
        ((SELECT dog_id FROM Dogs WHERE name='Monty'), '2025-06-20 10:30:00', 30, 'Beachside Ave', 'completed');
      `);
    }

    [rows] = await db.execute("SELECT COUNT(*) as count from WalkRatings");
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments) VALUES
        (3, (SELECT user_id from Users WHERE username='davidwalker'), (SELECT user_id from Users WHERE username='ethan123'), 3, "N/A"),
        (4, (SELECT user_id from Users WHERE username='davidwalker'), (SELECT user_id from Users WHERE username='alice123'), 5, "N/A"),
        (5, (SELECT user_id from Users WHERE username='davidwalker'), (SELECT user_id from Users WHERE username='carol123'), 2, "N/A");
      `);
    }

  } catch (err) {
    console.error(err);
  }
})();

app.use('/api', apiRouter);

module.exports = app;
