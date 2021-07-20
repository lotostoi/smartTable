const { Router } = require("express");
const TOKEN_SECRET_KEY = require("../config/secret-key");
const jwt = require("jsonwebtoken");

const router = Router();

const user = {
  username: "admin",
  password: "12345",
};

router.get("/api/auth/:token", async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(200).send({ res: false });
  }
});

router.post("/api/auth", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username !== user.username || password !== user.password) {
    return res.status(200).json({ result: false });
  }

  res.status(200).json({ ...user, result: true, token: jwt.sign(user, TOKEN_SECRET_KEY) });
});

module.exports = router;
