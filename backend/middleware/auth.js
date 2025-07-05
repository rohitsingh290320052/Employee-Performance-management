const jwt = require("jsonwebtoken");

exports.authMiddleware = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err || (roles.length && !roles.includes(user.role))) {
      return res.status(403).json({ error: "Access denied" });
    }
    req.user = user;
    next();
  });
};
