const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

app.set("trust proxy", 1);
app.use(express.json());

app.use(session({
  name: "oc.sid",
  secret: process.env.SESSION_SECRET || "orange-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "lax"
  }
}));

app.use(express.static(path.join(__dirname, "public")));

const users = [
  { id: 1, email: "admin@test.com", password: "123456", name: "Najmul" }
];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/login", (req, res) => {

  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Wrong login" });
  }

  req.session.user = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  res.json({ success: true });
});

function auth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

app.get("/api/dashboard", auth, (req, res) => {
  res.json({
    user: req.session.user,
    stats: {
      totalNumbers: 18,
      todayCalls: 1264
    }
  });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("oc.sid");
    res.json({ ok: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
