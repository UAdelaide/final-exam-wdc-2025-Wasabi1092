const express = require('express');
const router = express.Router();
const db = require('../models/db');


router.get('/api/dogs', async function(req, res) {
  const [dogs] = await db.execute(`
    SELECT Dogs.Dogs.name as dog_name, Dogs.size, Users.username AS owner_username FROM Dogs JOIN Users ON Dogs.owner_id=Users.user_id
  `);
  res.send(dogs);
});

router.post("/login", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM Users WHERE username=?", [req.body.user]);
  if (rows.length === 0) {
    res.status(200).json({ result: 'failure' });
  } else if (rows[0].password_hash === req.body.pass) {
    req.session.user = rows[0];
    res.status(200).json({ result: 'success', user_type: rows[0].role });
  } else {
    res.status(200).json({ result: 'failure' });
  }
});

router.post("/logout", (req, res) => {
  delete req.session.user;
  res.status(200).send();
});

module.exports = router;
