var express = require('express');
var router = express.Router();
var mysql2 = require("mysql2/promise");


/* GET home page. */
router.get('/dogs', async function(req, res) {
  let db = await mysql2.createConnection({
    host: 'localhost',
    database: 'DogWalkService'
  });
  const [dogs] = db.execute(`
    SELECT Dogs.name, Dogs.size, Users.username AS owner_username FROM Do
  `);
});

module.exports = router;
