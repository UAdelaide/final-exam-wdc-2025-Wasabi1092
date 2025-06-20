USE DogWalkService;

INSERT INTO Users (username, email, password_hash, role) VALUES

('alice123', 'alice@example.com', 'hashed_123', 'owner'),

('bobwalker', 'bob@example.com', 'hashed_456', 'walker'),

('carol123', 'carol@example.com', 'hashed789', 'owner'),

('davidwalker', 'david@example.com', 'hashed012', 'walker'),

('ethan123', 'ethan@example.com', 'hashed345', 'owner');
