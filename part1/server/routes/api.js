var express = require('express');
var router = express.Router();
var mysql2 = require("mysql2/promise");


// api/dogs endpoint
router.get('/dogs', async function(req, res) {
  let db = await mysql2.createConnection({
    host: 'localhost',
    database: 'DogWalkService'
  });
  const [dogs] = await db.execute(`
    SELECT Dogs.name as dog_name, Dogs.size, Users.username AS owner_username FROM Dogs JOIN Users ON Dogs.owner_id=Users.user_id
  `);
  res.send(dogs);
});

// api/walkrequests/open endpoint

router.get('/walkrequests/open', async function(req, res) {
  let db = await mysql2.createConnection({
    host: 'localhost',
    database: 'DogWalkService'
  });
  const [requests] = await db.execute(`
    SELECT WalkRequests.request_id, Dogs.name as dog_name, WalkRequests.requested_time, WalkRequests.duration_minutes, WalkRequests.location, Users.username AS owner_username FROM Dogs JOIN Users ON Dogs.owner_id=Users.user_id JOIN WalkRequests ON Dogs.dog_id=WalkRequests.dog_id WHERE status='open'
  `);
  res.send(requests);
});

// api/walkers/summary endpoint
router.get('/walkers/summary', async function (req, res) {
  let db = await mysql2.createConnection({
    host: 'localhost',
    database: 'DogWalkService'
  });
  let payload = [];
  const [walkers] = await db.execute(`
    SELECT * FROM Users WHERE role='walker';
  `);
  for (let i=0; i< walkers.length; i++) {
    payload.push({
      walker_username: walkers[i].username,
      total_ratings: 0,
      average_rating: null,
      completed_walks: 0
    });
  }
  const [data] = await db.execute(`
    SELECT
    Users.username AS walker_username,
    COUNT(WalkRatings.walker_id) AS total_ratings,
    AVG(WalkRatings.rating) AS average_rating,
    COUNT(CASE WHEN WalkRequests.status='completed' THEN 1 END) AS completed_walks
    FROM Users
    JOIN WalkRatings ON WalkRatings.walker_id=Users.user_id
    JOIN WalkRequests ON WalkRequests.request_id=WalkRatings.request_id
    GROUP BY Users.username;
  `);
  for (let i=0; i<data.length; i++) {
    for (let j=0; j<payload.length; j++){
      if (payload[j].walker_username === data[i].walker_username) {
        payload[j].total_ratings =
      }
    }
  }
  res.send(payload);
});

module.exports = router;
