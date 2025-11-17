const { getUserId } = require("../service/auth");

async function checkAuth(req, res, next) {
  const userSessionId = req.cookies.sessionId;

  if (!userSessionId) {
    return res.status(401).json({ error: "Unauthorized - Please login" });
  }

  const user = getUserId(userSessionId);

  if (!user) {
    return res
      .status(401)
      .json({ error: "Invalid session - Please login again" });
  }

  req.user = user;
  next();
}

module.exports = { checkAuth };
