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


module.exports = router;
