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

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
(())