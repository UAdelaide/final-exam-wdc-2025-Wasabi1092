const express = require('express');
const router = express.Router();
const db = require('../models/db');


router.post("/login", (req, res) => {
  const { user, password } = req.body;
  const [rows] = db.execute("SELECT * FROM Users WHERE username=?", [username]);
  if (rows.length === 0) {
    res.status(200).json({ result: 'failure' });
  } else if (rows[0].password_hash === password) {
    res.status(200).json({ result: 'success', user_type: rows[0].role });
  } else {
    res.status(200).json({ result: 'failure' });
  }
})

module.exports = router;
