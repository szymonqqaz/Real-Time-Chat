const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log('reg')
  res.send("Server is up and running.").status(200);
});

export default router;