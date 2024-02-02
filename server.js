require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const PORT = 8000;

const posts = [
  {
    username: "one",
    title: "title1",
  },
  {
    username: "two",
    title: "title2",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  //Authentication User

  const username = req.body.username;
  const user = { name: username };

  // compare
  

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
  const authHeader = req.header("authorization");
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log("Application runnig at http://localhost:" + PORT);
});
