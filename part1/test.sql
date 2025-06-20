USE DogWalkService;

-- Insert users into table Users;
INSERT INTO Users (username, email, password_hash, role) VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('davidwalker', 'david@example.com', 'hashed012', 'walker'),
('ethan123', 'ethan@example.com', 'hashed345', 'owner');

-- Insert dogs into table Dogs;
INSERT INTO Dogs (owner_id, name, size) VALUES
((SELECT user_id FROM Users WHERE username='alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username='carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username='ethan123'), 'Bobby', 'large'),
((SELECT user_id FROM Users WHERE username='alice123'), 'Richie', 'medium'),
((SELECT user_id FROM Users WHERE username='carol123'), 'Monty', 'small');

-- Insert requests into table WalkRequests;
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
((SELECT dog_id FROM Dogs WHERE name='Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name='Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
((SELECT dog_id FROM Dogs WHERE name='Bobby'), '2025-06-12 08:00:00', 15, 'Glenelg Beach', 'open'),
((SELECT dog_id FROM Dogs WHERE name='Richie'), '2025-06-18 08:30:00', 60, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name='Monty'), '2025-06-20 10:30:00', 30, 'Beachside Ave', 'open');

-- Insert reviews into table WalkRatings;
INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments) VALUES
(1, (SELECT user_id from Users WHERE username='bobwalker'), (SELECT user_id from Users WHERE username='alice123'), 4, "N/A"),
(2, (SELECT user_id from Users WHERE username='bobwalker'), (SELECT user_id from Users WHERE username='carol123'), 1, "N/A"),
(3, (SELECT user_id from Users WHERE username='davidwalker'), (SELECT user_id from Users WHERE username='ethan123'), 3, "N/A"),
(4, (SELECT user_id from Users WHERE username='davidwalker'), (SELECT user_id from Users WHERE username='alice123'), 5, "N/A"),
(5, (SELECT user_id from Users WHERE username='davidwalker'), (SELECT user_id from Users WHERE username='carol123'), 2, "N/A");


SELECT
Users.username AS walker_username,
COUNT(WalkRatings.walker_id) AS total_ratings,
AVG(WalkRatings.rating) AS average_rating,
COUNT(CASE WHEN WalkRequests.status='completed' THEN 1 END) AS completed_walks
FROM WalkRatings
JOIN Users ON WalkRatings.walker_id=Users.user_id
JOIN WalkRequests ON WalkRequests.request_id=WalkRatings.request_id
GROUP BY Users.username;