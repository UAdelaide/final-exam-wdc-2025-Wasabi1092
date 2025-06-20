const express = require('express');
const router = express.Router();
const db = require('../models/db');


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

router.get("/logout", (req, res) => {
  req.session = ""
})

module.exports = router;
