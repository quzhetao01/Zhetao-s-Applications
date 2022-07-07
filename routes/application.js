const express = require('express');
const router = express.Router();

router.get('/minesweeper', (req, res) => {
  if (req.isAuthenticated()){
    res.send("Minesweeper");
  }
  else {
    res.redirect('../login');
  }
});

module.exports = router;